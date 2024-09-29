import { Box } from "@mui/material";
import { formatCurrency } from "@/utils/financial";
import { FC, Suspense } from "react";

import { ChartWithLetter } from "@/_components/features/dashbord/ChartWithLetter";
import { PieChartData } from "@/_components/features/dashbord/type";
import {
  lightgreen,
  green,
  blue,
  red,
} from "@/_components/features/dashbord/style";

type remainDaysReturn = {
  text: string;
  data: PieChartData[];
};

type UpperDashbordProps = {
  date: {
    today: Date;
    targetDate: Date;
    lastDay: Date;
  };
  totalBudgetsAmount: number;
  totalExpensesAmount: number;
};

export const UpperDashbord: FC<UpperDashbordProps> = async ({
  date,
  totalBudgetsAmount,
  totalExpensesAmount,
}) => {
  const remainDaysStr = (
    today: Date,
    lastDayOfMonth: Date
  ): remainDaysReturn => {
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
      const data = [{ id: 0, value: 1, label: "過去の家計簿", color: red }];
      return { text: text, data: data };
    }
  };

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

  const daysLeft = remainDaysStr(date.today, date.lastDay);

  // formattedDateは関数化してutilsにおいてもいいかも　"ja-JP"で日本時間に変換
  const formattedDate = date.targetDate.toLocaleDateString("ja-JP", {
    month: "long",
  });

  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{
        textAlign: "center",
        backgroundColor: "white",
        marginBottom: 2,
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
      <Suspense fallback={"Loading"}>
        <ChartWithLetter
          letter={formattedTotalExpensesAmount}
          data={budgetExpenseData}
        />
      </Suspense>
      <Suspense fallback={"Loading"}>
        <ChartWithLetter letter={daysLeft.text} data={daysLeft.data} />
      </Suspense>
    </Box>
  );
};
