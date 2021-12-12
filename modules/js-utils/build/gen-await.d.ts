import Err from './err/index.js';
declare type Unpack<T> = T extends Promise<infer U> ? U : T;
declare type UnpackAll<T> = {
    [P in keyof T]: Unpack<T[P]>;
};
declare type UnpackAllOrNull<T> = {
    [P in keyof T]: Unpack<T[P]> | null;
};
export declare function gen<T>(promise: Promise<T> | T): Promise<[Err, null] | [null, T]>;
export declare function genEnforce<T>(promise: Promise<T | undefined | null> | T | undefined | null): Promise<T>;
export declare function genNull<T>(promise: Promise<T | undefined | null> | T | undefined | null): Promise<T | null>;
export declare function genAll<T extends any[]>(...promises: T): Promise<[Array<Err | null> | null, UnpackAllOrNull<T>]>;
export declare function genAllEnforce<T extends any[]>(...promises: T): Promise<UnpackAll<T>>;
export declare function genAllNull<T extends any[]>(...promises: T): Promise<UnpackAllOrNull<T>>;
export {};
