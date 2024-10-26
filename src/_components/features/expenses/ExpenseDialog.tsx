"use client";

import React, { FC, useEffect, useState } from "react";
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
  getPreSignedURL,
} from "@/_components/features/expenses/ExpensesServer";
import { ShowReceipt } from "@/_components/features/expenses";
import { error_red } from "@/_components/common/Style/style";

type ExpensesDialogProps = {
  handleClose: () => void;
  open: boolean;
  selectedItem: RowType;
  categories: Category[];
  userId: string;
  firstDay: Date;
  lastDay: Date;
  receiptImage: string | null;
  setReceiptImage: React.Dispatch<React.SetStateAction<string | null>>;
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
  receiptImage,
  setReceiptImage,
  getExpensesAndSetRows,
}) => {
  const fileName = selectedItem.fileName;

  const [expenseDate, setExpenseDate] = useState<Date>(selectedItem.date);
  const [storeName, setStoreName] = useState<string>(selectedItem.storeName);
  const [amount, setAmount] = useState<number>(selectedItem.amount);
  const [categoryId, setCategoryId] = useState<number>(selectedItem.categoryId);

  // エラー状態の管理
  const [storeNameError, setStoreNameError] = useState(true);
  const [amountError, setAmountError] = useState(true);

  // 更新ボタン
  const [isuUpdateDisabled, setIsUpdateDisabled] = useState(true);

  // バリデーションチェック関数
  const validateFields = () => {
    const isStoreNameValid = storeName?.trim() !== "";
    const isAmountValid = amount > 0;

    setStoreNameError(!isStoreNameValid);
    setAmountError(!isAmountValid);

    // 作成ボタンの有効/無効を親コンポーネントに伝える
    setIsUpdateDisabled(!(isStoreNameValid && isAmountValid));
  };

  // 入力が変更されるたびにバリデーションを実行
  useEffect(() => {
    validateFields();
  }, [storeName, amount]);

  const getReceiptImage = async (): Promise<void> => {
    if (fileName) {
      const downloadImg = await getPreSignedURL(fileName);
      setReceiptImage(downloadImg);
    }
  };

  useEffect(() => {
    getReceiptImage();
  }, [fileName !== undefined]);

  // 更新ボタンの押下の際に実行する関数
  const upddateExpenses: () => void = () => {
    try {
      updateSelectedExpense(
        selectedItem.expenseId,
        expenseDate,
        storeName,
        amount,
        categoryId
      );
    } catch (error) {
      // TODO: エラーの対応を考える
      console.log(error);
    }

    // データを再取得し、rowsをセットする
    getExpensesAndSetRows(userId, firstDay, lastDay);

    handleClose();
  };

  // 削除ボタンの押下の際に実行する
  const deleteExpenses: () => void = () => {
    try {
      deleteSelectedExpense(selectedItem.expenseId);
    } catch (error) {
      // TODO: エラーの対応を考える
      console.log(error);
    }

    // データを再取得し、rowsをセットする
    getExpensesAndSetRows(userId, firstDay, lastDay);

    handleClose();
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
          <ShowReceipt receiptImage={receiptImage} fileName={fileName} />
          <Box
            display="flex"
            flexDirection="column"
            component="form"
            sx={{ "& .MuiTextField-root": { mb: 1, ml: 1 } }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="日付"
                  value={dayjs(expenseDate)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setExpenseDate(newValue.toDate());
                    }
                  }}
                  slotProps={{
                    calendarHeader: {
                      format: "YYYY年MM月", // カレンダーの年月の部分
                    },
                    textField: {
                      variant: "filled",
                    },
                  }}
                  format="YYYY年MM月DD" // 入力欄
                />
              </DemoContainer>
            </LocalizationProvider>
            <TextField
              id="store-name"
              label="店名"
              variant="filled"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              error={storeNameError} // エラー表示
              helperText={storeNameError ? "必須項目です。" : ""}
            />
            <FormControl sx={{ minWidth: 120, mb: 1, ml: 1 }} variant="filled">
              <InputLabel
                id="amount"
                sx={{
                  color: amountError ? error_red : "inherit",
                }}
              >
                金額
              </InputLabel>
              <FilledInput
                startAdornment={
                  <InputAdornment position="start">¥</InputAdornment>
                }
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                error={amountError}
              />
              {amountError && (
                <span
                  style={{
                    color: error_red, // エラーカラー
                    fontSize: "0.75rem", // TextFieldのhelperTextと同じフォントサイズ
                    marginLeft: "14px", // TextFieldのhelperTextと同じ左余白
                    marginTop: "3px", // エラーメッセージの上に少し余白
                  }}
                >
                  必須項目です。
                </span>
              )}
            </FormControl>
            <FormControl sx={{ minWidth: 120, mb: 1, ml: 1 }}>
              <InputLabel variant="filled">カテゴリー</InputLabel>
              <Select
                native
                variant="filled"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
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
          disabled={isuUpdateDisabled}
        >
          更新
        </Button>
      </DialogActions>
    </Dialog>
  );
};
