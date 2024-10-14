"use client";

import { FC, useEffect, useState } from "react";
import { getAndFormatCategoryBudgets } from "@/_components/features/budgets/budgetsSever";
import { CategoryBudgets } from "@/_components/features/budgets/type";
import { Box, Typography, Paper } from "@mui/material";
import { formatCurrency } from "@/utils/financial";

type BudgetsProps = {
  userId: string;
  firstDay: Date;
  lastDay: Date;
};

export const BudgetsTable: FC<BudgetsProps> = ({
  userId,
  firstDay,
  lastDay,
}) => {
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudgets[]>([]);
  const [totalBudgtesAmount, setTotalBudgtesAmount] = useState<number>(0);
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
          padding: "8px",
          display: "grid",
          marginBottom: 1,
          textAlign: "center",
          height: 48,
          gridAutoFlow: "row",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        <Typography sx={{ gridColumn: "1", fontSize: 24 }}>合計</Typography>
        <Typography sx={{ gridColumn: "2 / 4", fontSize: 24 }}>
          {formatCurrency(totalBudgtesAmount, true)}
        </Typography>
      </Paper>
      <Typography
        borderBottom={"solid black"}
        textAlign={"center"}
        marginTop={4}
        marginBottom={2}
        fontSize={24}
      >
        カテゴリー毎
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
            gridTemplateColumns: "1fr 1fr 1fr",
          }}
        >
          <Typography sx={{ gridColumn: "1", fontSize: 24 }}>
            {category.category}
          </Typography>
          <Typography sx={{ gridColumn: "2 / 4", fontSize: 24 }}>
            {formatCurrency(category.amount, true)}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};
