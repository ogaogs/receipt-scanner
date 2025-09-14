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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExpenseCreated, setIsExpenseCreated] = useState(false);

  useEffect(() => {
    handleDialogClose();
  }, [isExpenseCreated]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      // ファイルサイズチェック
      if (file.size > MAX_SIZE_IN_BYTES) {
        setErrorMessage(
          `ファイルサイズが大きすぎます。${
            MAX_SIZE_IN_BYTES / (1024 * 1024)
          }MB以下のファイルを選択してください。`
        );
        return;
      }

      // ファイルタイプチェック（マジックナンバーでの検証）
      const isValidFileType = await validateFileType(file);
      if (!isValidFileType) {
        setErrorMessage("PNG または JPEG ファイルのみアップロード可能です。");
        return;
      }
      const fileNameUUID = crypto.randomUUID();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${fileNameUUID}.${fileExtension}`;
      setFileName(fileName); // UUIDファイル名を保存
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setSelectedImage(base64Image); // base64をstringでセット

        // S3へのアップロードを試行
        const uploadResult = await uploadImageToS3(fileName, base64Image);
        if (!uploadResult.success) {
          // アップロードに失敗した場合は画像をリセット
          setSelectedImage(null);
          setFileName(null);
          setErrorMessage(
            "画像のアップロードに失敗しました。もう一度お試しください。"
          );
        }
      };
      reader.readAsDataURL(file); // base64に置き換え
    }
  };

  const handleCreateExpense = () => {
    if (expenseDate && storeName && amount && categoryId) {
      formatAndCreateExpense(
        userId,
        expenseDate,
        storeName,
        amount,
        categoryId,
        fileName
      );
      setIsExpenseCreated(true);
      router.push(pathname + "?date=" + selectedDate + "&update=true");
    } else {
      setErrorMessage("全ての必須項目を入力してください。");
    }
  };

  const handleAnalyze = async () => {
    if (selectedImage && fileName) {
      try {
        setErrorMessage(null);
        setIsAnalyzing(true);
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
        setIsAnalyzing(false);
      }
    }
  };

  const handleImageRemove = async () => {
    if (fileName) {
      await deleteReceiptImage(fileName);
    }
    setSelectedImage(null);
    setFileName(null);
  };

  const handleDialogClose = async () => {
    // 作成されていない場合のみ画像を削除
    if (fileName && !isExpenseCreated) {
      console.log("イメージ削除中");
      await deleteReceiptImage(fileName);
    }

    // 状態をリセット
    setIsExpenseCreated(false);
    setErrorMessage(null);

    handleClose();
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
            handleImageUpload={handleImageUpload}
            handleImageRemove={handleImageRemove}
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
            >
              アップロード
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
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "解析中..." : "レシート解析"}
              </Button>
            ) : null}
          </Box>
          <Button
            variant="contained"
            sx={{ fontWeight: "bold" }}
            onClick={handleCreateExpense}
            disabled={isCreateDisabled}
          >
            作成
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
