// @flow

export type tColor = [number, number, number];

const TRANSPARENT: tColor = [0, 0, 1];

export default class ColorTable {
  _colors: Array<tColor> = [];
  useTransparency: boolean;

  constructor(useTransparency: boolean) {
    this.useTransparency = useTransparency;

    if (useTransparency) {
      this._colors.push(TRANSPARENT.slice());
    }
  }

  addColor(color: tColor): this {
    this._colors.push(color);

    return this;
  }

  serialize(): Array<number> {
    const { size } = this;
    const numColors = this._colors.length;
    const zerosToAppend = (size - numColors) * 3;

    return [].concat(...this._colors, Array(zerosToAppend).fill(0));
  }

  get colors(): Array<tColor> {
    const { size } = this;
    const colors = this._colors.slice();
    for (let i = colors.length; i < size; i++) {
      colors.push([0, 0, 0]);
    }
    return colors;
  }

  get size(): number {
    const numColors = this._colors.length;
    const check = 128;
    while (check > 4) {
      if (numColors > check) return 2 * check;
    }

    return check;
  }
}
