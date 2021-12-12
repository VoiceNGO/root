import Err from './err/index.js';
export declare function every<T>(ary: Array<T>, cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<unknown>, thisArg?: unknown): Promise<[Err | null, boolean]>;
export declare function everyIgnoreErrors<T>(ary: Array<T>, cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<unknown>, thisArg?: unknown): Promise<boolean>;
export declare function map<T, U>(ary: Array<T>, cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<U>, thisArg?: unknown): Promise<[Err | null, Array<U | null>]>;
export declare function mapIgnoreErrors<T, U>(ary: Array<T>, cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<U>, thisArg?: unknown): Promise<Array<U | null>>;
export declare function filter<T>(ary: Array<T>, cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<unknown>, thisArg?: unknown): Promise<[Err | null, Array<T>]>;
export declare function filterIgnoreErrors<T>(ary: Array<T>, cb: (value: T, index: number, array: ReadonlyArray<T>) => Promise<unknown>, thisArg?: unknown): Promise<Array<T>>;
export declare function forEach<T>(ary: Array<T>, cb: (value: T, index: number, array: ReadonlyArray<T>) => unknown, thisArg?: unknown): Promise<Err | null>;
export declare function forEachIgnoreErrors<T>(ary: Array<T>, cb: (value: T, index: number, array: ReadonlyArray<T>) => unknown, thisArg?: unknown): Promise<void>;
