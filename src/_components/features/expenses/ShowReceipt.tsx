import React, { FC } from "react";
import { Box, Avatar } from "@mui/material";

type ShowReceiptProps = {
  receiptImage: string | null;
  fileName: string | undefined;
};

export const ShowReceipt: FC<ShowReceiptProps> = ({
  receiptImage,
  fileName,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      position="relative"
    >
      {fileName ? (
        <>
          <Avatar
            sx={{
              width: "100%",
              height: "100%",
            }}
            variant="square"
          >
            {receiptImage ? (
              <img
                src={receiptImage}
                style={{
                  maxWidth: "99%", // Avatarの幅に合わせて画像の幅を縮小
                  maxHeight: "99%", // Avatarの高さに合わせて画像の高さを縮小
                  objectFit: "contain", // 画像が見切れないように比率を保って表示
                }}
              />
            ) : (
              <p>loading ...</p>
            )}
          </Avatar>
        </>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>レシートがありません</p>
        </Box>
      )}
    </Box>
  );
};
