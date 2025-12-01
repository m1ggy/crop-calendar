import * as tf from "@tensorflow/tfjs";
import { accuracy, mae, r2Score, rmse } from "../util/modelMeasurements";

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

export type TrainingSample = {
  temperature: number;
  precipitation: number;
  label: 0 | 1;
};


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

    void this.train(trainingData);
  }


  /**
   * Simulates training with a placeholder TensorFlow model to retain compatibility.
   */
 async train(trainingData: TrainingSample[]) {
    if (!trainingData.length) {
      throw new Error("No training data provided.");
    }

    // Features: [temperature, precipitation]
    const featureArray = trainingData.map((d) => [
      d.temperature,
      d.precipitation,
    ]);
    // Labels: [0] or [1]
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
   * Predict viability based on weather data using the trained TensorFlow model
   */
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

    const r2 = r2Score(yTrue, yPredProb);
    const rmseVal = rmse(yTrue, yPredProb);
    const maeVal = mae(yTrue, yPredProb);
    const acc = accuracy(yTrue, yPredProb);

    return { r2, rmse: rmseVal, mae: maeVal, accuracy: acc };
  }

}

export default CropPredictionModel;
