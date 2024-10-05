"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { FC } from "react";

export type BarsDatasetType = {
  budget: number;
  expense: number;
  categoryName: string;
};

type BarsDatasetProps = {
  dataset: BarsDatasetType[];
  series: {
    dataKey: string;
    label: string;
  }[];
  xAxixsDataKey: string;
};

const chartSetting = {
  height: 400,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {},
  },
};

export const BarsDataset: FC<BarsDatasetProps> = ({
  dataset,
  series,
  xAxixsDataKey,
}) => {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: "band", dataKey: xAxixsDataKey }]}
      series={series}
      {...chartSetting}
    />
  );
};
