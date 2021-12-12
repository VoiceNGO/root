/* eslint-disable */
interface BooleanConstructor {
  <T extends false | null | undefined>(value?: T): false;
  <T extends Record<any, any> | true>(value?: T): true;
  <T>(value?: T): boolean;
}
