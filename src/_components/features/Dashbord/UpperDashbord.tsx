import { Box } from "@mui/material";
import { getToday, getStartAndEndOfMonth } from "@/utils/time";
import {
  formatCurrency,
  calculateTotalAmount,
  categoryTotals,
} from "@/utils/financial";
import { getMonthExpenses, getMonthBudgets } from "@/lib/db";
import { ChartWithLetter } from "@/_components/features/dashbord/ChartWithLetter";
import { PieChartData } from "@/_components/features/dashbord/type";

type remainDaysReturn = {
  text: string;
  data: PieChartData[];
};

export const UpperDashbord = async () => {
  const userId = "30d06a0b-dcb9-4060-911e-d15b50e2b7e0";
  const today = getToday(); // 本日の時間を取得 UTC時間
  const date = today; // NOTE: 今後変化する指定された日付

  // 色
  const lightgreen = "#b9f6ca"
  const green = "#00c853"
  const blue = "#2196f3"
  const red = "#d50000"

  function remainDaysStr(today: Date, lastDayOfMonth: Date): remainDaysReturn {
    // 年と月を比較
    const sameYear = today.getFullYear() === lastDayOfMonth.getFullYear();
    const sameMonth = today.getMonth() === lastDayOfMonth.getMonth();

    if (sameYear && sameMonth) {
      // 残り日数を計算
      const remainingDays = lastDayOfMonth.getDate() - today.getDate();
      const text = `後 ${remainingDays}日`;
      const data = [
        { id: 0, value: today.getDate(), label: "経過日数", color: green },
        { id: 1, value: remainingDays, label: "残日数", color: lightgreen },
      ];
      return { text: text, data: data };
    } else {
      const text = "過去の家計簿";
      const data = [
        { id: 0, value: 1, label: "過去の家計簿", color: red },
      ];
      return { text: text, data: data };
    }
  }

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

  // 予算と出費の割合を表すグラフのデータ
  const totalBudgetLeft = totalBudgetsAmount - totalExpensesAmount;
  const expenseColor = totalBudgetLeft < 0 ? red : green;
  const budgetExpenseData = [
    {
      id: 0,
      value: totalExpensesAmount,
      label: "今月の出費",
      color: expenseColor,
    },
    { id: 1, value: totalBudgetLeft, label: "残りの予算", color: lightgreen },
  ];

  // 日本円の表記にフォーマット
  const formattedTotalExpensesAmount = formatCurrency(totalExpensesAmount);
  const formattedTotalBudgetsAmount = formatCurrency(totalBudgetsAmount);

  const daysLeft = remainDaysStr(today, lastDay);

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
            backgroundColor: blue,
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
      <ChartWithLetter
        letter={formattedTotalExpensesAmount}
        data={budgetExpenseData}
      />
      <ChartWithLetter letter={daysLeft.text} data={daysLeft.data} />
    </Box>
  );
};
