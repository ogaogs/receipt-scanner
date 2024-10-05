"use client";

import React, { useState, FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { formatDate } from "@/utils/time";
import { formatCurrency } from "@/utils/financial";
import { ExpensesDialog } from "@/_components/features/expenses";
import { RowType } from "@/_components/features/expenses/type";
import { Category } from "@/types";

type ExpensesTableProps = {
  rows: RowType[];
  categories: Category[];
};

export const ExpensesTable: FC<ExpensesTableProps> = ({ rows, categories }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RowType | null>(null);

  // 列がクリックされたときに詳細を表示する関数
  const handleClick = (item: RowType) => {
    setSelectedItem(item);
    setOpen(true);
  };

  // ダイアログを閉じる関数
  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  return (
    <Box>
      <TableContainer component={Paper} style={{ maxHeight: 640 }}>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            "& .MuiTableCell-root": { width: "80ch", textAlign: "center" },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>日付</TableCell>
              <TableCell>店名</TableCell>
              <TableCell>金額</TableCell>
              <TableCell>カテゴリー</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.expense_id}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(row)}
              >
                <TableCell>
                  {formatDate(row.date, { month: true, day: true })}
                </TableCell>
                <TableCell>{row.storeName}</TableCell>
                <TableCell>{formatCurrency(row.amount)}</TableCell>
                <TableCell>{row.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ExpensesDialog
        handleClose={handleClose}
        open={open}
        selectedItem={selectedItem}
        categories={categories}
      />
    </Box>
  );
};
