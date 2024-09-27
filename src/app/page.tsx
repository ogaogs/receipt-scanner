import { Box } from "@mui/material";
import { UperDashbord } from "@/_components/features/Dashbord/components/UpperDashbord"

export default async function Page() {
  return (
    <>
      <Box sx={{color: "red"}}>
        <UperDashbord/>
      </Box>
      <Box sx={{color: "blue", height: 100}}>下の段</Box>
    </>
  );
}
