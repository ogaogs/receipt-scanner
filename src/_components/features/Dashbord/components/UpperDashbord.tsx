import { Box } from "@mui/material";
import { getStartAndEndOfMonth } from "@/utils/time";
import { getMonthExpenses } from "@/lib/db/budget";

export const UperDashbord = async () => {
  const userId = "30d06a0b-dcb9-4060-911e-d15b50e2b7e0";
  const date = new Date(2024, 7, 10); // UTC時間
  const { firstDay, lastDay } = getStartAndEndOfMonth(date);
  const monthExpenses = await getMonthExpenses(userId, firstDay, lastDay);
  const totalAmount = monthExpenses.reduce(
    (sum, current) => sum + current.amount,
    0
  );

  // formattedDateは関数化してutilsにおいてもいいかも　"ja-JP"で日本時間に変換
  const formattedDate = date.toLocaleDateString("ja-JP", {
    month: "long",
  });
  return (
    <>
      <Box>{formattedDate}</Box>
      <Box>
        <div>予算</div>
        <div>{totalAmount}円</div>
      </Box>
      <Box></Box>
    </>
  );
};
