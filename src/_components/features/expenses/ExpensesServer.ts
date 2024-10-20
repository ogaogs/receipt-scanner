"use server";

import {
  getMonthExpensesWithCategory,
  updateExpense,
  deleteExpense,
} from "@/lib/db";
import { RowType } from "@/_components/features/expenses/type";
import { generatePreSignedURL } from "@/lib/s3";

export const getAndFormatExpenses = async (
  userId: string,
  firstDay: Date,
  lastDay: Date
): Promise<RowType[]> => {
  const monthExpensesWithCateReceipt = await getMonthExpensesWithCategory(
    userId,
    firstDay,
    lastDay
  );

  // 出費を特定のフォーマットにする
  const rows = monthExpensesWithCateReceipt.map((expense) => ({
    expenseId: expense.id,
    date: expense.date,
    storeName: expense.storeName,
    amount: expense.amount,
    categoryId: expense.categoryId,
    category: expense.category.name,
    fileName: expense.receipt?.fileName,
  }));
  return rows;
};

// 特定の出費を更新する
export const updateSelectedExpense = async (
  expenseId: string,
  date: Date,
  storeName: string,
  amount: number,
  categoryId: number
) => {
  try {
    await updateExpense(expenseId, amount, storeName, date, categoryId);
  } catch (error) {
    throw error;
  }
};

// 特定の出費を削除する
export const deleteSelectedExpense = async (expenseId: string) => {
  try {
    await deleteExpense(expenseId);
  } catch (error) {
    throw error;
  }
};

export const getPreSignedURL = async (fileName: string) => {
  const preSignedURL = await generatePreSignedURL(fileName, "get");
  return preSignedURL;
};
