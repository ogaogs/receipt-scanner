import React, { FC } from "react";
import { Box, Avatar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type ReceiptUploadProps = {
  selectedImage: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageRemove: () => void;
};

export const ReceiptUpload: FC<ReceiptUploadProps> = ({
  selectedImage,
  handleImageRemove,
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
      {selectedImage ? (
        <>
          <Avatar
            sx={{
              width: "100%",
              height: "100%",
            }}
            variant="square"
          >
            <img
              src={selectedImage}
              style={{
                maxWidth: "99%", // Avatarの幅に合わせて画像の幅を縮小
                maxHeight: "99%", // Avatarの高さに合わせて画像の高さを縮小
                objectFit: "contain", // 画像が見切れないように比率を保って表示
              }}
            />
          </Avatar>
          <IconButton
            onClick={handleImageRemove}
            sx={{
              position: "absolute",
              top: 1,
              right: 1,
              bgcolor: "#ef5350",
              "&:hover": {
                bgcolor: "#d32f2f",
              },
            }}
            size="small"
          >
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
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
