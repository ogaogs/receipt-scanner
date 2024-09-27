import { Box } from "@mui/material";
import { getStartAndEndOfMonth } from "@/utils/time";
import { getMonthExpenses } from "@/lib/db/budget";

export const UperDashbord = async () => {
  const userId = "30d06a0b-dcb9-4060-911e-d15b50e2b7e0";
  const date = new Date(2024, 7, 10); // UTC時間

  // 指定された月の初日と最終日を取得し、その月の出費を全て取得する。
  const { firstDay, lastDay } = getStartAndEndOfMonth(date);
  const monthExpenses = await getMonthExpenses(userId, firstDay, lastDay);

  //  出費の合計を取得
  const totalAmount = monthExpenses.reduce(
    (sum, current) => sum + current.amount,
    0
  );

  // formattedDateは関数化してutilsにおいてもいいかも　"ja-JP"で日本時間に変換
  const formattedDate = date.toLocaleDateString("ja-JP", {
    month: "long",
  });
  
  return (
    <Box display="flex" flexDirection="row" sx={{ textAlign: "center" }}>
      <Box flexGrow={1} sx={{ width: 100 }}>
        <Box>{formattedDate}</Box>
        <Box>
          <div>予算</div>
          <div>{totalAmount}円</div>
        </Box>
      </Box>
      <Box flexGrow={2} sx={{ width: 200 }}>
        Graph1
      </Box>
      <Box flexGrow={2} sx={{ width: 200 }}>
        Graph2
      </Box>
    </Box>
  );
};
