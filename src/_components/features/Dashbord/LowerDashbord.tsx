import { FC } from "react";
import { Box } from "@mui/material";
import { BarsDataset } from "@/_components/common/BarsDataset/BarsDataset";
import { BarsDatasetType } from "@/_components/features/dashbord/type";

type LowerDashbordProps = {
  dataset: BarsDatasetType[];
};

const xAxixsDataKey = "categoryName";

const series = [
  { dataKey: "budget", label: "予算" },
  { dataKey: "expense", label: "出費" },
];

export const LowerDashbord: FC<LowerDashbordProps> = async ({ dataset }) => {
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
