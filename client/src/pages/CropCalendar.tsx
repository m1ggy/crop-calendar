import { InfoOutlined, YardOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import moment from "moment-timezone";
import { useCallback, useState } from "react";
import Calendar, { CalendarData } from "../components/Calendar";
import LocationSearch from "../components/LocationSearch";

const CROPS = [
  {
    label: "Corn",
    details: {
      temperature: {
        max: 15,
        min: 35,
        scale: "celsius",
      },
      precipitation: {
        max: 3.8,
        min: 2.5,
        scale: "centimeters",
      },
    },
  },
  {
    label: "Rice",
    details: {
      temperature: {
        max: 32,
        min: 24,
        scale: "celsius",
      },
      precipitation: {
        max: 10,
        min: 5,
        scale: "centimeters",
      },
    },
  },
];

type CROP_TYPE = (typeof CROPS)[number];
function CropCalendar() {
  const [location, setLocation] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [crop, setCrop] = useState<CROP_TYPE | null>(null);
  const [cropConfirmed, setCropConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<[] | null>(null);
  const [toDisplay, setToDisplay] = useState<CalendarData[]>([]);

  const createCropCalendar = useCallback(async () => {
    try {
      setProcessing(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/predict`,
        {
          body: JSON.stringify({
            crops: [crop],
            coords: {
              lat: location?.geometry?.location?.lat(),
              lng: location?.geometry?.location?.lng(),
            },
          }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsonresponse = await response.json();

      setResult(jsonresponse.rawData);

      if (jsonresponse.result && jsonresponse.result.length) {
        const parsed = jsonresponse.result.map((x: Record<string, string>) => {
          const date = moment(x.date)
            .tz("Asia/Manila")
            .set("year", moment().year());

          return { ...x, momentDate: date };
        });

        setToDisplay(parsed);
      }
    } finally {
      setProcessing(false);
    }
  }, [crop, location]);
  return (
    <Container maxWidth={"lg"}>
      <Stack gap={2} alignItems={"center"} justifyContent={"center"} pt={5}>
        <Typography level="h1">Crop Calendar</Typography>
        <Stack gap={2} width={"100%"}>
          <Box>
            <LocationSearch
              disabled={locationConfirmed}
              onChange={(value) => {
                setLocation(value);
              }}
            />
          </Box>
          {location ? (
            <Stack gap={1}>
              <Typography>
                Selected location is: <b>{location.name}</b>
              </Typography>
              {locationConfirmed ? null : (
                <Button
                  disabled={locationConfirmed}
                  onClick={() => setLocationConfirmed(true)}
                >
                  Confirm
                </Button>
              )}
            </Stack>
          ) : null}
          {locationConfirmed ? (
            <Stack>
              <FormControl>
                <FormLabel>Crop</FormLabel>
                <Autocomplete
                  startDecorator={<YardOutlined />}
                  disabled={cropConfirmed}
                  options={CROPS}
                  onChange={(_, value) => {
                    if (value) {
                      setCrop(value);
                    }
                  }}
                />
              </FormControl>
            </Stack>
          ) : null}
          {crop ? (
            <Stack gap={1}>
              <Typography>
                Selected crop is: <b>{crop.label}</b>
              </Typography>
              {cropConfirmed ? null : (
                <Button onClick={() => setCropConfirmed(true)}>Confirm</Button>
              )}
            </Stack>
          ) : null}
          {cropConfirmed && locationConfirmed ? (
            <Button
              variant="solid"
              loading={processing}
              onClick={createCropCalendar}
              disabled={!!result}
            >
              Create Crop Calendar
            </Button>
          ) : null}

          {cropConfirmed && locationConfirmed ? (
            <Button
              variant="outlined"
              color="danger"
              onClick={() => {
                setCropConfirmed(false);
                setLocationConfirmed(false);
                setCrop(null);
                setLocation(null);
                setResult(null);
              }}
            >
              Reset
            </Button>
          ) : null}

          {result ? (
            <Stack gap={1}>
              <Stack direction={"row"} gap={1} alignItems={"center"}>
                <Typography level="title-lg">Results</Typography>
                <Tooltip
                  title={
                    <Box maxWidth={"sm"}>
                      <Typography textColor={"common.white"}>
                        The data used are based on the{" "}
                        <a
                          href="https://open-meteo.com/en/docs/historical-weather-api"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "Highlight",
                          }}
                        >
                          OpenMateo Historical Weather API
                        </a>{" "}
                        from 2021 transformed using Decision Tree Algorithm
                        based on real life crop requirements
                      </Typography>
                    </Box>
                  }
                >
                  <IconButton variant="plain">
                    <InfoOutlined />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography>
                The crop <b>{crop?.label}</b> has a precipitation requirement
                of: <b>{crop?.details.precipitation.min} cm</b> to{" "}
                <b>{crop?.details.precipitation.max} cm </b> (Centimeters) and
                temperature requirement of{" "}
                <b>{crop?.details.temperature.max} °C</b> to{" "}
                <b>{crop?.details.temperature.min} °C</b> (Degree Celsius)
              </Typography>
              <Calendar data={toDisplay} />
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Container>
  );
}

export default CropCalendar;
