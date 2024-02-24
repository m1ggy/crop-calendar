import { Box, Typography } from "@mui/joy";

function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: "5rem",
        py: "1rem",
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "fit-content",
      }}
    >
      <Box>
        <Typography level="h2" textColor={"primary.400"}>
          Smart Crop
        </Typography>
      </Box>
    </Box>
  );
}

export default Header;
