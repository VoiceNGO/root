/* eslint no-magic-numbers: "off" */

// prettier-ignore
export const gradientMagnitudeX = new Int8Array([
  -1, 0, 1,
  -2, 0, 2,
  -1, 0, 1,
]);

// prettier-ignore
export const gradientMagnitudeY = new Int8Array([
  -1, -2, -1,
   0,  0,  0,
  -1, -2, -1,
]);

export function multiplyAndSum3x3Matricies(
  matrixA: Int8Array | number[],
  matrixB: Int8Array | number[]
): number {
  return (
    matrixA[0] * matrixB[0] +
    matrixA[1] * matrixB[1] +
    matrixA[2] * matrixB[2] +
    matrixA[3] * matrixB[3] +
    matrixA[4] * matrixB[4] +
    matrixA[5] * matrixB[5] +
    matrixA[6] * matrixB[6] +
    matrixA[7] * matrixB[7] +
    matrixA[8] * matrixB[8]
  );
}
