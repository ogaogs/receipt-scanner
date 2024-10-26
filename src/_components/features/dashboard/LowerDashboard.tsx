import { FC, Suspense } from "react";
import { Box } from "@mui/material";
import { BarsDataset } from "@/_components/common/BarsDataset/BarsDataset";
import { BarsDatasetType } from "@/_components/common/BarsDataset/BarsDataset";
import { green, blue } from "@/_components/common/Style/style";

type LowerDashboardProps = {
  dataset: BarsDatasetType[];
};

const xAxixsDataKey = "categoryName";

export const LowerDashboard: FC<LowerDashboardProps> = async ({ dataset }) => {
  // NOTE: 出費の色が expense > budget = red, expense <= budget = blue にしたい
  const series = [
    { dataKey: "budget", label: "予算", color: green },
    { dataKey: "expense", label: "出費", color: blue },
  ];
  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "white",
      }}
    >
      <Suspense fallback={"Loading"}>
        <BarsDataset
          dataset={dataset}
          series={series}
          xAxixsDataKey={xAxixsDataKey}
        />
      </Suspense>
    </Box>
  );
};
