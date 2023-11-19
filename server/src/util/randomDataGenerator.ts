interface RandomData {
  temperature: {
    max: number;
    min: number;
    scale: string;
  };
  water: {
    max: number;
    min: number;
    scale: string;
  };
}

function generateRandomData(
  minTemperature: number,
  maxTemperature: number,
  minWater: number,
  maxWater: number,
  count: number
): RandomData[] {
  const randomDataArray: RandomData[] = [];

  for (let i = 0; i < count; i++) {
    const randomTemperature =
      Math.random() * (maxTemperature - minTemperature) + minTemperature;
    const randomWater = Math.random() * (maxWater - minWater) + minWater;

    const randomData: RandomData = {
      temperature: {
        max: randomTemperature,
        min: randomTemperature,
        scale: "Celsius",
      },
      water: {
        max: randomWater,
        min: randomWater,
        scale: "Centimeters",
      },
    };

    randomDataArray.push(randomData);
  }
  return randomDataArray;
}

export default generateRandomData;
