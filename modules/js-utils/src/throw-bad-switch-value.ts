export default function throwBadSwitchValue(val: never): never;
export default function throwBadSwitchValue(val: string) {
  throw new Error(`Unexpected switch value: ${val}`);
}
