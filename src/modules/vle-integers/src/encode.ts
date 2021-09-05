/* eslint no-bitwise: "off", no-magic-numbers: "off", no-param-reassign: "off", complexity: "off", max-statements: "off" */

const MAX_NUMBER = Math.pow(2, 31);

export default encodeToBytes;
export function encodeToBytes(number: number): number[] {
  if (Math.abs(number) >= MAX_NUMBER) {
    throw new RangeError(
      'vle-integers can not currently encode a number with an absolute value larger than 2^31 - 1'
    );
  }

  const bytes = [];
  const isNegative = number < 0;
  let byte: number;
  let firstByte = true;

  if (isNegative) {
    number = -number;
  }

  if (number === 0) {
    return [0];
  }

  while (number > 0) {
    if (firstByte) {
      byte = number & 63;

      if (isNegative) {
        byte |= 64;
      }

      number >>= 6;
      firstByte = false;
    } else {
      byte = number & 127;
      number >>= 7;
    }

    if (number) {
      byte |= 128;
    }

    bytes.push(byte);
  }

  return bytes;
}

export function encodeToString(number: number): string {
  return encodeToBytes(number)
    .map((byte) => {
      return String.fromCharCode(byte);
    })
    .join('');
}
