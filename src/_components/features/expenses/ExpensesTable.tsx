"use client";

import React, { FC } from "react";
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

type RowType = {
  expense_id: string;
  date: Date;
  storeName: string;
  amount: number;
  category: string;
};

type ExpensesTableProps = {
  rows: RowType[];
};

export const ExpensesTable: FC<ExpensesTableProps> = ({ rows }) => {
  return (
    <Box>
      <TableContainer component={Paper} style={{ maxHeight: 640 }}>
        <Table stickyHeader aria-label="sticky table">
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
              >
                <TableCell>
                  {formatDate(row.date, { month: true, day: true })}
                </TableCell>
                <TableCell>{row.storeName}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
