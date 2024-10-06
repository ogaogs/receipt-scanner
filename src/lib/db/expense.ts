"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";
import { Expense, FirstExpenseDate, MonthExpensesWithCategory } from "@/types";

// 指定した月の出費を取得する
export const getMonthExpenses = cache(
  async (userId: string, firstDay: Date, lastDay: Date): Promise<Expense[]> => {
    return await prisma.expense.findMany({
      where: {
        date: {
          gte: firstDay,
          lt: lastDay,
        },
        userId: userId,
      },
    });
  }
);

// 出費の最初のデータを取得する
export const getFirstExpenseDate = cache(
  async (userId: string): Promise<FirstExpenseDate> => {
    return await prisma.expense.aggregate({
      where: {
        userId: userId,
      },
      _min: {
        date: true,
      },
    });
  }
);

// 指定した月の出費をカテゴリーと共に取得する。
export const getMonthExpensesWithCategory = cache(
  async (
    userId: string,
    firstDay: Date,
    lastDay: Date
  ): Promise<MonthExpensesWithCategory[]> => {
    return await prisma.expense.findMany({
      where: {
        date: {
          gte: firstDay,
          lt: lastDay,
        },
        userId: userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  }
);

// 特定の出費を更新する
export const updateExpense = async (
  expenseId: string,
  amount: number,
  storeName: string,
  date: Date,
  categoryId: number
): Promise<void> => {
  await prisma.expense.update({
    where: {
      id: expenseId,
    },
    data: {
      amount: amount,
      storeName: storeName,
      date: date,
      categoryId: categoryId,
    },
  });
};

// 特定の出費を削除する
export const deleteExpense = async (expenseId: string): Promise<void> => {
  await prisma.expense.delete({
    where: {
      id: expenseId,
    },
  });
};
