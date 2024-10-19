import React, { FC } from "react";
import { Box, Button, Avatar, IconButton } from "@mui/material";
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
            src={selectedImage}
            variant="square"
          />
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
