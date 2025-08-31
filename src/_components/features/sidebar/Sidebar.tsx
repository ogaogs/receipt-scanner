"use client";

import React, { useState, FC, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  Button,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { formatDate, getToday } from "@/utils/time";
import {
  dateDropdownElement,
  ExpenseDetail,
} from "@/_components/features/sidebar/type";
import { Category } from "@/types";
import { CreateExpenseDialog } from "@/_components/features/sidebar/CreateExpenseDialog";
import { gray } from "@/_components/common/Style/style";

const drawerWidth = "20%";

type SidebarProps = {
  userId: string;
  paramDate: string;
  dateDropdownElements: dateDropdownElement[];
  categories: Category[];
  pramUpdateState: boolean;
};
export const Sidebar: FC<SidebarProps> = ({
  userId,
  paramDate,
  dateDropdownElements,
  categories,
  pramUpdateState,
}) => {
  const today = getToday();
  const foramtedToday = formatDate(today, { month: "long", day: true });
  const proverb = "時は金なり";
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [selectedPage, setSelectedPage] = useState<string>(
    pathname.split("/")[1] || "dashboard"
  );
  const [selectedDate, setSelectedDate] = useState<string>(paramDate);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [expenseDate, setExpenseDate] = useState<Date>(today);
  const [storeName, setStoreName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(1);

  const expenseDetailUseState: ExpenseDetail = {
    expenseDate: expenseDate,
    storeName: storeName,
    amount: amount,
    categoryId: categoryId,
    selectedImage: selectedImage,
    fileName: fileName,
    setExpenseDate: setExpenseDate,
    setStoreName: setStoreName,
    setAmount: setAmount,
    setCategoryId: setCategoryId,
    setSelectedImage: setSelectedImage,
    setFileName: setFileName,
  };

  // ページ遷移のための関数
  const handlePageChange = (event: SelectChangeEvent<string>) => {
    const selectedPage = event.target.value;
    setSelectedPage(selectedPage);
    router.push(`/${selectedPage}` + "?date=" + selectedDate); // 選択されたページに遷移
  };

  const handleDateChange = (event: SelectChangeEvent<string>) => {
    setSelectedDate(event.target.value);
    router.push(pathname + "?date=" + event.target.value);
  };

  const handleShowCreateDialog = () => {
    setOpen(true);
  };

  // ダイアログを閉じる関数
  const handleCloseCreateDialog = () => {
    setOpen(false);
    setSelectedImage(null);
    setFileName(null);
    setExpenseDate(today);
    setStoreName("");
    setAmount(0);
    setCategoryId(1);
  };

  // 新規登録がされた際に実行するUseEffect
  useEffect(() => {
    router.push(pathname + "?date=" + selectedDate);
  }, [pramUpdateState]);

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          maxWidth: 250,
          minWidth: 80,
        },
      }}
    >
      {/* ヘッダー分ずらす */}
      <Box
        paddingTop={8}
        sx={{
          paddingX: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <FormControl sx={{ marginY: 2, width: "100%", textAlign: "center" }}>
          <Select autoWidth value={selectedPage} onChange={handlePageChange}>
            <MenuItem value={"dashboard"}>ダッシュボード</MenuItem>
            <MenuItem value={"expenses"}>全ての出費</MenuItem>
            <MenuItem value={"budgets"}>予算の編集</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={handleShowCreateDialog}
          sx={{
            marginBottom: 2,
            color: "black",
            borderColor: gray,
            "&:hover": {
              borderColor: "black",
            },
          }}
        >
          <AddCircleOutlineIcon sx={{ m: 2 }} />
          出費を追加
        </Button>
        <CreateExpenseDialog
          handleClose={handleCloseCreateDialog}
          open={open}
          categories={categories}
          userId={userId}
          pathname={pathname}
          selectedDate={selectedDate}
          router={router}
          expenseDetailUseState={expenseDetailUseState}
        />
        <FormControl
          sx={{ marginBottom: 2, width: "100%", textAlign: "center" }}
        >
          <Select
            // 最後の月をデフォルトに選択 → 必然的に今月
            value={selectedDate}
            // サイドバーのページ遷移のようにvalueで制御するようにする。
            onChange={handleDateChange}
          >
            {dateDropdownElements.map((item, index) => (
              <MenuItem key={index} value={item.dateValue}>
                {item.dateView}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ flexGrow: 1 }} />
        <Card variant="outlined" sx={{ marginTop: "auto", marginBottom: 16 }}>
          <React.Fragment>
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                {foramtedToday}の一言
              </Typography>
              <Typography variant="h5" component="div">
                {proverb}
              </Typography>
            </CardContent>
          </React.Fragment>
        </Card>
      </Box>
    </Drawer>
  );
};
