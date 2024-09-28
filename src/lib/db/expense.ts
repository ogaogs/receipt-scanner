"use server";

import prisma from "@/lib/prisma";
import { Expense } from "@/types";

// 指定した月の出費を取得する
export const getMonthExpenses = async (
  userId: string,
  firstDay: Date,
  lastDay: Date
): Promise<Expense[]> => {
  return await prisma.expense.findMany({
    where: {
      date: {
        gte: firstDay,
        lt: lastDay,
      },
      userId: userId,
    },
  });
};
