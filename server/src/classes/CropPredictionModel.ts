// classes/CropPredictionModel.ts
import * as tf from "@tensorflow/tfjs-node";
// If you're in the browser, use "@tensorflow/tfjs" instead.

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
  temperature: number;   // raw °C
  precipitation: number; // raw cm
  date: string;
};

export type TrainingSample = {
  date: string;
  temperature: number;   // normalized
  precipitation: number; // normalized
  label: 0 | 1;          // 1 = viable, 0 = not viable
};

// ---------- Normalization helpers ----------
// Simple feature scaling. You can tune these if you want.
const scaleTemp = (t: number) => t / 50;  // assume -10..40ish → ~0..1
const scalePrecip = (p: number) => p / 20; // assume 0..20 cm/day → 0..1

/**
 * Generate labeled, *normalized* training data from weather history
 * by matching daily temperature & precipitation to the crop's ideal ranges.
 */
export function generateTrainingData(
  crop: Crop,
  weatherData: WeatherData[]
): TrainingSample[] {
  const tempRange = crop.details.temperature;
  const precipRange = crop.details.precipitation;

  // Pre-scale crop thresholds as well
  const cropTempNorm = {
    min: scaleTemp(tempRange.min),
    max: scaleTemp(tempRange.max),
  };

  const cropPrecipNorm = {
    min: scalePrecip(precipRange.min),
    max: scalePrecip(precipRange.max),
  };

  return weatherData.map((day) => {
    const tempNorm = scaleTemp(day.temperature);
    const precipNorm = scalePrecip(day.precipitation);

    const tempOk =
      tempNorm >= cropTempNorm.min && tempNorm <= cropTempNorm.max;
    const precipOk =
      precipNorm >= cropPrecipNorm.min && precipNorm <= cropPrecipNorm.max;

    const label: 0 | 1 = tempOk && precipOk ? 1 : 0;

    return {
      date: day.date,
      temperature: tempNorm,
      precipitation: precipNorm,
      label,
    };
  });
}

class CropPredictionModel {
  crop: Crop;
  model: tf.Sequential | null = null;

  constructor(crops: Crop[]) {
    if (!Array.isArray(crops) || crops.length !== 1) {
      throw new Error(
        "CropPredictionModel requires exactly one crop in the input array.",
      );
    }
    this.crop = crops[0];
  }

  async train(trainingData: TrainingSample[]) {
    if (!trainingData.length) {
      throw new Error("No training data provided.");
    }

    const featureArray = trainingData.map((d) => [
      d.temperature,   // already normalized
      d.precipitation, // already normalized
    ]);
    const labelArray = trainingData.map((d) => [d.label]);

    const xs = tf.tensor2d(featureArray);
    const ys = tf.tensor2d(labelArray);

    this.model = tf.sequential();
    this.model.add(
      tf.layers.dense({ units: 8, inputShape: [2], activation: "relu" }),
    );
    this.model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

    this.model.compile({
      optimizer: tf.train.adam(),
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    console.log("Training model...");
    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 8,
      shuffle: true,
      validationSplit: 0.2,
    });
    console.log("Model trained.");

    xs.dispose();
    ys.dispose();
  }

  /**
   * Predict viability for *raw* weather data.
   * We normalize here before feeding to the model.
   */
  predict(weatherData: WeatherData[]) {
    if (!this.model) {
      throw new Error("Model has not been trained yet.");
    }

    const features = weatherData.map((data) => [
      scaleTemp(data.temperature),
      scalePrecip(data.precipitation),
    ]);

    const xs = tf.tensor2d(features);
    const predictions = this.model.predict(xs) as tf.Tensor;
    const predictedValues = predictions.arraySync() as number[][];

    xs.dispose();
    predictions.dispose();

    return predictedValues.map((value, i) => {
      const prob = value[0];
      return {
        probability: prob,
        prediction: prob >= 0.5 ? this.crop : null,
        temperature: weatherData[i].temperature,       // raw
        precipitation: weatherData[i].precipitation,   // raw
        date: weatherData[i].date,
      };
    });
  }

  /**
   * Evaluate on labeled, normalized data (TrainingSample[])
   */
  async evaluate(validationData: TrainingSample[]) {
    if (!this.model) {
      throw new Error("Model has not been trained yet.");
    }

    if (!validationData.length) {
      throw new Error("No validation data provided.");
    }

    const featureArray = validationData.map((d) => [
      d.temperature,
      d.precipitation,
    ]);
    const labelArray = validationData.map((d) => d.label);

    const xs = tf.tensor2d(featureArray);
    const predsTensor = this.model.predict(xs) as tf.Tensor;
    const predsArray2D = predsTensor.arraySync() as number[][];

    xs.dispose();
    predsTensor.dispose();

    const yTrue = labelArray;
    const yPredProb = predsArray2D.map((row) => row[0]);

    // ---- metrics helpers ----
    const r2Score = (yT: number[], yP: number[]) => {
      const mean = yT.reduce((s, v) => s + v, 0) / yT.length;

      let ssRes = 0;
      let ssTot = 0;
      for (let i = 0; i < yT.length; i++) {
        const diff = yT[i] - yP[i];
        ssRes += diff * diff;
        const diffMean = yT[i] - mean;
        ssTot += diffMean * diffMean;
      }

      if (ssTot === 0) return 0; // no variance in labels
      return 1 - ssRes / ssTot;
    };

    const rmse = (yT: number[], yP: number[]) => {
      let sum = 0;
      for (let i = 0; i < yT.length; i++) {
        const diff = yT[i] - yP[i];
        sum += diff * diff;
      }
      return Math.sqrt(sum / yT.length);
    };

    const mae = (yT: number[], yP: number[]) => {
      let sum = 0;
      for (let i = 0; i < yT.length; i++) {
        sum += Math.abs(yT[i] - yP[i]);
      }
      return sum / yT.length;
    };

    const accuracy = (yT: number[], yP: number[], threshold = 0.5) => {
      let correct = 0;
      for (let i = 0; i < yT.length; i++) {
        const predLabel = yP[i] >= threshold ? 1 : 0;
        if (predLabel === yT[i]) correct++;
      }
      return correct / yT.length;
    };

    const r2 = r2Score(yTrue, yPredProb);
    const rmseVal = rmse(yTrue, yPredProb);
    const maeVal = mae(yTrue, yPredProb);
    const acc = accuracy(yTrue, yPredProb);

    return { r2, rmse: rmseVal, mae: maeVal, accuracy: acc };
  }
}

export default CropPredictionModel;
