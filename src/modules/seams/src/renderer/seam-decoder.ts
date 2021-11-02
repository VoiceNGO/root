/* eslint no-bitwise: "off", no-magic-numbers: "off", no-implicit-coercion: "off", max-statements: "off", class-methods-use-this: "off" */

// @typescript-eslint/no-shadow eslint rule is broken so aliasing
import {
  HORIZONTAL,
  tDirectionalSeams,
  tPixelPriorityMap2D,
  tPixelPriorityMaps,
  tSeam,
  tSeams,
  VERTICAL,
} from '../utils/seam-definition';
import { rotateCCW } from '../utils/rotate-matrix';
import { HEADER_BYTES } from './../utils/seam-definition';

export default function decodeSeams(encodedData: string): tPixelPriorityMaps {
  const encodedBytes = toByteArray(encodedData);

  // Decode first seam in the file
  const decodedSeamData = decodeSeamData(encodedBytes);
  const pxPriorityMap = getRotationCorrectedPixelPriorityMap(decodedSeamData);
  const { isVertical, byteOffset } = decodedSeamData;
  const pxPriorityMaps: tPixelPriorityMaps = {
    [isVertical ? VERTICAL : HORIZONTAL]: pxPriorityMap,
  };

  if (byteOffset < encodedData.length) {
    // Decode second seam in the file
    const decodedSeamData2 = decodeSeamData(encodedBytes);
    const pxPriorityMap2 =
      getRotationCorrectedPixelPriorityMap(decodedSeamData2);
    const { isVertical: isVertical2, byteOffset: byteOffset2 } =
      decodedSeamData2;
    pxPriorityMaps[isVertical2 ? VERTICAL : HORIZONTAL] = pxPriorityMap2;

    if (isVertical === isVertical2) {
      throw new Error(
        `Found two ${
          isVertical ? 'vertical' : 'horizontal'
        } seams in same seam file.  Expected one of each`
      );
    }

    if (byteOffset2 < encodedData.length) {
      throw new Error(
        'Seam file decoding failed.  Found data after expected EOF'
      );
    }
  }

  return pxPriorityMaps;
}

function toByteArray(encodedString: string): Uint8ClampedArray {
  const len = encodedString.length;
  const ary = new Uint8ClampedArray(len);

  for (let i = 0; i < len; i++) {
    ary[i] = encodedString.charCodeAt(i);
  }

  return ary;
}

function decodeSeamData(
  bytes: Uint8ClampedArray,
  byteOffset = 0
): tDirectionalSeams & {
  byteOffset: number;
} {
  let byte = byteOffset;

  const headerBytes = bytes.slice(byteOffset, byteOffset + 4);
  byte += 4;

  if (headerBytes.join(',') !== HEADER_BYTES.join(',')) {
    throw new Error('Unexpected header in seam file');
  }

  const version = bytes[byte++]; // not currently used
  const configByte = bytes[byte++];
  const stepSize = (configByte >> 4) + 1; // 4 bits
  const mergeSize = ((configByte >> 2) & 3) + 1; // 2 bits
  const isVertical = !!(configByte & 2); // 1 bit
  const compressed = !!(configByte & 1); // 1 bit

  let decodeOffset = 1;
  let bitOffset = 0;

  function read2ByteNumber() {
    const byte1 = bytes[decodeOffset++];
    const byte2 = bytes[decodeOffset++];

    return (byte1 << 8) + byte2;
  }

  function readBit() {
    if (--bitOffset < 0) {
      bitOffset = 7;
      byte = bytes[decodeOffset];
      decodeOffset++;
    }

    return byte & (1 << decodeOffset);
  }

  const width = read2ByteNumber();
  const height = read2ByteNumber();
  const numSeams = read2ByteNumber();

  const seams: tSeams = [];
  const seamLength = isVertical ? height : width;
  const numSeamSteps = Math.ceil((seamLength - 1) / stepSize);

  for (let seamNum = 0; seamNum < numSeams; seamNum++) {
    let seamCol = read2ByteNumber();
    const seam: tSeam = new Uint16Array(seamLength);
    seam[0] = seamCol;

    // compressed mode:
    //   0 = left  / down
    //   1 = right / up
    //
    // uncompressed mode:
    //   0  = left  / down
    //   10 = straight
    //   11 = right / up
    for (let seamStep = 0; seamStep < numSeamSteps; seamStep++) {
      const dir = readBit() ? (compressed ? 1 : readBit() ? 1 : 0) : -1;

      for (let fillStep = 0; fillStep < stepSize; fillStep++) {
        seamCol += dir;
        seam[seamStep * stepSize + fillStep + 1] = seamCol;
      }
    }

    seams.push(seam);
  }

  return {
    version,
    width,
    height,
    isVertical,
    mergeSize,
    seams,
    byteOffset,
  };
}

function getRotationCorrectedPixelPriorityMap(
  decodedSeamData: tDirectionalSeams
): tPixelPriorityMap2D {
  const { width, height, seams, mergeSize, isVertical } = decodedSeamData;
  const pxPriorityMap: tPixelPriorityMap2D = [];

  for (let i = 0; i < height; i++) {
    pxPriorityMap[i] = new Uint16Array(width);
  }

  seams.forEach((seam, priority) => {
    for (let y = 0; y < height; y++) {
      seam.forEach((x) => {
        for (let i = 0; i < mergeSize; i++) {
          pxPriorityMap[y][x + i] = priority;
        }
      });
    }
  });

  return isVertical ? pxPriorityMap : rotateCCW(pxPriorityMap);
}
