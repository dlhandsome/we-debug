export const isStr = v => typeof v === 'string';

export const isFunc = fn => typeof fn === 'function';

export const isArr = Array.isArray;

export const isEmptyArr = v => isArr(v) && v.length === 0;

export const isUndefined = v => v === undefined;

export const isNull = v => v === null;

export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

export const isObj = isObject;

export const noop = () => {};
