"use client";

import { FC, useEffect, useState } from "react";
import {
  getAndFormatCategoryBudgets,
  updateCategoryBudgets,
} from "@/_components/features/budgets/BudgetsSever";
import { CategoryBudgets } from "@/_components/features/budgets/type";
import { Box, Typography, Paper, Input, Button } from "@mui/material";
import { formatCurrency } from "@/utils/financial";
import { Category } from "@/types";

type BudgetsProps = {
  userId: string;
  firstDay: Date;
  lastDay: Date;
  isThisMonth: boolean;
  targetYear: number;
  targetMonth: number;
  categories: Category[];
};

export const BudgetsTable: FC<BudgetsProps> = ({
  userId,
  firstDay,
  lastDay,
  isThisMonth,
  targetYear,
  targetMonth,
  categories,
}) => {
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudgets[]>([]);
  const [totalBudgtesAmount, setTotalBudgtesAmount] = useState<number>(0);
  const getAndSetCategoryBudgets: (
    userId: string,
    firstDay: Date,
    lastDay: Date
  ) => Promise<void> = async () => {
    const { formattedCategoryBudgets, totalAmount } =
      await getAndFormatCategoryBudgets(userId, firstDay, lastDay, categories);
    setCategoryBudgets(formattedCategoryBudgets);
    setTotalBudgtesAmount(totalAmount);
  };

  useEffect(() => {
    getAndSetCategoryBudgets(userId, firstDay, lastDay);
  }, [userId, firstDay, lastDay]);

  const updateBudgets = () => {
    updateCategoryBudgets(userId, categoryBudgets, targetYear, targetMonth);

    getAndSetCategoryBudgets(userId, firstDay, lastDay);
  };

  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          padding: "8px",
          display: "grid",
          marginBottom: 1,
          textAlign: "center",
          height: 48,
          gridAutoFlow: "row",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        <Typography sx={{ gridColumn: "1", fontSize: 24 }}>合計</Typography>
        <Typography sx={{ gridColumn: "2", fontSize: 24, textAlign: "end" }}>
          ¥
        </Typography>
        <Typography sx={{ gridColumn: "3", fontSize: 24, textAlign: "start" }}>
          {formatCurrency(totalBudgtesAmount, false)}
        </Typography>
      </Paper>
      <Typography
        borderBottom={"solid black"}
        textAlign={"center"}
        marginTop={4}
        marginBottom={2}
        fontSize={24}
      >
        {isThisMonth ? "カテゴリー毎 (編集可)" : "カテゴリー毎"}
      </Typography>
      {categoryBudgets.map((category, index) => (
        <Paper
          elevation={1}
          key={index}
          sx={{
            padding: "8px",
            display: "grid",
            marginBottom: 1,
            textAlign: "center",
            height: 48,
            gridAutoFlow: "row",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          <Typography sx={{ gridColumn: "1", fontSize: 24 }}>
            {category.category}
          </Typography>
          <Typography sx={{ gridColumn: "2", fontSize: 24, textAlign: "end" }}>
            ¥
          </Typography>
          {isThisMonth ? (
            <Input
              type="number"
              value={category.amount}
              disableUnderline
              onChange={(e) => {
                // ユーザーの入力に基づいて値を更新する処理
                const newAmount = e.target.value;
                setCategoryBudgets((prevBudgets) =>
                  prevBudgets.map((budget, i) =>
                    i === index
                      ? { ...budget, amount: Number(newAmount) }
                      : budget
                  )
                );
              }}
              sx={{
                gridColumn: "3",
                fontSize: 24,
                textAlign: "start",
                height: "100%",
                padding: 0,
                maxHeight: 36,
              }}
            />
          ) : (
            <Typography
              sx={{ gridColumn: "3", fontSize: 24, textAlign: "start" }}
            >
              {formatCurrency(category.amount, false)}
            </Typography>
          )}
        </Paper>
      ))}
      <Button
        variant="contained"
        sx={{
          fontWeight: "bold",
          display: "block",
          marginLeft: "auto",
          marginTop: 2,
        }}
        onClick={updateBudgets}
      >
        更新
      </Button>
    </Box>
  );
};
