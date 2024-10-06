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
  SelectChangeEvent,
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
import { formatAndUpdateExpense } from "@/_components/features/expenses/expensesServer";

type ExpensesDialogProps = {
  handleClose: () => void;
  open: boolean;
  selectedItem: RowType | null;
  categories: Category[];
  setRows: React.Dispatch<React.SetStateAction<RowType[]>>;
};

export const ExpensesDialog: FC<ExpensesDialogProps> = ({
  handleClose,
  open,
  selectedItem,
  categories,
  setRows,
}) => {
  const dateRef = useRef<HTMLInputElement>(null);
  const storeNameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);

  const upddateExpenses = () => {
    if (
      selectedItem?.expense_id &&
      dateRef.current?.value &&
      storeNameRef.current?.value &&
      amountRef.current?.value &&
      categoryRef.current?.value
    ) {
      try {
        formatAndUpdateExpense(
          selectedItem.expense_id,
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
      console.log("The selected values are invalid");
    }

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
                    defaultValue={selectedItem.category_id}
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
              onClick={handleClose}
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
