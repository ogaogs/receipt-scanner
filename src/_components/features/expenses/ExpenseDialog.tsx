"use client";

import React, { FC } from "react";
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
  useMediaQuery,
} from "@mui/material";
import { formatDate } from "@/utils/time";
import { RowType } from "@/_components/features/expenses/type";
import { Category } from "@/types";

type ExpensesDialogProps = {
  handleClose: () => void;
  open: boolean;
  selectedItem: RowType | null;
  categories: Category[];
};

export const ExpensesDialog: FC<ExpensesDialogProps> = ({
  handleClose,
  open,
  selectedItem,
  categories,
}) => {
  const [category, setCategory] = React.useState<number | undefined>(
    selectedItem?.category_id
  );
  const handleChange = (event: SelectChangeEvent<typeof category>) => {
    setCategory(Number(event.target.value));
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
                <TextField
                  id="date"
                  label="日付"
                  defaultValue={formatDate(selectedItem.date, {
                    month: true,
                    day: true,
                  })}
                  variant="filled"
                />
                <TextField
                  id="store-name"
                  label="店名"
                  defaultValue={selectedItem.storeName}
                  variant="filled"
                />
                <TextField
                  id="amount"
                  label="金額"
                  defaultValue={selectedItem.amount}
                  variant="filled"
                />
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel variant="filled">カテゴリー</InputLabel>
                  <Select
                    native
                    onChange={handleChange}
                    variant="filled"
                    defaultValue={selectedItem.category_id}
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
              onClick={handleClose}
            >
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
