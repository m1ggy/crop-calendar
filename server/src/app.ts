import cors from "cors";
import express from "express";
import { fetchWeatherApi } from "openmeteo";
import CropPredictionModel, {
  Coords,
  Crop,
} from "./classes/CropPredictionModel";
import { range } from "./util/range";
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health-check", (req, res) => {
  res.status(200).send("I am healthy!");
});

app.post<{}, {}, { crops: Crop[]; coords: Coords }>(
  "/api/predict",
  async (req, res) => {
    console.log("PREDICT REQUEST: ", req.body);
    try {
      if (!req.body.crops) throw new Error("No crops provided");
      if (!req.body.coords) throw new Error("No coords provided");
      const model = new CropPredictionModel(req.body.crops);

      const params = {
        latitude: `${req.body.coords.lat}`,
        longitude: `${req.body.coords.lng}`,
        start_date: "2021-01-01",
        end_date: "2021-12-31",
        daily: ["temperature_2m_mean", "precipitation_sum"],
        timezone: "Asia/Singapore",
      };

      const responses = await fetchWeatherApi(
        "https://archive-api.open-meteo.com/v1/archive",
        params
      );

      if (responses && responses.length) {
        const response = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const daily = response.daily()!;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
          daily: {
            time: range(
              Number(daily.time()),
              Number(daily.timeEnd()),
              daily.interval()
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            temperature: daily.variables(0)!.valuesArray()!,
            precipitation: daily
              .variables(1)!
              .valuesArray()!
              .map((x) => x * 0.1),
          },
        };

        const data = [];

        weatherData.daily.time.forEach((_, i) => {
          const entry = {
            date: _.toISOString(),
            temperature: weatherData.daily.temperature[i],
            precipitation: weatherData.daily.precipitation[i],
          };
          data.push(entry);
        });

        const result = model.predict(data);

        res.status(200).json({
          result,
          rawData: data,
        });
      }
    } catch (error) {
      return res.status(400).json("an error occured");
    }
  }
);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
