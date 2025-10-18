"use client";

import React, { FC, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Category } from "@/types";
import { ExpenseDetail } from "@/_components/features/sidebar/type";
import {
  ReceiptUpload,
  AddExpenseDetail,
} from "@/_components/features/sidebar";
import {
  formatAndCreateExpense,
  getReceiptDetail,
  uploadImageToS3,
  deleteReceiptImage,
} from "@/_components/features/sidebar/SidebarActions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type CreateDialogProps = {
  handleClose: () => void;
  open: boolean;
  categories: Category[];
  userId: string;
  pathname: string;
  selectedDate: string;
  router: AppRouterInstance; // できるだけ、インスタンスを増やさないようにする
  expenseDetailUseState: ExpenseDetail;
};

const MAX_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5MB

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const validateFileType = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result || !(reader.result instanceof ArrayBuffer)) {
        resolve(false);
        return;
      }
      const arr = new Uint8Array(reader.result);

      // JPEG: FF D8 FF
      if (
        arr.length >= 3 &&
        arr[0] === 0xff &&
        arr[1] === 0xd8 &&
        arr[2] === 0xff
      ) {
        resolve(true);
        return;
      }

      // PNG: 89 50 4E 47 0D 0A 1A 0A
      if (
        arr.length >= 8 &&
        arr[0] === 0x89 &&
        arr[1] === 0x50 &&
        arr[2] === 0x4e &&
        arr[3] === 0x47 &&
        arr[4] === 0x0d &&
        arr[5] === 0x0a &&
        arr[6] === 0x1a &&
        arr[7] === 0x0a
      ) {
        resolve(true);
        return;
      }

      resolve(false);
    };
    reader.onerror = () => {
      resolve(false);
    };
    reader.readAsArrayBuffer(file.slice(0, 8));
  });
};

