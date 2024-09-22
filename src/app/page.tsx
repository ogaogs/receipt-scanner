import { Box, Toolbar } from '@mui/material';
// import { drawerWidth } from "@/_components/layouts/Sidebar/Sidebar"

const drawerWidth = 320

export default async function Dashboard() {
  return (
    <main>
      {/* HederとSidebarのスペース分ずらす*/}
      <Toolbar />
      <Box 
      sx={{
        boxSizing: 'border-box',
        width: `calc(100% - ${drawerWidth}px)`,
        marginRight: `${drawerWidth}px`,
      }}
      >
        <div>
        ダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボードダッシュボード
        </div>
      </Box>
    </main>
  )
}