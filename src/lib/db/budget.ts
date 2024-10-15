"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";
import { Budget, MonthBudgetsWithCategory } from "@/types";

// 指定した月の予算を取得する
export const getMonthBudgets = cache(
  async (userId: string, firstDay: Date, lastDay: Date): Promise<Budget[]> => {
    return await prisma.budget.findMany({
      where: {
        year_month: {
          gte: firstDay,
          lt: lastDay,
        },
        userId: userId,
      },
    });
  }
);

// 指定した月の予算と付随するカテゴリーを取得する
export const getMonthBudgetsWithCategory = cache(
  async (
    userId: string,
    firstDay: Date,
    lastDay: Date
  ): Promise<MonthBudgetsWithCategory[]> => {
    return await prisma.budget.findMany({
      where: {
        year_month: {
          gte: firstDay,
          lt: lastDay,
        },
        userId: userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        categoryId: "asc",
      },
    });
  }
);

// 予算の作成
export const createBudget = async (
  userId: string,
  amount: number,
  year_month: Date,
  categoryId: number
): Promise<void> => {
  await prisma.budget.create({
    data: {
      userId: userId,
      amount: amount,
      year_month: year_month,
      categoryId: categoryId,
    },
  });
};

// 予算の更新
export const updateBudget = async (
  budgetId: string,
  amount: number
): Promise<void> => {
  await prisma.budget.update({
    where: {
      id: budgetId,
    },
    data: {
      amount: amount,
    },
  });
};
