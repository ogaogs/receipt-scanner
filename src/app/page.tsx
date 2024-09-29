import { UpperDashbord, LowerDashbord } from "@/_components/features/dashbord";
import { getMonthExpenses, getMonthBudgets } from "@/lib/db";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";
import { calculateTotalAmount, categoryTotals } from "@/utils/financial";

export default async function Page() {
  const userId = "30d06a0b-dcb9-4060-911e-d15b50e2b7e0";
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

  const date = {
    today: today,
    targetDate: targetDate,
    lastDay: lastDay,
  };

  const dataset = [
    {
      budget: 50000,
      expense: 30000,
      categoryName: "住宅",
    },
    {
      budget: 10000,
      expense: 40000,
      categoryName: "光熱費",
    },
    {
      budget: 40000,
      expense: 30000,
      categoryName: "日用品",
    },
  ];
  return (
    <>
      <UpperDashbord
        date={date}
        totalBudgetsAmount={totalBudgetsAmount}
        totalExpensesAmount={totalExpensesAmount}
      />
      <LowerDashbord dataset={dataset} />
    </>
  );
}
