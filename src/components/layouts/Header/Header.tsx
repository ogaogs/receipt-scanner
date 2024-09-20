'use client';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export const Header = () => {
  const HeaderTitle = '家計簿くん';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position='fixed'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
            {/* 色を付けたり、ルートへのリンクを付けたり行う。 */}
            <StarIcon/>
            <Typography variant='h6' >{HeaderTitle}</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
