"use client";

import React, { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Button,
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
} from "@/_components/features/sidebar/SidebarServer";
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
      console.error("ファイルアップロード時のエラー:", reader.error);
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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      // ファイルサイズチェック (5MB制限)
      if (file.size > MAX_SIZE_IN_BYTES) {
        alert(
          "ファイルサイズが大きすぎます。5MB以下のファイルを選択してください。"
        );
        return;
      }

      // ファイルタイプチェック（マジックナンバーでの検証）
      const isValidFileType = await validateFileType(file);
      if (!isValidFileType) {
        alert("PNG または JPEG ファイルのみアップロード可能です。");
        return;
      }
      const fileNameUUID = crypto.randomUUID();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${fileNameUUID}.${fileExtension}`;
      setFileName(fileName); // UUIDファイル名を保存
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string); // base64をstringでセット
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
      router.push(pathname + "?date=" + selectedDate + "&update=true");
    } else {
      // TODO: エラーの対応を考える
      console.log("The selected values are invalid");
    }

    handleClose();
  };

  const handleAnalyze = async () => {
    if (selectedImage && fileName) {
      const analyzedReceiptDate = await getReceiptDetail(
        selectedImage,
        fileName,
        categories
      );
      setExpenseDate(analyzedReceiptDate.date); // 解析された日付をセット
      setStoreName(analyzedReceiptDate.storeName); // 解析された店名をセット
      setAmount(analyzedReceiptDate.amount); // 解析された金額をセット
      setCategoryId(analyzedReceiptDate.category); // 解析されたカテゴリをセット
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setFileName(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
                accept="image/png,image/jpeg" // MINETypeを指定
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
              >
                レシート解析
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
    </Dialog>
  );
};
