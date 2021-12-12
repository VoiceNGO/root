import Canvas from 'canvas';
import ColorTable from './color-table';
import LZW from './lzw';
import { Readable } from 'stream';

export type color = [Number, Number, Number];
export type colorTable = color[];
export type disposalMethods = $Values<typeof DISPOSAL_METHODS>;
export type colorWeightSignature = (
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
) => number;

const DISPOSAL_METHODS = {
  DO_NOT_DISPOSE: 1,
  RESTORE_TO_BACKGROUND: 2,
  RESTORE_TO_PREVIOUS: 3,
};

const COLOR_WEIGHT_METHODS: { [string]: colorWeightSignature } = {
  perceptive: (r1, g1, b1, r2, g2, b2) =>
    Math.pow((r2 - r1) * 0.3, 2) +
    Math.pow((g2 - g1) * 0.59, 2) +
    Math.pow((b2 - b1) * 0.11, 2),
  actual: (r1, g1, b1, r2, g2, b2) =>
    Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2),
};

function littleEndian(number: number, length: number): Array<number> {
  const bytes = new Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = (number >> (8 * (length - 1 - i))) & 0xff;
  }
  return bytes;
}

export default class GIFCanvas extends Canvas {
  static DISPOSAL_METHODS = DISPOSAL_METHODS;
  static COLOR_WEIGHT_METHODS = COLOR_WEIGHT_METHODS;

  preserveTransparency: boolean = true;
  forceLocallColorTable: boolean = false;
  forceGlobalColorTable: boolean = false;
  colorTable: ?colorTable = null;
  currentFrame: GIFFrame;
  currentFrameIndex: number = -1;
  delay: number = 33;
  repeat: boolean = true;
  colorWeightMethod: colorWeightSignature = COLOR_WEIGHT_METHODS.perceptive;
  disposalMethod: disposalMethods = DISPOSAL_METHODS.DO_NOT_DISPOSE;
  headersWritten: boolean = false;
  readStream: Readable = new Readable();
  lastBGFrame: ?GIFFrame = null;

  constructor(width: number, height: number) {
    super(width, height);

    this.addFrame();
  }

  flush(): this {
    if (!this.headersWritten) {
      this.readStream.push(Buffer.from(this.getHeaderBytes()));
      this.headersWritten = true;
    }

    if (this.currentFrame && !this.currentFrame.flushed) {
      this.readStream.push(this.currentFrame.toBuffer(this.lastBGFrame));
      this.currentFrame.setFlushed(true);
    }

    return this;
  }

  getHeaderBytes(): Array<number> {
    const colorTableSize = this.colorTable
      ? { 256: 7, 128: 6, 64: 5, 32: 4, 16: 3, 8: 2, 4: 1 }[
          this.colorTable.length
        ]
      : 0;
    const packedHeaderByte =
      (this.colorTable ? 1 << 7 : 0) |
      (7 << 4) | // color resolution
      colorTableSize;

    return [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] // "GIF89a"
      .concat(
        littleEndian(this.width, 2),
        littleEndian(this.height, 2),
        packedHeaderByte,
        0,
        0
      );
  }

  setPreserveTransparency(allow: boolean): this {
    this.preserveTransparency = allow;

    return this;
  }

  setForceLocalColorTable(force: boolean): this {
    this.forceLocallColorTable = force;

    return this;
  }

  setForceGlobalColorTable(force: boolean): this {
    this.forceGlobalColorTable = force;

    return this;
  }

  getColorTable(): ?colorTable {
    return this.colorTable;
  }

  setColorTable(table: colorTable): this {
    this.colorTable = table;

    return this;
  }

  setDelay(delay: number): this {
    this.delay = delay;

    return this;
  }

  setRepeat(repeat: boolean): this {
    if (this.headersWritten) {
      throw new Error(
        'setRepeat can not be called after headers have been written'
      );
    }
    this.repeat = repeat;

    return this;
  }

  setColorWeightMethod(fn: Function): this {
    this.colorWeightMethod = fn;

    return this;
  }

  addFrame(): this {
    if (this.currentFrameIndex >= 0) this.flush();

    const {
      delay,
      disposalMethod,
      forceGlobalColorTable,
      transparentColorIndex,
    } = this;
    const colorTable = forceGlobalColorTable ? this.colorTable : null;

    this.frames.push(new GIFFrame({ delay, disposalMethod, colorTable }));
    this.currentFrameIndex++;

    return this;
  }

  end() {
    this.flush();
    this.readStream.push();
    this.readStream.push(null);
  }
}

class GIFFrame {
  flushed: boolean = false;
  toBuffer(previousFrame: ?GifFrame): Buffer {}

  setFlushed(flushed: boolean): this {
    this.flushed = flushed;
    return this;
  }

  serialize(): Array<number> {
    const graphicsControlExtension = [
      0x21,
      0xf9,
      byteSize,
      (disposalMethod << 2) | transparentColorFlag,
      littleEndian(this.delayTime, 2),
      transparentColorIndex,
      0,
    ];
    const imageDescriptor = [
      0x2c,
      littleEndian(this.left, 2),
      littleEndian(this.top, 2),
      littleEndian(this.width, 2),
      littleEndian(this.height, 2),
      (localColorFlag << 7) |
        (interlaceFlag << 6) |
        (sortFlag << 5) |
        colorTableSize,
    ];
  }
}
