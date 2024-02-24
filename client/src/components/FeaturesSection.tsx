import AutoModeIcon from "@mui/icons-material/AutoMode";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import { Box, Grid, Stack, Typography } from "@mui/joy";
import Section from "./Section";
function FeaturesSection() {
  return (
    <Section
      id="features"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Grid
        container
        mx={"20%"}
        p={2}
        columns={3}
        gap={8}
        justifyContent={"center"}
      >
        <Grid lg={1}>
          <Stack p={2} gap={3} data-aos="fade-down">
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ThermostatIcon sx={{ width: "200px", height: "200px" }} />
            </Box>
            <Typography
              level="h3"
              fontWeight={"bold"}
              textColor={"primary.400"}
            >
              Comprehensive Weather Data
            </Typography>
            <Typography textColor={"common.black"}>
              Access daily and monthly temperature and precipitation data to
              monitor weather patterns and make informed decisions for your
              crops.
            </Typography>
          </Stack>
        </Grid>

        <Grid lg={1}>
          <Stack p={2} gap={3} data-aos="fade-down">
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <DateRangeIcon sx={{ width: "200px", height: "200px" }} />
            </Box>
            <Typography
              level="h3"
              fontWeight={"bold"}
              textColor={"primary.400"}
            >
              Optimal Planting Times
            </Typography>
            <Typography textColor={"common.black"}>
              Maximize crop productivity with our feature that identifies
              optimal planting times for various crops based on historical
              weather data and agricultural best practices.
            </Typography>
          </Stack>
        </Grid>

        <Grid lg={1}>
          <Stack p={2} gap={3} data-aos="fade-up">
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <AutoModeIcon sx={{ width: "200px", height: "200px" }} />
            </Box>
            <Typography
              level="h3"
              fontWeight={"bold"}
              textColor={"primary.400"}
            >
              Automated Timeframe Generation
            </Typography>
            <Typography textColor={"common.black"}>
              Let Smart Crop generate optimal planting timeframes for you,
              eliminating guesswork and ensuring precision agriculture tailored
              to your specific crops and location.
            </Typography>
          </Stack>
        </Grid>

        <Grid lg={1}>
          <Stack p={2} gap={3} data-aos="fade-up">
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <WebAssetIcon sx={{ width: "200px", height: "200px" }} />
            </Box>
            <Typography
              level="h3"
              fontWeight={"bold"}
              textColor={"primary.400"}
            >
              User-Friendly Interface
            </Typography>
            <Typography textColor={"common.black"}>
              Experience easy navigation and intuitive usability with our
              user-friendly platform, designed to provide quick access to
              weather information and planting recommendations for farmers and
              gardeners alike.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Section>
  );
}

export default FeaturesSection;
