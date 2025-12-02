export function r2Score(yTrue: number[], yPred: number[]): number {
  const mean = yTrue.reduce((sum, v) => sum + v, 0) / yTrue.length;

  let ssRes = 0;
  let ssTot = 0;

  for (let i = 0; i < yTrue.length; i++) {
    const diff = yTrue[i] - yPred[i];
    ssRes += diff * diff;

    const diffMean = yTrue[i] - mean;
    ssTot += diffMean * diffMean;
  }

  // If labels have no variance (e.g. all 0 or all 1),
  // classic R² is undefined. We handle it specially.
  if (ssTot === 0) {
    // Mean squared error per sample
    const mse = ssRes / yTrue.length;
    const rmse = Math.sqrt(mse);

    // If predictions are extremely close to the labels,
    // treat it as "perfect" and return R² = 1.
    if (rmse < 0.05) {
      return 1;
    }

    // Otherwise, R² doesn't really make sense here, so return 0.
    return 0;
  }

  return 1 - ssRes / ssTot;
}

export function rmse(yTrue: number[], yPred: number[]): number {
  let sum = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const diff = yTrue[i] - yPred[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum / yTrue.length);
}

export function mae(yTrue: number[], yPred: number[]): number {
  let sum = 0;
  for (let i = 0; i < yTrue.length; i++) {
    sum += Math.abs(yTrue[i] - yPred[i]);
  }
  return sum / yTrue.length;
}

export function accuracy(
  yTrue: number[],
  yPredProb: number[],
  threshold = 0.5
): number {
  let correct = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const predLabel = yPredProb[i] >= threshold ? 1 : 0;
    if (predLabel === yTrue[i]) correct++;
  }
  return correct / yTrue.length;
}
