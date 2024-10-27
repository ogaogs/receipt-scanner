"use client";

import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { FC } from "react";
import Image from "next/image";
import { authControl } from "@/_components/layouts/Header/HeaderServer";
import { usePathname } from "next/navigation";

type HeaderProps = {
  isSignedIn: boolean;
  userName: string | null | undefined;
  userImage: string | null | undefined;
};

export const Header: FC<HeaderProps> = ({
  isSignedIn,
  userName,
  userImage,
}) => {
  const HeaderTitle = "家計簿くん";
  const IconImage = userImage ?? "/default.png";
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" && (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Toolbar>
              <Link
                href="/"
                underline="none"
                sx={{ color: "white", display: "flex", alignItems: "center" }}
              >
                <StarIcon />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {HeaderTitle}
                </Typography>
              </Link>
              <Box
                sx={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    borderRadius: "50%",
                    overflow: "hidden",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  <Image
                    src={IconImage}
                    alt="avatar"
                    width={40}
                    height={40}
                  ></Image>
                </div>
                {isSignedIn ? (
                  <>
                    <Typography variant="h6">{userName}</Typography>
                    <Button
                      variant="outlined"
                      onClick={async () => {
                        await authControl("signOut");
                      }}
                      sx={{ backgroundColor: "white" }}
                    >
                      ログアウト
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      await authControl("signIn");
                    }}
                    sx={{ backgroundColor: "white" }}
                  >
                    ログイン
                  </Button>
                )}
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </>
  );
};
