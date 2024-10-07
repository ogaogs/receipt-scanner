import { Box } from "@mui/material";
import { getMonthBudgetsWithCategory } from "@/lib/db/budget";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";

export default async function Page() {
  // NOTE: 今後propsもしくは、contextで取得するようにする。
  const userId = "8f412478-c428-4399-b934-9f0d0cf0a6c5";
  const targetDate = new Date(2024, 9, 4); // NOTE: 今後変化する指定された日付
  // 月の初日と最終日を取得する
  const { firstDay, lastDay } = getStartAndEndOfMonth(targetDate);
  const monthBudgetsWithCategory = await getMonthBudgetsWithCategory(
    userId,
    firstDay,
    lastDay
  );
  console.log(monthBudgetsWithCategory);

  return <Box>予算一覧ページ</Box>;
}
