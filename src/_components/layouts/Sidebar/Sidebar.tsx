import * as React from "react";
import { getFirstAndLastExpenseDate } from "@/lib/db/index";
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
import { FirstAndLastExpenseDate } from "@/types";

const drawerWidth = "20%";

const getMonthsInRange = (
  firstAndLastExpenseDate: FirstAndLastExpenseDate
): string[] => {
  const monthsInRange: string[] = [];

  if (firstAndLastExpenseDate._min.date && firstAndLastExpenseDate._max.date) {
    // minDateからmaxDateまでの月を取得
    let currentDate = new Date(
      firstAndLastExpenseDate._min.date.getFullYear(),
      firstAndLastExpenseDate._min.date.getMonth(),
      1
    );
    const endDate = new Date(
      firstAndLastExpenseDate._max.date.getFullYear(),
      firstAndLastExpenseDate._max.date.getMonth(),
      1
    );

    while (currentDate <= endDate) {
      // 年と月を取得し、"YYYY-MM or M" の形式で格納
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString();
      monthsInRange.push(`${year}-${month}`);

      // 次の月に移動
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }
  return monthsInRange;
};

export const Sidebar = async () => {
  const date = "9月22日";
  const proverb = "時は金なり";
  const userId = "30d06a0b-dcb9-4060-911e-d15b50e2b7e0";

  const firstLastExpense = await getFirstAndLastExpenseDate(userId);

  const monthsInRange = getMonthsInRange(firstLastExpense);
  console.log(monthsInRange);

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          {date}の一言
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
