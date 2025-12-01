import cors from "cors";
import "dotenv/config";
import express from "express";
import { fetchWeatherApi } from "openmeteo";
import CropPredictionModel, {
  Crop,
} from "./classes/CropPredictionModel";
import emailRouter from "./routes/email";
import { range } from "./util/range";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: ["http://localhost:5173", 'https://crop-calendar.netlify.app'] }));
app.use(express.json());

app.get("/api/health-check", (_, res) => {
  res.status(200).send("I am healthy!");
});

app.use("/api/email", emailRouter);

app.post<object, object, { crops: Crop[]; coords: Record<string, string> }>(
  "/api/predict",
  async (req, res) => {
    console.log("PREDICT REQUEST: ", JSON.stringify(req.body, null, 2));
    try {
      if (!req.body.crops) throw new Error("No crops provided");
      if (!req.body.coords) throw new Error("No coords provided");

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
        params,
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
              daily.interval(),
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

      const model = new CropPredictionModel(req.body.crops, data);


        const result = model.predict(data);
        const evaluation = await model.evaluate(data)

        res.status(200).json({
          result,
          rawData: data,
          evaluation
        });
      }
    } catch (error) {
      return res.status(400).json({ message: "an error occured" });
    }
  },
);

app.listen(port, () => {
  return console.log(`Server is listening at http://localhost:${port}`);
});
