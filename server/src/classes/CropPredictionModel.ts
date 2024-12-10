import * as tf from "@tensorflow/tfjs";

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

class CropPredictionModel {
  crop: Crop;
  model: tf.Sequential | null = null;

  constructor(crops: Crop[]) {
    if (!Array.isArray(crops) || crops.length !== 1) {
      throw new Error(
        "CropPredictionModel requires exactly one crop in the input array.",
      );
    }

    this.crop = crops[0]; // Always a single crop
    this.train(crops); // Simulate training for consistency
  }

  /**
   * Simulates training with a placeholder TensorFlow model to retain compatibility.
   */
  async train(crops: Crop[]) {
    const normalizedData = crops.map((crop) => ({
      label: crop.label,
      temperature:
        (crop.details.temperature.min + crop.details.temperature.max) / 2,
      precipitation:
        (crop.details.precipitation.min + crop.details.precipitation.max) / 2,
    }));

    const features = normalizedData.map((d) => [
      d.temperature,
      d.precipitation,
    ]);
    const labels = normalizedData.map(() => 1); // Always one label

    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels.map((label) => [label]));

    this.model = tf.sequential();
    this.model.add(
      tf.layers.dense({ units: 1, inputShape: [2], activation: "sigmoid" }),
    );
    this.model.compile({
      optimizer: tf.train.adam(),
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    console.log("Training model with placeholder data...");
    await this.model.fit(xs, ys, { epochs: 10, batchSize: 1 });
    console.log("Model trained.");
  }

  /**
   * Predict viability based on weather data using the trained TensorFlow model
   */
  predict(weatherData: WeatherData[]) {
    if (!this.model) {
      throw new Error("Model has not been trained yet.");
    }

    // Convert weather data to tensor
    const features = weatherData.map((data) => [
      data.temperature,
      data.precipitation,
    ]);
    const xs = tf.tensor2d(features);

    // Perform predictions
    const predictions = this.model.predict(xs) as tf.Tensor;
    const predictedValues = predictions.arraySync() as number[][];

    // Decode predictions and return results
    return predictedValues.map((value, i) => ({
      prediction: value[0] >= 0.5 ? this.crop : null, // Threshold at 0.5
      temperature: weatherData[i].temperature,
      precipitation: weatherData[i].precipitation,
    }));
  }
}

export default CropPredictionModel;
