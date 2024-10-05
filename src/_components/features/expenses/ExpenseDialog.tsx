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
} from "@mui/material";
import { formatDate } from "@/utils/time";
import { RowType } from "@/_components/features/expenses/type";

type ExpensesDialogProps = {
  handleClose: () => void;
  open: boolean;
  selectedItem: RowType | null;
};

export const ExpensesDialog: FC<ExpensesDialogProps> = ({
  handleClose,
  open,
  selectedItem,
}) => {
  const [category, setCategory] = React.useState<number | undefined>(
    selectedItem?.category_id
  );
  const handleChange = (event: SelectChangeEvent<typeof category>) => {
    setCategory(Number(event.target.value));
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          {selectedItem && (
            <Box
              display="flex"
              flexDirection="column"
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
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
                <Select
                  native
                  value={category}
                  onChange={handleChange}
                  variant="filled"
                  defaultValue={selectedItem.category_id}
                >
                  {/* TODO: ここをカテゴリーの実際のデータを使って、mapするようにする。 */}
                  <option aria-label="None" value="" />
                  <option value={1}>Ten</option>
                  <option value={2}>Twenty</option>
                  <option value={3}>Thirty</option>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>レシートを表示</Button>
          <Button onClick={handleClose}>削除</Button>
          <Button onClick={handleClose}>保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
