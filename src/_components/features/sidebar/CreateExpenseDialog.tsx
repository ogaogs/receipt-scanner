"use client";

import React, { FC } from "react";
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);
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
        fileName
      );
      setExpenseDate(analyzedReceiptDate.date); // 解析された日付をセット
      setStoreName(analyzedReceiptDate.storeName); // 解析された店名をセット
      setAmount(analyzedReceiptDate.amount); // 解析された金額をセット
      setCategoryId(analyzedReceiptDate.category); // 解析されたカテゴリをセット
    }
    console.log("解析");
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
                accept="image/*"
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
          >
            作成
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
