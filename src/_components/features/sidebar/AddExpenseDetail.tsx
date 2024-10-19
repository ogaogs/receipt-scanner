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
import { ReceiptUpload } from "@/_components/features/sidebar/ReciptUpload";

type AddExpenseDetailProps = {
  dateRef: React.RefObject<HTMLInputElement>;
  storeNameRef: React.RefObject<HTMLInputElement>;
  amountRef: React.RefObject<HTMLInputElement>;
  categoryRef: React.RefObject<HTMLInputElement>;
  categories: Category[];
};

export const AddExpenseDetail: FC<AddExpenseDetailProps> = ({
  dateRef,
  storeNameRef,
  amountRef,
  categoryRef,
  categories,
}) => {
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
        variant="filled"
        inputRef={storeNameRef}
      />
      <FormControl sx={{ minWidth: 120, mb: 1, ml: 1 }} variant="filled">
        <InputLabel id="amount">金額</InputLabel>
        <FilledInput
          startAdornment={<InputAdornment position="start">¥</InputAdornment>}
          type="number"
          inputRef={amountRef}
        />
      </FormControl>
      <FormControl sx={{ minWidth: 120, mb: 1, ml: 1 }}>
        <InputLabel variant="filled">カテゴリー</InputLabel>
        <Select native variant="filled" inputRef={categoryRef}>
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
