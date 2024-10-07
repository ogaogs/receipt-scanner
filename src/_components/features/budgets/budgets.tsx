"use client";

import { FC, useEffect, useState } from "react";
import { getAndFormatCategoryBudgets } from "@/_components/features/budgets/budgetsSever";
import { CategoryBudgets } from "@/_components/features/budgets/type";
import { Box, Typography, Paper } from "@mui/material";

type BudgetsProps = {
  userId: string;
  firstDay: Date;
  lastDay: Date;
};

export const Budgets: FC<BudgetsProps> = ({ userId, firstDay, lastDay }) => {
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudgets[]>([]);
  const [totalBudgtesAmount, setTotalBudgtesAmount] = useState<number | null>(
    null
  );
  const getAndSetCategoryBudgets: (
    userId: string,
    firstDay: Date,
    lastDay: Date
  ) => Promise<void> = async () => {
    const { formattedCategoryBudgets, totalAmount } =
      await getAndFormatCategoryBudgets(userId, firstDay, lastDay);
    setCategoryBudgets(formattedCategoryBudgets);
    setTotalBudgtesAmount(totalAmount);
  };

  useEffect(() => {
    getAndSetCategoryBudgets(userId, firstDay, lastDay);
  }, [userId, firstDay, lastDay]);

  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 1,
          height: 48,
        }}
      >
        <Typography>合計</Typography>
        <Typography>{totalBudgtesAmount}</Typography>
      </Paper>
      <Typography borderBottom={"solid black"} textAlign={"center"} marginY={2}>カテゴリー毎</Typography>
      {categoryBudgets.map((category, index) => (
        <Paper
          key={index}
          elevation={1}
          sx={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 1,
            height: 48,
          }}
        >
          <Typography>{category.category}</Typography>
          {/* FilledInputを使用して、編集可能 or 不可能を制御できるようにする */}
          <Typography>{category.amount}</Typography>
        </Paper>
      ))}
    </Box>
  );
};
