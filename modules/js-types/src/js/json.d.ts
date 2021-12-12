type jsonObject = { [key: string]: json };
type json = string | number | boolean | null | json[] | jsonObject;

interface JSON {
  parse(
    text: string,
    reviver?: (this: any, key: string, value: any) => any
  ): json;
  stringify(
    value: json,
    replacer?: (this: any, key: string, value: any) => any,
    space?: string | number
  ): string;
  stringify(
    value: json,
    replacer?: (number | string)[] | null,
    space?: string | number
  ): string;
}

declare var JSON: JSON;
