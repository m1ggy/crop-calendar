export function r2Score(yTrue: number[], yPred: number[]): number {
  const mean =
    yTrue.reduce((sum, v) => sum + v, 0) / yTrue.length;

  let ssRes = 0;
  let ssTot = 0;

  for (let i = 0; i < yTrue.length; i++) {
    const diff = yTrue[i] - yPred[i];
    ssRes += diff * diff;
    const diffMean = yTrue[i] - mean;
    ssTot += diffMean * diffMean;
  }

  // guard against divide by zero
  if (ssTot === 0) return 0;
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

// Simple classification accuracy (optional but very useful)
export function accuracy(yTrue: number[], yPredProb: number[], threshold = 0.5) {
  let correct = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const predLabel = yPredProb[i] >= threshold ? 1 : 0;
    if (predLabel === yTrue[i]) correct++;
  }
  return correct / yTrue.length;
}
