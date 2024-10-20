"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
  FormControl,
  Select,
  InputLabel,
  FilledInput,
  InputAdornment,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { RowType } from "@/_components/features/expenses/type";
import { Category } from "@/types";
import {
  updateSelectedExpense,
  deleteSelectedExpense,
  downloadReceiptImage,
} from "@/_components/features/expenses/ExpensesServer";

type ExpensesDialogProps = {
  handleClose: () => void;
  open: boolean;
  selectedItem: RowType | null;
  categories: Category[];
  userId: string;
  firstDay: Date;
  lastDay: Date;
  getExpensesAndSetRows: (
    userId: string,
    firstDay: Date,
    lastDay: Date
  ) => Promise<void>;
};

export const ExpensesDialog: FC<ExpensesDialogProps> = ({
  handleClose,
  open,
  selectedItem,
  categories,
  userId,
  firstDay,
  lastDay,
  getExpensesAndSetRows,
}) => {
  const dateRef = useRef<HTMLInputElement>(null);
  const storeNameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const fileName = selectedItem?.fileName;
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const getReceiptImage = async (): Promise<void> => {
    if (fileName) {
      const downloadImg = await downloadReceiptImage(fileName);
      setReceiptImage(downloadImg);
    }
  };

  useEffect(() => {
    getReceiptImage();
  }, [fileName !== undefined]);

  // 更新ボタンの押下の際に実行する関数
  const upddateExpenses: () => void = () => {
    if (
      selectedItem?.expenseId &&
      dateRef.current?.value &&
      storeNameRef.current?.value &&
      amountRef.current?.value &&
      categoryRef.current?.value
    ) {
      try {
        updateSelectedExpense(
          selectedItem.expenseId,
          dateRef.current.value,
          storeNameRef.current.value,
          Number(amountRef.current.value),
          Number(categoryRef.current.value)
        );
      } catch (error) {
        // TODO: エラーの対応を考える
        console.log(error);
      }
    } else {
      // TODO: エラーの対応を考える
      console.log("Failed to update the expense");
    }

    // データを再取得し、rowsをセットする
    getExpensesAndSetRows(userId, firstDay, lastDay);

    handleClose();
  };

  // 削除ボタンの押下の際に実行する
  const deleteExpenses: () => void = () => {
    if (selectedItem?.expenseId) {
      try {
        deleteSelectedExpense(selectedItem.expenseId);
      } catch (error) {
        // TODO: エラーの対応を考える
        console.log(error);
      }
    } else {
      // TODO: エラーの対応を考える
      console.log("Failed to delete the expense");
    }

    // データを再取得し、rowsをセットする
    getExpensesAndSetRows(userId, firstDay, lastDay);

    handleClose();
  };
  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiDialog-paper": {
              right: "10%",
            },
          }}
        >
          <DialogContent>
            {selectedItem && (
              <Box
                display="flex"
                flexDirection="column"
                component="form"
                sx={{ "& .MuiTextField-root": { m: 1 } }}
              >
                {/* TODO: 全ての要素がrequiredでなければならない */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      defaultValue={dayjs(selectedItem.date)}
                      label="日付"
                      slotProps={{
                        calendarHeader: {
                          format: "YYYY年MM月", // カレンダーの年月の部分
                        },
                        textField: {
                          variant: "filled",
                        },
                      }}
                      format="YYYY年MM月DD" // 入力欄
                      inputRef={dateRef}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <TextField
                  id="store-name"
                  label="店名"
                  defaultValue={selectedItem.storeName}
                  variant="filled"
                  inputRef={storeNameRef}
                />
                <FormControl sx={{ m: 1, minWidth: 120 }} variant="filled">
                  <InputLabel id="amount">金額</InputLabel>
                  <FilledInput
                    startAdornment={
                      <InputAdornment position="start">¥</InputAdornment>
                    }
                    type="number"
                    defaultValue={selectedItem.amount}
                    inputRef={amountRef}
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel variant="filled">カテゴリー</InputLabel>
                  <Select
                    native
                    variant="filled"
                    defaultValue={selectedItem.categoryId}
                    inputRef={categoryRef}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{ fontWeight: "bold", marginRight: "64px" }}
              onClick={handleClose}
            >
              レシートを表示
            </Button>
            <Button
              variant="contained"
              sx={{ fontWeight: "bold" }}
              color="error"
              onClick={deleteExpenses}
            >
              削除
            </Button>
            <Button
              variant="contained"
              sx={{ fontWeight: "bold" }}
              onClick={upddateExpenses}
            >
              更新
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
