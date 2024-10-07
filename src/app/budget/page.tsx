import { Box } from "@mui/material";

export default async function Page() {
  // NOTE: 今後propsもしくは、contextで取得するようにする。
  const userId = "8f412478-c428-4399-b934-9f0d0cf0a6c5";
  const targetDate = new Date(2024, 9, 4); // NOTE: 今後変化する指定された日付

  return <Box>予算一覧ページ</Box>;
}
