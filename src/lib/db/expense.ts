"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";
import {
  Expense,
  FirstExpenseDate,
  MonthExpensesWithCategoryReceipt,
} from "@/types";
import { da } from "@faker-js/faker";

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
  ): Promise<MonthExpensesWithCategoryReceipt[]> => {
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
        receipt: true,
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

export const createExpense = async (
  userId: string,
  amount: number,
  storeName: string,
  date: Date,
  categoryId: number,
  fileName: string | null
): Promise<void> => {
  await prisma.expense.create({
    data: {
      userId: userId,
      storeName: storeName,
      amount: amount,
      date: date,
      categoryId: categoryId,
      receipt: fileName
        ? {
            create: {
              fileName: fileName,
            },
          }
        : undefined,
    },
  });
};
