"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";
import { Budget } from "@/types";

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
