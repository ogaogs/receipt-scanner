"use client";

import React, { useState, FC, useEffect } from "react";
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
import { getAndFormatExpenses } from "@/_components/features/expenses/ExpensesServer";

type ExpensesTableProps = {
  userId: string;
  firstDay: Date;
  lastDay: Date;
  categories: Category[];
};

export const ExpensesTable: FC<ExpensesTableProps> = ({
  userId,
  firstDay,
  lastDay,
  categories,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RowType | null>(null);
  const [rows, setRows] = useState<RowType[]>([]);

  const getExpensesAndSetRows: (
    userId: string,
    firstDay: Date,
    lastDay: Date
  ) => Promise<void> = async () => {
    const formattedExpenses = await getAndFormatExpenses(
      userId,
      firstDay,
      lastDay
    );
    setRows(formattedExpenses);
  };

  useEffect(() => {
    getExpensesAndSetRows(userId, firstDay, lastDay);
  }, [userId, firstDay, lastDay]);

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

  const headers = ["日付", "店名", "金額", "カテゴリー"];
  const tableCellStyle = { borderBottom: "solid black" };

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
              {headers.map((header) => (
                <TableCell key={header} sx={tableCellStyle}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.expenseId}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(row)}
              >
                <TableCell>
                  {formatDate(row.date, { month: "long", day: true })}
                </TableCell>
                <TableCell>{row.storeName}</TableCell>
                <TableCell>{formatCurrency(row.amount, true)}</TableCell>
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
        userId={userId}
        firstDay={firstDay}
        lastDay={lastDay}
        getExpensesAndSetRows={getExpensesAndSetRows}
      />
    </Box>
  );
};
