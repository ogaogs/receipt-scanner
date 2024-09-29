"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";
import { Expense } from "@/types";

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
