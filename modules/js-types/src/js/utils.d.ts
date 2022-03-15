type Last<T extends any[]> = T extends [...infer I, infer L] ? L : never;
