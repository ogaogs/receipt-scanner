import * as React from "react";
import { getFirstExpenseDate } from "@/lib/db/index";
import {
  Box,
  Drawer,
  Button,
  FormControl,
  Select,
  Toolbar,
  MenuItem,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { FirstExpenseDate } from "@/types";
import { formatDate, getToday } from "@/utils/time";

const drawerWidth = "20%";

const getDatesInRange = (
  firstExpenseDate: FirstExpenseDate,
  today: Date
): Date[] => {
  const monthsInRange: Date[] = [];

  if (firstExpenseDate._min.date) {
    // minDateからmaxDateまでの月を取得
    let currentDate = new Date(
      firstExpenseDate._min.date.getFullYear(),
      firstExpenseDate._min.date.getMonth(),
      1
    );

    while (currentDate <= today) {
      // 年と月を取得し、Data型でその年月の15日を保存
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      monthsInRange.push(new Date(year, month, 15)); // UTCでわかりづらいため、15日にし、年月は分かりやすいようにした

      // 次の月に移動
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }
  return monthsInRange;
};

export const Sidebar = async () => {
  const today = getToday();
  const foramtedToday = formatDate(today, { month: true, day: true });
  const proverb = "時は金なり";
  const userId = "8f412478-c428-4399-b934-9f0d0cf0a6c5";

  const firstExpense = await getFirstExpenseDate(userId);

  const datesInRange = getDatesInRange(firstExpense, today);
  const dateDropdownElements = datesInRange.map((date) => {
    return formatDate(date, { year: true, month: true });
  });
  console.log(datesInRange);

  console.log(dateDropdownElements);

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          {foramtedToday}の一言
        </Typography>
        <Typography variant="h5" component="div">
          {proverb}
        </Typography>
      </CardContent>
    </React.Fragment>
  );

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <Select autoWidth defaultValue={"dashboard"}>
          <MenuItem value={"dashboard"}>ダッシュボード</MenuItem>
          <MenuItem value={"expenses"}>全ての出費</MenuItem>
          <MenuItem value={"budgets"}>予算の編集</MenuItem>
        </Select>
        <Button variant="outlined" sx={{}}>
          <AddCircleOutlineIcon sx={{ m: 2 }} />
          出費を追加
        </Button>
      </FormControl>
      <Box sx={{ m: 1, minWidth: 80 }}>
        <Card variant="outlined">{card}</Card>
      </Box>
    </Drawer>
  );
};
