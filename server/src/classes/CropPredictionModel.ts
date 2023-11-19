import DecisionTree from "decision-tree";
export type Crop = {
  details: {
    temperature: {
      max: number;
      min: number;
      type: "Celsius";
    };
    precipitation: {
      max: number;
      min: number;
      type: "Centimeters";
    };
  };
  label: string;
};

export type WeatherData = {
  temperature: number;
  precipitation: number;
};

export type Coords = {
  lng: number;
  lat: number;
};

class CropPredictionModel {
  model: any;
  trained: boolean;
  constructor(crops: Crop[]) {
    this.train(crops);
  }

  normalize(crops: Crop[]) {
    return crops.map((c) => ({
      label: c.label,
      temperature: (c.details.temperature.min + c.details.temperature.max) / 2,
      precipitation:
        (c.details.precipitation.min + c.details.precipitation.max) / 2,
    }));
  }
  train(crops: Crop[]) {
    const normalizedData = this.normalize(crops);
    const target = "label";
    const features = ["temperature", "precipitation"];
    const dt = new DecisionTree(normalizedData, target, features);

    this.model = dt;
  }

  predict(weatherData: WeatherData[]) {
    return weatherData.map((d) => {
      const prediction = this.model.predict(d);
      return { prediction, ...d };
    });
  }
  minMax(crops: Crop[], weatherData: WeatherData[]) {
    return weatherData
      .map((wd) => {
        const match = crops.find((c) => {
          const { precipitation, temperature } = c.details;

          if (
            precipitation.min >= wd.precipitation &&
            precipitation.max <= wd.precipitation &&
            temperature.min >= wd.temperature &&
            temperature.max <= wd.temperature
          ) {
            return c;
          }
        });

        if (match) return { ...wd, crop: match };
      })
      .filter((x) => x != null);
  }
}

export default CropPredictionModel;
