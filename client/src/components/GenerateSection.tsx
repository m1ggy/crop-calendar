import { Grass } from "@mui/icons-material";
import TodayIcon from "@mui/icons-material/Today";
import { Box, Button, Grid, Stack, Typography } from "@mui/joy";
import { animated, useSpring } from "@react-spring/web";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
function GenerateSection() {
  const navigate = useNavigate();
  const springs = useSpring({
    from: { scale: 1 },
    to: [{ scale: 1.1 }, { scale: 1 }, { scale: 1.1 }, { scale: 1 }],
    loop: true,
    delay: 1500,
  });
  return (
    <Section sx={{ backgroundColor: "contrast.primary" }} id="generate">
      <Grid
        container
        columns={2}
        justifyContent={"center"}
        alignItems={"center"}
        mx={"20%"}
        p={2}
        rowGap={5}
      >
        <Grid lg={1}>
          <Stack p={2} gap={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TodayIcon sx={{ width: "200px", height: "200px" }} />
            </Box>
            <Typography
              level="h3"
              fontWeight={"bold"}
              textColor={"primary.400"}
            >
              Display
            </Typography>
            <Typography>
              Generated Crop Calendar for the selected crop Generated Timeframe
              for the selected crop (optimal planting schedule based on the
              generated data)
            </Typography>
          </Stack>
        </Grid>
        <Grid lg={1}>
          <Stack p={2} gap={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grass sx={{ width: "200px", height: "200px" }} />
            </Box>
            <Stack>
              <Typography
                level="h3"
                fontWeight={"bold"}
                textColor={"primary.400"}
              >
                Crops
              </Typography>
              <Typography>
                <br />
                Rice (Oryza sativa)
                <br />
                Banana (Musa spp.)
                <br />
                Coconut (Cocos nucifera)
                <br />
                Corn (Zea mays)
                <br />
                Carrots (Daucus carota)
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography textAlign={"center"} level="h1">
            Ready to start?
          </Typography>
          <animated.div style={{ ...springs }}>
            <Box display={"flex"} justifyContent={"center"}>
              <Button size="lg" onClick={() => navigate("/app")}>
                Open App
              </Button>
            </Box>
          </animated.div>
        </Grid>
      </Grid>
    </Section>
  );
}

export default GenerateSection;
