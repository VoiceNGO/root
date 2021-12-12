export declare function decodeVLEAtOffset(
  bytes: string | number[],
  offset?: number
): {
  number: number;
  offset: number;
};
export default function decodeVLE(bytes: string | number[]): number;
