"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";
import { Expense, FirstAndLastExpenseDate } from "@/types";

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

// 出費の最初のデータと最後のデータを取得する
export const getFirstAndLastExpenseDate = cache(
  async (userId: string): Promise<FirstAndLastExpenseDate> => {
    return await prisma.expense.aggregate({
      where: {
        userId: userId,
      },
      _min: {
        date: true,
      },
      _max: {
        date: true,
      },
    });
  }
);
