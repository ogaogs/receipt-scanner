"use client";

import React, { FC, useRef } from "react";
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

type CreateDialogProps = {
  handleClose: () => void;
  open: boolean;
  categories: Category[];
  userId: string;
};

export const CreateDialog: FC<CreateDialogProps> = ({
  handleClose,
  open,
  categories,
  userId,
}) => {
  const dateRef = useRef<HTMLInputElement>(null);
  const storeNameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);

  // 更新ボタンの押下の際に実行する関数
  const handleCreateExpense: () => void = () => {
    console.log(userId);

    handleClose();
  };

  const handleAnalyze: () => void = () => {
    console.log("解析");
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
            <Box
              display="flex"
              flexDirection="column"
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1 } }}
            >
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
              <FormControl sx={{ m: 1, minWidth: 120 }} variant="filled">
                <InputLabel id="amount">金額</InputLabel>
                <FilledInput
                  startAdornment={
                    <InputAdornment position="start">¥</InputAdornment>
                  }
                  type="number"
                  inputRef={amountRef}
                />
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
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
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{ fontWeight: "bold" }}
              onClick={handleAnalyze}
            >
              レシート解析
            </Button>
            <Button
              variant="contained"
              sx={{ fontWeight: "bold" }}
              onClick={handleCreateExpense}
            >
              作成
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
