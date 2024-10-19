import {
  UpperDashboard,
  LowerDashboard,
} from "@/_components/features/dashboard";
import { getMonthExpenses, getMonthBudgets, getCategories } from "@/lib/db";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";
import { calculateTotalAmount, categoryTotals } from "@/utils/financial";
import { BarsDatasetType } from "@/_components/common/BarsDataset/BarsDataset";
import { Box } from "@mui/material";
import { Sidebar } from "@/_components/features/sidebar/Sidebar";
import {
  getDatesInRange,
  makeDateElements,
} from "@/_components/features/sidebar/SidebarServer";

import { getFirstExpenseDate } from "@/lib/db/index";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const userId = "8f412478-c428-4399-b934-9f0d0cf0a6c5";
  const today = getToday(); // 本日の時間を取得 UTC時間

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

  // 月の出費・予算を全て取得する
  const monthExpenses = await getMonthExpenses(userId, firstDay, lastDay);
  const monthBudgets = await getMonthBudgets(userId, firstDay, lastDay);

  //  出費・予算の合計
  const totalExpensesAmount = calculateTotalAmount(monthExpenses);
  const totalBudgetsAmount = calculateTotalAmount(monthBudgets);

  // 出費・予算のカテゴリー毎の合計 NOTE: カテゴリー毎の予算も出費と同じ型にするために変換
  const expenseCategoryTotals = categoryTotals(monthExpenses);
  const budgetCategoryTotals = categoryTotals(monthBudgets);

  // カテゴリーを取得
  const categories = await getCategories();
  const dataset: BarsDatasetType[] = categories.map((category) => ({
    budget: budgetCategoryTotals[category.id]
      ? budgetCategoryTotals[category.id]
      : 0,
    expense: expenseCategoryTotals[category.id]
      ? expenseCategoryTotals[category.id]
      : 0,
    categoryName: category.name,
  }));

  const date = {
    today: today,
    targetDate: targetDate,
    lastDay: lastDay,
  };

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
        <UpperDashboard
          date={date}
          totalBudgetsAmount={totalBudgetsAmount}
          totalExpensesAmount={totalExpensesAmount}
        />
        {/* NOTE: Lowerのサイズを動的にしたい */}
        <LowerDashboard dataset={dataset} />
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