export const CreateExpenseDialog: FC<CreateDialogProps> = ({
  handleClose,
  open,
  categories,
  userId,
  pathname,
  selectedDate,
  router,
  expenseDetailUseState,
}) => {
  const {
    expenseDate,
    setExpenseDate,
    storeName,
    setStoreName,
    amount,
    setAmount,
    categoryId,
    setCategoryId,
    selectedImage,
    setSelectedImage,
    fileName,
    setFileName,
  } = expenseDetailUseState;
  const [isCreateDisabled, setIsCreateDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  type LoadingState =
    | "idle"
    | "uploading"
    | "analyzing"
    | "creating"
    | "deleting";
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [isExpenseCreated, setIsExpenseCreated] = useState(false);

  const isUploading = loadingState === "uploading";
  const isAnalyzing = loadingState === "analyzing";
  const isCreating = loadingState === "creating";
  const isBusy = loadingState !== "idle";

  useEffect(() => {
    if (isExpenseCreated) {
      handleDialogClose();
    }
  }, [isExpenseCreated]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        setLoadingState("uploading");
        setErrorMessage(null);

        // ファイルサイズチェック
        if (file.size > MAX_SIZE_IN_BYTES) {
          throw new ValidationError(
            `ファイルサイズが大きすぎます。${
              MAX_SIZE_IN_BYTES / (1024 * 1024)
            }MB以下のファイルを選択してください。`
          );
        }

        // ファイルタイプチェック（マジックナンバーでの検証）
        const isValidFileType = await validateFileType(file);
        if (!isValidFileType) {
          throw new ValidationError(
            "PNG または JPEG ファイルのみアップロード可能です。"
          );
        }
        const fileNameUUID = crypto.randomUUID();
        const fileExtension = file.name.split(".").pop();
        const fileName = `${fileNameUUID}.${fileExtension}`;
        setFileName(fileName); // UUIDファイル名を保存
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              resolve(reader.result as string);
            } else {
              reject(new Error("画像のアップロードに失敗しました。"));
            }
          };
          reader.onerror = () =>
            reject(new Error("画像のアップロードに失敗しました。"));
          reader.readAsDataURL(file);
        });

        // S3へのアップロードを試行
        const uploadResult = await uploadImageToS3(fileName, base64Image);
        if (!uploadResult.success) {
          // アップロードに失敗した場合は画像をリセット
          setFileName(null);
          throw new Error("画像のアップロードに失敗しました。");
        }

        // アップロード成功後に画像を表示
        setSelectedImage(base64Image);
      } catch (error) {
        if (error instanceof ValidationError) {
          setErrorMessage(error.message); // 詳細なバリデーションエラーメッセージを表示
        } else {
          setErrorMessage("画像のアップロードに失敗しました。"); // 汎用メッセージ
        }
      } finally {
        setLoadingState("idle");
      }
    }

    // 同じファイルを再選択可能にするため、input値をクリア
    event.target.value = "";
  };

  const handleCreateExpense = async () => {
    if (expenseDate && storeName && amount && categoryId) {
      try {
        setLoadingState("creating");
        setErrorMessage(null);

        await formatAndCreateExpense(
          userId,
          expenseDate,
          storeName,
          amount,
          categoryId,
          fileName
        );

        setIsExpenseCreated(true);
        router.push(pathname + "?date=" + selectedDate + "&update=true");
      } catch {
        setErrorMessage("支出の作成に失敗しました。もう一度お試しください。");
      } finally {
        setLoadingState("idle");
      }
    } else {
      setErrorMessage("全ての必須項目を入力してください。");
    }
  };

  const handleAnalyze = async () => {
    if (selectedImage && fileName) {
      try {
        setErrorMessage(null);
        setLoadingState("analyzing");
        const analyzedReceiptDateRes = await getReceiptDetail(
          fileName,
          categories
        );
        if (!analyzedReceiptDateRes.success) {
          setErrorMessage(analyzedReceiptDateRes.error);
        }
        if (analyzedReceiptDateRes.success) {
          setExpenseDate(analyzedReceiptDateRes.data.date); // 解析された日付をセット
          setStoreName(analyzedReceiptDateRes.data.storeName); // 解析された店名をセット
          setAmount(analyzedReceiptDateRes.data.amount); // 解析された金額をセット
          setCategoryId(analyzedReceiptDateRes.data.category); // 解析されたカテゴリをセット

          // 解析できなかった場合の警告メッセージ
          if (!analyzedReceiptDateRes.data.isAnalyzed) {
            setErrorMessage(
              "画像からレシート情報を取得できませんでした。鮮明な写真でお試しください。"
            );
          }
        }
      } catch {
        setErrorMessage(
          "レシート解析中にエラーが発生しました。サポートまでお問い合わせください。"
        );
      } finally {
        setLoadingState("idle");
      }
    }
  };

  const handleImageRemove = async () => {
    try {
      setLoadingState("deleting");
      if (fileName) {
        await deleteReceiptImage(fileName);
      }
      setSelectedImage(null);
      setFileName(null);
    } finally {
      setLoadingState("idle");
    }
  };

  const handleDialogClose = async () => {
    if (isBusy) {
      return;
    }
    handleClose();

    // 状態をリセット
    setIsExpenseCreated(false);
    setLoadingState("idle");
    setErrorMessage(null);

    if (fileName && !isExpenseCreated) {
      deleteReceiptImage(fileName);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      sx={{
        "& .MuiDialog-paper": {
          right: "10%",
          width: "50%",
          height: "70%",
        },
      }}
    >
      <DialogContent>
        <Box display="flex" flexDirection="row" height={"100%"}>
          <ReceiptUpload
            selectedImage={selectedImage}
            handleImageRemove={handleImageRemove}
            disabled={isBusy}
          />
          <AddExpenseDetail
            categories={categories}
            expenseDetailUseState={expenseDetailUseState}
            setIsCreateDisabled={setIsCreateDisabled}
          />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{ paddingX: "20px", paddingBottom: "24px", paddingTop: 0 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box>
            <Button
              variant="contained"
              component="label"
              sx={{ fontWeight: "bold", marginRight: "24px" }}
              disabled={isBusy}
            >
              {isUploading ? "アップロード中..." : "アップロード"}
              <input
                type="file"
                accept="image/png,image/jpeg" // MIMETypeを指定
                onChange={handleImageUpload}
                width="100%"
                style={{ display: "none" }}
              />
            </Button>
            {selectedImage ? (
              <Button
                variant="contained"
                sx={{ fontWeight: "bold" }}
                onClick={handleAnalyze}
                disabled={isBusy}
              >
                {isAnalyzing ? "解析中..." : "レシート解析"}
              </Button>
            ) : null}
          </Box>
          <Button
            variant="contained"
            sx={{ fontWeight: "bold" }}
            onClick={handleCreateExpense}
            disabled={isCreateDisabled || isBusy}
          >
            {isCreating ? "作成中..." : "作成"}
          </Button>
        </Box>
      </DialogActions>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};
