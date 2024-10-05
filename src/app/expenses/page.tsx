import { getMonthExpensesWithCategory } from "@/lib/db";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";
import React from "react";
import { Box } from "@mui/material";
import { ExpensesTable } from "@/_components/features/expenses";

export default async function Page() {
  // NOTE: 今後propsもしくは、contextで取得するようにする。
  const userId = "8f412478-c428-4399-b934-9f0d0cf0a6c5";
  const targetDate = getToday(); // NOTE: 今後変化する指定された日付

  // 月の初日と最終日を取得する
  const { firstDay, lastDay } = getStartAndEndOfMonth(targetDate);

  // 月の出費・予算を全て取得する
  const monthExpensesWithCate = await getMonthExpensesWithCategory(
    userId,
    firstDay,
    lastDay
  );

  // 出費を特定のフォーマットにする
  const rows = monthExpensesWithCate.map((expense) => ({
    expense_id: expense.id,
    date: expense.date,
    storeName: expense.storeName,
    amount: expense.amount,
    category_id: expense.categoryId,
    category: expense.category.name,
  }));
  return (
    <Box>
      <ExpensesTable rows={rows} />
    </Box>
  );
}
