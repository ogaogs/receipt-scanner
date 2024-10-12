"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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

type dateDropdownElement = {
  dateValue: string;
  dateView: string;
};

const getDatesInRange = (
  firstExpenseDate: FirstExpenseDate,
  today: Date
): Date[] => {
  const monthsInRange: Date[] = [];

  if (firstExpenseDate._min.date) {
    // minDateの年月を取得
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

export const Sidebar = () => {
  const today = getToday();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const foramtedToday = formatDate(today, { month: "long", day: true });
  const proverb = "時は金なり";
  const userId = "8f412478-c428-4399-b934-9f0d0cf0a6c5";
  const router = useRouter();
  const pathname = usePathname();

  const [selectedPage, setSelectedPage] = useState(
    pathname.split("/")[1] || "dashboard"
  );
  const [dateDropdownElements, setDateDropdownElements] = useState<
    dateDropdownElement[]
  >([
    {
      dateValue: `${todayYear}-${todayMonth}`,
      dateView: `${todayYear}年${todayMonth}月`,
    },
  ]);

  const setdateDropdownElements: (
    userId: string
  ) => Promise<void> = async () => {
    const firstExpense = await getFirstExpenseDate(userId);
    const datesInRange = getDatesInRange(firstExpense, today);
    const dateDropdown = datesInRange.map((date): dateDropdownElement => {
      return {
        dateValue: formatDate(date, { year: true, month: "2-digit" }).replace(
          "/",
          "-"
        ),
        dateView: formatDate(date, { year: true, month: "long" }),
      };
    });
    setDateDropdownElements(dateDropdown);
  };

  useEffect(() => {
    setdateDropdownElements(userId);
  }, [userId]);

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

  // ページ遷移のための関数
  const handlePageChange = (event: any) => {
    const selectedPage = event.target.value;
    setSelectedPage(selectedPage);
    router.push(`/${selectedPage}`); // 選択されたページに遷移
  };

  useEffect(() => {
    // pathnameが変更された時、selectedPageも更新する
    setSelectedPage(pathname.split("/")[1] || "dashboard");
  }, [pathname]);

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
      <FormControl sx={{ m: 1, minWidth: 80, textAlign: "center" }}>
        <Select autoWidth value={selectedPage} onChange={handlePageChange}>
          <MenuItem value={"dashboard"}>ダッシュボード</MenuItem>
          <MenuItem value={"expenses"}>全ての出費</MenuItem>
          <MenuItem value={"budgets"}>予算の編集</MenuItem>
        </Select>
      </FormControl>
      <Button variant="outlined" sx={{}}>
        <AddCircleOutlineIcon sx={{ m: 2 }} />
        出費を追加
      </Button>
      <FormControl sx={{ m: 1, minWidth: 80, textAlign: "center" }}>
        <Select
          // 最後の月をでファルとに選択 → 必然的に今月
          defaultValue={
            dateDropdownElements[dateDropdownElements.length - 1].dateValue
          }
          // サイドバーのページ遷移のようにvalueで制御するようにする。
        >
          {dateDropdownElements.map((item, index) => (
            <MenuItem key={index} value={item.dateValue}>
              {item.dateView}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ m: 1, minWidth: 80 }}>
        <Card variant="outlined">{card}</Card>
      </Box>
    </Drawer>
  );
};
