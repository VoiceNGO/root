/* eslint no-bitwise: "off", no-magic-numbers: "off", complexity: "off", max-statements: "off" */

function getByte(
  byteArray: string | number[],
  offset: number,
  isString: boolean
): number {
  const byte = byteArray[offset] || 0;

  return isString ? (byte as string).charCodeAt(0) : (byte as number);
}

export function decodeVLEAtOffset(
  bytes: string | number[],
  offset = 0
): { number: number; offset: number } {
  const isString = typeof bytes === 'string';
  let byte = getByte(bytes, offset, isString);
  const isNegative = byte & 64;
  let firstByte = true;
  let offsetCtr = 0;
  let number = 0;

  while (true) {
    if (offsetCtr === 5) {
      throw new RangeError(
        'vle-integers attempting to decode data outside of valid range'
      );
    }

    const bits = firstByte ? 6 : 7;
    const continueFlag = byte & 128;
    const byteVal = byte & ((1 << bits) - 1);

    firstByte = false;
    number += byteVal << (offsetCtr ? 6 + 7 * (offsetCtr - 1) : 0);
    offsetCtr++;

    if (continueFlag) {
      byte = getByte(bytes, offset + offsetCtr, isString);
    } else {
      break;
    }
  }

  return {
    number: isNegative ? -number : number,
    offset: offset + offsetCtr,
  };
}

export default function decodeVLE(bytes: string | number[]): number {
  const decoded = decodeVLEAtOffset(bytes);

  if (decoded.offset !== bytes.length) {
    throw new Error(
      'vle-integers only decoded partial data.  If this is intended use decodeVLEAtOffset instead'
    );
  }

  return decoded.number;
}
