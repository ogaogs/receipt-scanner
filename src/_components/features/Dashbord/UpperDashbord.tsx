import { Box } from "@mui/material";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";
import {
  formatCurrency,
  calculateTotalAmount,
  categoryTotals,
} from "@/utils/financial";
import { getMonthExpenses, getMonthBudgets } from "@/lib/db";
import { ChartWithLetter } from "@/_components/features/Dashbord/ChartWithLetter";
import { PieChartData } from "@/_components/features/Dashbord/type";

export const UperDashbord = async () => {
  const userId = "30d06a0b-dcb9-4060-911e-d15b50e2b7e0";
  const today = getToday(); // 本日の時間を取得 UTC時間
  const date = today; // NOTE: 今後変化する指定された日付

  // 月の初日と最終日を取得する
  const { firstDay, lastDay } = getStartAndEndOfMonth(date);

  // 月の出費・予算を全て取得する
  const monthExpenses = await getMonthExpenses(userId, firstDay, lastDay);
  const monthBudgets = await getMonthBudgets(userId, firstDay, lastDay);

  //  出費・予算の合計
  const totalExpensesAmount = calculateTotalAmount(monthExpenses);
  const totalBudgetsAmount = calculateTotalAmount(monthBudgets);

  // 出費・予算のカテゴリー毎の合計 NOTE: カテゴリー毎の予算も出費と同じ型にするために変換
  const expenseCategoryTotals = categoryTotals(monthExpenses);
  const budgetCategoryTotals = categoryTotals(monthBudgets);

  const data: PieChartData[] = [
    { id: 0, value: 10, label: "series A" },
    { id: 1, value: 15, label: "series B" },
    { id: 2, value: 20, label: "series C" },
  ];

  // 日本円の表記にフォーマット
  const formattedTotalExpensesAmount = formatCurrency(totalExpensesAmount);
  const formattedTotalBudgetsAmount = formatCurrency(totalBudgetsAmount);

  const daysLeft = "後 5日";

  // formattedDateは関数化してutilsにおいてもいいかも　"ja-JP"で日本時間に変換
  const formattedDate = date.toLocaleDateString("ja-JP", {
    month: "long",
  });

  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{
        textAlign: "center",
        backgroundColor: "white",
        marginTop: 4,
        marginBottom: 8,
      }}
    >
      <Box sx={{ width: 100, flexBasis: "20%" }}>
        <Box
          height={48}
          width={80}
          sx={{
            backgroundColor: "#2196f3",
            fontSize: "32px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          {formattedDate}
        </Box>
        <Box sx={{ fontSize: "32px", fontWeight: "bold", marginTop: 4 }}>
          <div>予算</div>
          <div>{formattedTotalBudgetsAmount}</div>
        </Box>
      </Box>
      <ChartWithLetter letter={formattedTotalExpensesAmount} data={data} />
      <ChartWithLetter letter={daysLeft} data={data} />
    </Box>
  );
};
