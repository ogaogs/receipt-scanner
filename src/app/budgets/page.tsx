import { Box } from "@mui/material";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";
import { BudgetsTable } from "@/_components/features/budgets/budgetsTable";
import { Sidebar } from "@/_components/features/sidebar/Sidebar";
import {
  getDatesInRange,
  makeDateElements,
} from "@/_components/features/sidebar/yearMonthElements";
import { getFirstExpenseDate } from "@/lib/db/index";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // NOTE: 今後propsもしくは、contextで取得するようにする。
  const userId = "8f412478-c428-4399-b934-9f0d0cf0a6c5";
  const today = getToday();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  // クエリからdateを取得
  const paramDate =
    searchParams["date"] ??
    `${todayYear}-${(todayMonth + 1).toString().padStart(2, "0")}`;

  // 年と月を取得
  const [targetYear, targetMonth] = paramDate.split("-").map(Number);

  const targetDate = new Date(targetYear, targetMonth - 1);

  const isThisMonth = (todayYear === targetYear) && (todayMonth + 1 === targetMonth)
  // 月の初日と最終日を取得する
  const { firstDay, lastDay } = getStartAndEndOfMonth(targetDate);

  // 初めての出費日を取得
  const firstExpense = await getFirstExpenseDate(userId);

  // 初めの出費日を定義
  const firstExpenseDate = firstExpense._min.date ?? today;

  // 初めての出費から今日までの月日をリストで取得し、サイドバーの月日ドロップダウンに渡す型に整形
  const datesInRange = getDatesInRange(firstExpenseDate, today);
  const dateDropdown = makeDateElements(datesInRange);

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
        <BudgetsTable userId={userId} firstDay={firstDay} lastDay={lastDay} isThisMonth={isThisMonth}/>
      </Box>
      <Sidebar paramDate={paramDate} dateDropdownElements={dateDropdown} />
    </Box>
  );
}
