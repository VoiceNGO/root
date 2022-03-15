type Obj = Record<string, unknown>;

interface ObjectConstructor {
  keys<T extends object>(o: T): (keyof T)[];
}
