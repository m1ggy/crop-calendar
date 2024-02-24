import { Box, Button, Typography } from "@mui/joy";
import { useCallback } from "react";

function StickyNav() {
  const scrollIntoView = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Box
      display={"flex"}
      gap={2}
      justifyContent={"flex-end"}
      position={"sticky"}
      top={0}
      px={5}
      py={2}
      bgcolor={"white"}
    >
      <Button variant="plain" onClick={() => scrollIntoView("what")}>
        <Typography textColor={"primary.400"}>What?</Typography>
      </Button>
      <Button variant="plain" onClick={() => scrollIntoView("features")}>
        <Typography textColor={"primary.400"}>Features</Typography>
      </Button>
      <Button onClick={() => scrollIntoView("generate")}>
        <Typography>Generate</Typography>
      </Button>
    </Box>
  );
}

export default StickyNav;
