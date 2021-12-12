type ArrayOfOneOrMore<T> = {
  0: T;
} & T[];

type ArrayOfTwoOrMore<T> = {
  0: T;
  1: T;
} & T[];

type Double<T> = [T, T];
type Triple<T> = [T, T, T];
type Quad<T> = [T, T, T, T];
