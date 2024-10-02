"use client";

import { FC } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export type PieChartData = {
  id: number;
  value: number;
  label: string;
  color: string;
};

type DoughnutPieChartProps = {
  data: PieChartData[];
};

export const DoughnutPieChart: FC<DoughnutPieChartProps> = ({ data }) => {
  return (
    <>
      <PieChart
        height={240}
        slotProps={{ legend: { hidden: true } }}
        series={[
          {
            data: data,
            innerRadius: 80,
            outerRadius: 100,
            cx: 120,
            cy: 120,
          },
        ]}
      />
    </>
  );
};
