import { FC } from "react";
import { Box } from "@mui/material";
import { BarsDataset } from "@/_components/common/BarsDataset/BarsDataset";
import { BarsDatasetType } from "@/_components/features/dashbord/type";
import { green, blue, red } from "@/_components/features/dashbord/style"

type LowerDashbordProps = {
  dataset: BarsDatasetType[];
};

const xAxixsDataKey = "categoryName";

export const LowerDashbord: FC<LowerDashbordProps> = async ({ dataset }) => {
  // NOTE: 出費の色が expense > budget = red, expense <= budget = blue にしたい
  const series = [
    { dataKey: "budget", label: "予算", color: green},
    { dataKey: "expense", label: "出費", color: blue},
  ];
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
