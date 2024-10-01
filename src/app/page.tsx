import { UpperDashboard, LowerDashboard } from "@/_components/features/dashboard";
import { getMonthExpenses, getMonthBudgets, getCategories } from "@/lib/db";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";
import { calculateTotalAmount, categoryTotals } from "@/utils/financial";
import { BarsDatasetType } from "@/_components/features/dashboard/type";
import { Box } from "@mui/material";

export default async function Page() {
  const userId = "8f412478-c428-4399-b934-9f0d0cf0a6c5";
  const today = getToday(); // 本日の時間を取得 UTC時間
  const targetDate = today; // NOTE: 今後変化する指定された日付

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

  return (
    <Box>
      <UpperDashboard
        date={date}
        totalBudgetsAmount={totalBudgetsAmount}
        totalExpensesAmount={totalExpensesAmount}
      />
      {/* NOTE: Lowerのサイズを動的にしたい */}
      <LowerDashboard dataset={dataset} />
    </Box>
  );
}
