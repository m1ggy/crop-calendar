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
  date: string;
};

export type TrainingSample = WeatherData & {
  label: 0 | 1; // 1 = viable to plant, 0 = not viable
};

/**
 * Generate labeled training data from weather history by matching
 * daily temperature & precipitation to the crop's ideal ranges.
 */
export function generateTrainingData(
  crop: Crop,
  weatherData: WeatherData[]
): TrainingSample[] {
  const {
    temperature: tempRange,
    precipitation: precipRange,
  } = crop.details;

  return weatherData.map((day) => {
    const tempOk =
      day.temperature >= tempRange.min &&
      day.temperature <= tempRange.max;

    const precipOk =
      day.precipitation >= precipRange.min &&
      day.precipitation <= precipRange.max;

    const label: 0 | 1 = tempOk && precipOk ? 1 : 0;

    return {
      ...day,
      label,
    };
  });
}

class CropPredictionModel {
  crop: Crop;
  model: tf.Sequential | null = null;

  constructor(crops: Crop[], trainingData: TrainingSample[]) {
    if (!Array.isArray(crops) || crops.length !== 1) {
      throw new Error(
        "CropPredictionModel requires exactly one crop in the input array.",
      );
    }

    this.crop = crops[0];

    // kick off training
    void this.train(trainingData);
  }

  async train(trainingData: TrainingSample[]) {
    if (!trainingData.length) {
      throw new Error("No training data provided.");
    }

    const featureArray = trainingData.map((d) => [
      d.temperature,
      d.precipitation,
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

  predict(weatherData: WeatherData[]) {
    if (!this.model) {
      throw new Error("Model has not been trained yet.");
    }

    const features = weatherData.map((data) => [
      data.temperature,
      data.precipitation,
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
        temperature: weatherData[i].temperature,
        precipitation: weatherData[i].precipitation,
        date: weatherData[i].date,
      };
    });
  }

  async evaluate(validationData: TrainingSample[]) {
    if (!this.model) {
      throw new Error("Model has not been trained yet.");
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

      if (ssTot === 0) return 0;
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
