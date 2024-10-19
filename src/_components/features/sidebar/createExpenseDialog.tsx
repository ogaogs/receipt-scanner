"use client";

import React, { FC, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Button,
} from "@mui/material";
import { Category } from "@/types";
import {
  ReceiptUpload,
  AddExpenseDetail,
} from "@/_components/features/sidebar";
import { formatAndCreateExpense } from "@/_components/features/sidebar/SidebarServer";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type CreateDialogProps = {
  handleClose: () => void;
  open: boolean;
  categories: Category[];
  userId: string;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  fileName: string | null;
  setFileName: React.Dispatch<React.SetStateAction<string | null>>;
  pathname: string;
  selectedDate: string;
  router: AppRouterInstance; // できるだけ、インスタンスを増やさないようにする
};

export const CreateExpenseDialog: FC<CreateDialogProps> = ({
  handleClose,
  open,
  categories,
  userId,
  selectedImage,
  setSelectedImage,
  fileName,
  setFileName,
  pathname,
  selectedDate,
  router,
}) => {
  const dateRef = useRef<HTMLInputElement>(null);
  const storeNameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);

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
    if (
      dateRef.current?.value &&
      storeNameRef.current?.value &&
      amountRef.current?.value &&
      categoryRef.current?.value
    ) {
      formatAndCreateExpense(
        userId,
        dateRef.current.value,
        storeNameRef.current.value,
        Number(amountRef.current.value),
        Number(categoryRef.current.value),
        fileName
      );
      router.push(pathname + "?date=" + selectedDate + "&update=true");
    } else {
      // TODO: エラーの対応を考える
      console.log("The selected values are invalid");
    }

    handleClose();
  };

  const handleAnalyze = () => {
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
            dateRef={dateRef}
            storeNameRef={storeNameRef}
            amountRef={amountRef}
            categoryRef={categoryRef}
            categories={categories}
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
            <Button
              variant="contained"
              sx={{ fontWeight: "bold" }}
              onClick={handleAnalyze}
            >
              レシート解析
            </Button>
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
