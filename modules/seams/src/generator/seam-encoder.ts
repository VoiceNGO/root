/* eslint no-magic-numbers: "off", no-bitwise: "off" */

import { tSeams } from '../utils/seam-definition';

const GERNERATOR_VERSION = 1;
const MAX_IMAGE_DIMENSION = Math.pow(2, 16);

export type tSeamEncoderOptions = {
  stepSize: number;
  mergeSize: number;
  isVertical: boolean;
  forceDiagonals: boolean;
  imageWidth: number;
  imageHeight: number;
  seams: tSeams;
};

function numberTo2Bytes(num: number) {
  const byte1 = num >> 8;
  const byte2 = num & 0xff;

  return String.fromCharCode(byte1) + String.fromCharCode(byte2);
}

export default function seamEncoder({
  stepSize,
  mergeSize,
  isVertical,
  forceDiagonals,
  imageWidth,
  imageHeight,
  seams,
}: tSeamEncoderOptions): string {
  if (stepSize < 0 || stepSize > 16) {
    throw new RangeError(
      `stepSize is out of range: 0..16, received ${stepSize}`
    );
  }
  if (mergeSize < 0 || mergeSize > 4) {
    throw new RangeError(
      `mergeSize is out of range: 0..4, received ${mergeSize}`
    );
  }
  if (imageWidth < 0 || imageWidth > MAX_IMAGE_DIMENSION) {
    throw new RangeError(
      `imageWidth is out of range: 0..${MAX_IMAGE_DIMENSION}, received ${imageWidth}`
    );
  }
  if (imageHeight < 0 || imageHeight > MAX_IMAGE_DIMENSION) {
    throw new RangeError(
      `imageHeight is out of range: 0..${MAX_IMAGE_DIMENSION}, received ${imageHeight}`
    );
  }

  const configByte =
    ((stepSize - 1) << 4) +
    ((mergeSize - 1) << 2) +
    (isVertical ? 2 : 0) +
    (forceDiagonals ? 1 : 0);
  const numSeams = seams.length;
  const encodedData = [
    'SEAM',
    String.fromCharCode(GERNERATOR_VERSION),
    configByte,
    numberTo2Bytes(imageWidth),
    numberTo2Bytes(imageHeight),
    numberTo2Bytes(numSeams),
  ];

  seams.forEach((seam) => {
    let bitNum = 7;
    let byte = 0;

    encodedData.push(numberTo2Bytes(seam[0]));

    for (let i = 1, l = seam.length; i < l; i++) {
      const val = seam[i];
      const prev = seam[i - 1];

      if (forceDiagonals && val === prev) {
        throw new Error(
          'Unexpected straight seam detected while encoding seam in compressed format'
        );
      }

      // prettier-ignore
      const bits =
        val < prev
          ? [0]
          : val > prev
            ? forceDiagonals
              ? [1]
              : [1, 0]
            : forceDiagonals
              ? []
              : [1, 1];

      for (let j = 0; j < bits.length; j++) {
        if (bits[j]) {
          byte |= 1 << bitNum;
        }

        if (bitNum) {
          bitNum--;
        } else {
          encodedData.push(byte);
          bitNum = 7;
          byte = 0;
        }
      }
    }

    // push whatever is left over
    if (bitNum < 7) {
      encodedData.push(byte);
    }
  });

  return encodedData.join('');
}
