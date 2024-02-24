import { Box, Typography } from "@mui/joy";

function Footer() {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      height={"100px"}
      alignItems={"center"}
    >
      <Typography textColor={"primary.400"} fontWeight={"bold"}>
        All Rights Reserved 2024
      </Typography>
    </Box>
  );
}

export default Footer;
