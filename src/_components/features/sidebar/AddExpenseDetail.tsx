import React, { FC, useEffect, useState } from "react";
import {
  TextField,
  Box,
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
import { Category } from "@/types";
import { ExpenseDetail } from "@/_components/features/sidebar/type";
import { error_red } from "@/_components/common/Style/style";

type AddExpenseDetailProps = {
  expenseDetailUseState: ExpenseDetail;
  categories: Category[];
  setIsCreateDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AddExpenseDetail: FC<AddExpenseDetailProps> = ({
  expenseDetailUseState,
  categories,
  setIsCreateDisabled,
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
  } = expenseDetailUseState;

  // エラー状態の管理
  const [storeNameError, setStoreNameError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  // バリデーションチェック関数
  const validateFields = () => {
    const isStoreNameValid = storeName.trim() !== "";
    const isAmountValid = amount > 0;

    setStoreNameError(!isStoreNameValid);
    setAmountError(!isAmountValid);

    // 作成ボタンの有効/無効を親コンポーネントに伝える
    setIsCreateDisabled(!(isStoreNameValid && isAmountValid));
  };

  // 入力が変更されるたびにバリデーションを実行
  useEffect(() => {
    validateFields();
  }, [storeName, amount]);

  return (
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
              newValue ? setExpenseDate(newValue.toDate()) : null;
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
          startAdornment={<InputAdornment position="start">¥</InputAdornment>}
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
  );
};
