import { Box } from "@mui/material";
import { getStartAndEndOfMonth } from "@/utils/time";
import { formatCurrency } from "@/utils/currency";
import { getMonthExpenses } from "@/lib/db/expense";
import { getMonthBudgets } from "@/lib/db/budget";
import { ChartWithLetter } from "@/_components/features/Dashbord/ChartWithLetter";

export const UperDashbord = async () => {
  const userId = "30d06a0b-dcb9-4060-911e-d15b50e2b7e0";
  const date = new Date(); // 本日の時間を取得 UTC時間

  // 月の初日と最終日を取得する
  const { firstDay, lastDay } = getStartAndEndOfMonth(date);

  // 月の出費を全て取得する
  const monthExpenses = await getMonthExpenses(userId, firstDay, lastDay);

  //  出費の合計
  const totalExpensesAmount = monthExpenses.reduce(
    (sum, current) => sum + current.amount,
    0
  );

  // 日本円の表記にフォーマット
  const formattedTotalExpensesAmount = formatCurrency(totalExpensesAmount);

  // 月の予算を取得する
  const monthBudgets = await getMonthBudgets(userId, firstDay, lastDay);

  // 予算の合計
  const totalBudgetsAmount = monthBudgets.reduce(
    (sum, current) => sum + current.amount,
    0
  );

  // 日本円の表記にフォーマット
  const formattedTotalBudgetsAmount = formatCurrency(totalBudgetsAmount);

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
      <ChartWithLetter />
      <ChartWithLetter />
    </Box>
  );
};
