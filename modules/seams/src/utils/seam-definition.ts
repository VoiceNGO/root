/* eslint no-magic-numbers: "off" */

export type tSeamDirection = 'horizontal' | 'vertical';
export type tSeamDirectionWithBoth = tSeamDirection | 'both';

export const HORIZONTAL = 'horizontal';
export const VERTICAL = 'vertical';
export const BOTH = 'both';

// column #s
export type tSeam = Uint16Array;
export type tSeams = Uint16Array[];

// specific energy at each pixel of image
export type tEnergyMap2D = Uint16Array[];
export type tPixelPriorityMap2D = Uint16Array[];

export type tDirectionalSeams = {
  version: number;
  width: number;
  height: number;
  isVertical: boolean;
  mergeSize: number;
  seams: tSeams;
};

export type tFileSeams = {
  vertical?: tDirectionalSeams;
  horizontal?: tDirectionalSeams;
};

export type tPixelPriorityMaps = {
  vertical?: tPixelPriorityMap2D;
  horizontal?: tPixelPriorityMap2D;
};

// "SEAM"
export const HEADER_BYTES = [83, 69, 65, 77];
