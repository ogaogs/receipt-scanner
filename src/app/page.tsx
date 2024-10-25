import { signIn } from "@/auth";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  return (
    <Box
      sx={{
        paddingTop: "20%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: 300,
          padding: 3,
          textAlign: "center",
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            家計簿くんへ<br></br>ようこそ
          </Typography>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button
              type="submit"
              variant="outlined"
              startIcon={<FcGoogle />}
              sx={{
                marginTop: 2,
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                borderRadius: "4px",
                backgroundColor: "white",
                border: "1px solid #ddd",
                color: "#757575",
                textTransform: "none",
                ":hover": {
                  backgroundColor: "#f7f7f7",
                  borderColor: "#ccc",
                },
              }}
            >
              Sign in with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
