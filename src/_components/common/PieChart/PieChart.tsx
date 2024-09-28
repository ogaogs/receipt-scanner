"use client";

import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

export const DoughnutPieChart = () => {
  const data = [
    { id: 0, value: 10, label: "series A" },
    { id: 1, value: 15, label: "series B" },
    { id: 2, value: 20, label: "series C" },
  ];
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
