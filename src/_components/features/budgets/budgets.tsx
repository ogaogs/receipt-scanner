"use client";

import { FC, useEffect, useState } from "react";
import { getAndFormatCategoryBudgets } from "@/_components/features/budgets/budgetsSever";
import { CategoryBudgets } from "@/_components/features/budgets/type";

type BudgetsProps = {
  userId: string;
  firstDay: Date;
  lastDay: Date;
};

export const Budgets: FC<BudgetsProps> = ({ userId, firstDay, lastDay }) => {
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudgets[]>([]);
  const getAndSetCategoryBudgets: (
    userId: string,
    firstDay: Date,
    lastDay: Date
  ) => Promise<void> = async () => {
    const formattedCategoryBudgets = await getAndFormatCategoryBudgets(
      userId,
      firstDay,
      lastDay
    );
    setCategoryBudgets(formattedCategoryBudgets);
  };

  useEffect(() => {
    getAndSetCategoryBudgets(userId, firstDay, lastDay);
  }, [userId, firstDay, lastDay]);
  console.log(categoryBudgets);

  return <></>;
};
