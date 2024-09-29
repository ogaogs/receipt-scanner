import { Box } from "@mui/material";
import { BarsDataset } from "@/_components/common/BarsDataset/BarsDataset";

const dataset = [
  {
    budget: 50000,
    expense: 30000,
    categoryName: "住宅",
  },
  {
    budget: 10000,
    expense: 40000,
    categoryName: "光熱費",
  },
  {
    budget: 40000,
    expense: 30000,
    categoryName: "日用品",
  },
];

const xAxixsDataKey = "categoryName";

const series = [
  { dataKey: "budget", label: "予算" },
  { dataKey: "expense", label: "出費" },
];

export const LowerDashbord = async () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "white",
      }}
    >
      <BarsDataset
        dataset={dataset}
        series={series}
        xAxixsDataKey={xAxixsDataKey}
      />
    </Box>
  );
};
