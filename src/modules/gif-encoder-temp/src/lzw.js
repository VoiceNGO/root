// @flow

import ColorTable from './color-table';

import type { tColorWeightSignature } from './index';
import type { tColor } from './color-table';

class LZWCompressor {
  clearCode: number;
  EOICode: number;
  imageData: Array<number>;
  colorTable: ColorTable;
  srcWidth: number;
  srcHeight: number;
  width: number;
  height: number;
  xOffset: number;
  yOffset: number;
  colorWeightMethod: tColorWeightSignature;

  codeTable: Map<string, number> = new Map();
  colorToIndexMap: Map<string, number> = new Map();
  codeIndex: number;
  pixelIndex: number = 0;

  output: Array<number> = [];

  constructor(
    imageData: Array<number>,
    colorTable: ColorTable,
    colorWeightMethod: tColorWeightSignature,
    srcWidth: number,
    srcHeight: number,
    width: number,
    height: number,
    xOffset: number,
    yOffset: number,
  ) {
    if (
      xOffset + width > srcWidth ||
      yOffset + height > srcHeight ||
      xOffset < 0 ||
      yOffset < 0 ||
      width < 0 ||
      height < 0
    ) {
      throw new Error('Invalid dimensions passed to LZWCompressor');
    }

    Object.assign(this, {
      imageData,
      colorTable,
      colorWeightMethod,
      srcWidth,
      srcHeight,
      width,
      height,
      xOffset,
      yOffset,
    });
    this.initializeCodeTable();
  }

  initializeCodeTable(): this {
    const { colorTable, codeTable } = this;
    const { colors } = colorTable;
    const l = colors.length;

    codeTable.clear();
    this.codeIndex = 0;

    for (let i = 0; i < l; i++) {
      const color = colors[i];
      this.addCodeToCodeTable(`${color[0]}-${color[1]}-${color[2]}`);
    }

    this.clearCode = l;
    this.EOICode = l + 1;
    this.codeIndex += 2;

    this.addOutputCode(this.clearCode);

    return this;
  }

  addCodeToCodeTable(code: string): this {
    this.codeTable.set(code, this.codeIndex++);

    return this;
  }

  addOutputCode(code: number): this {
    return this;
  }

  getNextColorIndex(): number {
    const {
      pixelIndex,
      imageData,
      colorTable,
      colorWeightMethod,
      colorToIndexMap,
      srcWidth,
      width,
      height,
      xOffset,
      yOffset,
    } = this;
    this.pixelIndex++;

    const row = Math.floor(pixelIndex / width);
    const col = pixelIndex % width;
    const pixelOffset = ((row + yOffset) * srcWidth + xOffset + col) * 4;

    if (row >= height) {
      return -1;
    }

    // far faster than .slice
    const color = [
      // prettier-ignore
      imageData[pixelOffset],
      imageData[pixelOffset + 1],
      imageData[pixelOffset + 2],
    ];

    // far faster than .join
    const colorKey = `${color[0]}-${color[1]}-${color[2]}}`;

    if (colorToIndexMap.has(colorKey)) {
      // $FlowFixMe
      return colorToIndexMap.get(colorKey);
    }

    // Scan the color table to pick out the closest color
    let bestColorIndex = -1;
    let bestColorDifference = Infinity;
    const { colors } = colorTable;
    for (let i = 0, l = colors.length; i < l; i++) {
      const colorTableColor = colors[i];
      const colorDifference = colorWeightMethod(
        color[0],
        color[1],
        color[2],
        colorTableColor[0],
        colorTableColor[1],
        colorTableColor[2],
      );
      if (colorDifference < bestColorDifference) {
        bestColorDifference = colorDifference;
        bestColorIndex = i;
      }
    }

    return bestColorIndex;
  }

  compress(): this {
    const { colorToIndexMap, codeTable } = this;

    let nextColorIndex;
    let indexBuffer = this.getNextColorIndex().toString();

    while ((nextColorIndex = this.getNextColorIndex()) >= 0) {
      indexBuffer += `-${nextColorIndex}`;
      if (colorToIndexMap.has(indexBuffer)) continue;

      this.addCodeToCodeTable(indexBuffer);
    }

    return this;
  }

  getBuffer(): Buffer {
    return Buffer.from(this.output);
  }
}

export default function compressLZW(
  imageData: Array<number>,
  colorTable: ColorTable,
  colorWeightMethod: tColorWeightSignature,
  srcWidth: number,
  srcHeight: number,
  width: number,
  height: number,
  x: number,
  y: number,
): Buffer {
  const compressor = new LZWCompressor(
    imageData,
    colorTable,
    colorWeightMethod,
    srcWidth,
    srcHeight,
    width,
    height,
    x,
    y,
  );

  return compressor.compress().getBuffer();
}
