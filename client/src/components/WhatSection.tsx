import DataObjectIcon from "@mui/icons-material/DataObject";
import InsightsIcon from "@mui/icons-material/Insights";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { Grid, Stack, Typography } from "@mui/joy";
import Section from "./Section";
function WhatSection() {
  return (
    <Section
      sx={{
        display: "flex",
        alignItems: "center",
        py: 5,
        backgroundColor: "contrast.primary",
      }}
      id="what"
    >
      <Grid container mx={"20%"} p={2} columns={2}>
        <Grid
          lg={1}
          sx={{ display: "flex", justifyContent: "center" }}
          data-aos="fade-right"
          data-aos-duration="800"
        >
          <LocalFloristIcon sx={{ width: "250px", height: "250px" }} />
        </Grid>
        <Grid lg={1} data-aos="fade-left">
          <Stack p={2} gap={3}>
            <Typography
              level="h3"
              fontWeight={"bold"}
              textColor={"primary.400"}
            >
              About
            </Typography>
            <Typography>
              At Smart Crop, we are dedicated to leveraging five years of
              historical data to revolutionize temperature and precipitation
              prediction. By integrating extensive historical datasets, we aim
              to enhance forecast precision and address inherent flaws in
              current prediction methodologies.
            </Typography>
          </Stack>
        </Grid>
        <Grid lg={1} data-aos="fade-right">
          <Stack p={2} gap={3}>
            <Typography
              level="h3"
              fontWeight={"bold"}
              textColor={"primary.400"}
            >
              Improved Model
            </Typography>
            <Typography>
              Historical data improves model initialization, ensuring forecasts
              commence from precise starting points, reducing errors in
              short-term forecasts.
            </Typography>
          </Stack>
        </Grid>
        <Grid
          lg={1}
          data-aos="fade-left"
          data-aos-duration="800"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <InsightsIcon sx={{ width: "250px", height: "250px" }} />
        </Grid>
        <Grid
          lg={1}
          data-aos="fade-left"
          data-aos-duration="800"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <DataObjectIcon sx={{ width: "250px", height: "250px" }} />
        </Grid>
        <Grid lg={1} data-aos="fade-right">
          <Stack p={2} gap={3}>
            <Typography
              level="h3"
              fontWeight={"bold"}
              textColor={"primary.400"}
            >
              Enhanced Data
            </Typography>
            <Typography>
              Assimilating historical observations captures intricate
              atmospheric dynamics effectively, refining forecast accuracy.
            </Typography>
          </Stack>
        </Grid>
        <Grid lg={1} data-aos="fade-left">
          <Stack p={2} gap={3}>
            <Typography
              level="h3"
              fontWeight={"bold"}
              textColor={"primary.400"}
            >
              Machine Learning and Statistical Techniques
            </Typography>
            <Typography>
              Training models on extensive historical data develops
              sophisticated algorithms, improving temperature and precipitation
              forecasts. At Smart Crop, we strive to provide users with more
              reliable and actionable weather forecasts, enhancing societal
              resilience to weather-related impacts.
            </Typography>
          </Stack>
        </Grid>
        <Grid
          lg={1}
          data-aos="fade-right"
          data-aos-duration="800"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <QueryStatsIcon sx={{ width: "250px", height: "250px" }} />
        </Grid>
      </Grid>
    </Section>
  );
}

export default WhatSection;
