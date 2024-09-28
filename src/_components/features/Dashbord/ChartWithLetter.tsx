import { FC } from "react";
import { Box } from "@mui/material";
import { DoughnutPieChart } from "@/_components/common/PieChart/PieChart";

type ChartWithLetterProps = {
  letter: string;
};

export const ChartWithLetter: FC<ChartWithLetterProps> = ({ letter }) => {
  return (
    <Box
      sx={{ width: 200, height: 240, flexBasis: "40%", position: "relative" }}
    >
      {/* 240x240のBoxに 240x240 のDoughnutPieChartを入れることで位置を調整している。*/}
      <Box
        height={240}
        width={240}
        sx={{
          position: "absolute", // absoluteにして重ねる
          top: "50%", // 親要素の50%の位置に配置
          left: "50%", // 親要素の50%の位置に配置
          transform: "translate(-50%, -50%)", // 真ん中に配置するためにtranslate
          display: "flex",
        }}
      >
        <DoughnutPieChart />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          {letter}
        </Box>
      </Box>
    </Box>
  );
};
