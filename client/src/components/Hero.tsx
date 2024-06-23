import { Box, Typography } from "@mui/joy";
import Section from "./Section";
function Hero() {
  return (
    <Section
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "86vh",
      }}
      id="home"
      >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        height={"100%"}
        data-aos="flip-right"
        data-aos-duration="800"
        data-aos-easing="ease-in-out"
        data-aos-mirror="true"
        >
        <Typography
          level="h1"
          textColor={"white"}
          textAlign={"center"}
          fontSize={"90px"}
          >
          Accurate Crop Calendars.
          <br />
          Anywhere.
        </Typography>
      </Box>
    </Section>
  );
}

export default Hero;
