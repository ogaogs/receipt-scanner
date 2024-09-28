import { Box } from "@mui/material";
import { UpperDashbord } from "@/_components/features/dashbord/UpperDashbord";

export default async function Page() {
  return (
    <>
      <UpperDashbord />
      <Box sx={{ color: "blue", height: 100 }}>下の段</Box>
    </>
  );
}
