import { getCategories } from "@/lib/db";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";
import React from "react";
import { Box } from "@mui/material";
import { ExpensesTable } from "@/_components/features/expenses";
import { Sidebar } from "@/_components/features/sidebar/Sidebar";

export default async function Page() {
  // NOTE: 今後propsもしくは、contextで取得するようにする。
  const userId = "8f412478-c428-4399-b934-9f0d0cf0a6c5";
  const targetDate = new Date(2024, 9, 4); // NOTE: 今後変化する指定された日付

  // 月の初日と最終日を取得する
  const { firstDay, lastDay } = getStartAndEndOfMonth(targetDate);

  const categories = await getCategories();

  return (
    <Box display="flex" flexDirection="row" height="100%">
      <Box
        height="100%"
        flexGrow={1}
        sx={{
          paddingX: 8,
          paddingY: 2,
        }}
      >
        <ExpensesTable
          userId={userId}
          firstDay={firstDay}
          lastDay={lastDay}
          categories={categories}
        />
      </Box>
      <Sidebar />
    </Box>
  );
}
