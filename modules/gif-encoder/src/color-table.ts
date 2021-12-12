export type color = [number, number, number];

const TRANSPARENT: color = [0, 0, 1];

export default class ColorTable {
  #colors: color[] = [];
  useTransparency: boolean;

  constructor(useTransparency: boolean) {
    this.useTransparency = useTransparency;

    if (useTransparency) {
      this.#colors.push(TRANSPARENT.slice());
    }
  }

  addColor(color: color): this {
    this.#colors.push(color);

    return this;
  }

  serialize(): number[] {
    const { size } = this;
    const numColors = this.#colors.length;
    const zerosToAppend = (size - numColors) * 3;

    return [].concat(...this.#colors, Array(zerosToAppend).fill(0));
  }

  get colors(): color[] {
    const { size } = this;
    const colors = this.#colors.slice();
    for (let i = colors.length; i < size; i++) {
      colors.push([0, 0, 0]);
    }
    return colors;
  }

  get size(): number {
    const numColors = this.#colors.length;
    const check = 128;
    while (check > 4) {
      if (numColors > check) return 2 * check;
    }

    return check;
  }
}
