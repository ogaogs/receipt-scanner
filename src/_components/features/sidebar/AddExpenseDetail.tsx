import React, { FC, useRef, useState } from "react";
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

type AddExpenseDetailProps = {
  expenseDetailUseState: ExpenseDetail;
  categories: Category[];
};

export const AddExpenseDetail: FC<AddExpenseDetailProps> = ({
  expenseDetailUseState,
  categories,
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
  return (
    <Box
      display="flex"
      flexDirection="column"
      component="form"
      sx={{ "& .MuiTextField-root": { mb: 1, ml: 1 } }}
    >
      {/* TODO: 全ての要素がrequiredでなければならない */}
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
      />
      <FormControl sx={{ minWidth: 120, mb: 1, ml: 1 }} variant="filled">
        <InputLabel id="amount">金額</InputLabel>
        <FilledInput
          startAdornment={<InputAdornment position="start">¥</InputAdornment>}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
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
