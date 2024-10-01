"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";
import { Expense, FirstExpenseDate } from "@/types";

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
