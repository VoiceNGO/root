/* eslint prefer-destructuring: "off" */

type arrayTypes = Uint8ClampedArray | Uint16Array | Array<number>;

export function rotateCCW<T extends arrayTypes>(grid: T[]): T[] {
  const height = grid.length;
  const width = grid[0].length;
  const ArrayConstructor = grid[0].constructor;
  const newGrid = Array.from({ length: width }).map(
    // @ts-expect-error -- not going to fight with it here
    () => new ArrayConstructor(height)
  );

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      newGrid[i][j] = grid[j][height - i - 1];
    }
  }

  return newGrid as unknown as T[];
}

export function rotateCW<T extends arrayTypes[]>(grid: T): T {
  const height = grid.length;
  const width = grid[0].length;
  const ArrayConstructor = grid[0].constructor;
  const newGrid = Array.from({ length: width }).map(
    // @ts-expect-error -- not going to fight with it here
    () => new ArrayConstructor(height)
  );

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      newGrid[i][j] = grid[width - j - 1][i];
    }
  }

  // @ts-expect-error -- not going to fight with it here
  return newGrid as unknown as T[];
}
