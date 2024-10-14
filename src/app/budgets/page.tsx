import { Box } from "@mui/material";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";
import { Budgets } from "@/_components/features/budgets/budgets";
import React from "react";

export default async function Page() {
  // NOTE: 今後propsもしくは、contextで取得するようにする。
  const userId = "8f412478-c428-4399-b934-9f0d0cf0a6c5";
  const targetDate = new Date(2024, 9, 4); // NOTE: 今後変化する指定された日付
  // 月の初日と最終日を取得する
  const { firstDay, lastDay } = getStartAndEndOfMonth(targetDate);

  return (
    <Box>
      <Budgets userId={userId} firstDay={firstDay} lastDay={lastDay} />
    </Box>
  );
}
