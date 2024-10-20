import { getCategories } from "@/lib/db";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";
import {
  getDatesInRange,
  makeDateElements,
} from "@/_components/features/sidebar/SidebarServer";
import { Box } from "@mui/material";
import { ExpensesTable } from "@/_components/features/expenses";
import { Sidebar } from "@/_components/features/sidebar/Sidebar";
import { getFirstExpenseDate } from "@/lib/db/index";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // NOTE: 今後propsもしくは、contextで取得するようにする。
  const userId = "1672b84c-43ec-4e96-aad2-125410361991";
  const today = getToday();

  // クエリからdateを取得
  const paramDate =
    searchParams["date"] ??
    `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

  const pramUpdateState = searchParams["update"] == "true";

  // 年と月を取得
  const [targetYear, targetMonth] = paramDate.split("-").map(Number);

  const targetDate = new Date(targetYear, targetMonth - 1);

  // 月の初日と最終日を取得する
  const { firstDay, lastDay } = getStartAndEndOfMonth(targetDate);

  const categories = await getCategories();

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
        <ExpensesTable
          userId={userId}
          firstDay={firstDay}
          lastDay={lastDay}
          categories={categories}
        />
      </Box>
      <Sidebar
        userId={userId}
        paramDate={paramDate}
        dateDropdownElements={dateDropdown}
        categories={categories}
        pramUpdateState={pramUpdateState}
      />
    </Box>
  );
}
