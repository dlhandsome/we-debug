export const isStr = (v: unknown): v is string => typeof v === 'string';

export const isFunc = (fn: unknown): fn is ((...args: any[]) => any) => typeof fn === 'function';

export const isArr = Array.isArray;

export const isEmptyArr = (v: unknown): v is any[] => isArr(v) && v.length === 0;

export const isUndefined = (v: unknown): v is undefined => v === undefined;

export const isNull = (v: unknown): v is null => v === null;

export const isObject = (obj: unknown): obj is object => obj !== null && typeof obj === 'object';

export const isObj = isObject;

export const noop = () => {};
