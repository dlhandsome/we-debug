let depth = 0;

/**
 * 同步执行 fn，期间发起的 wx API 调用不会被 API 面板记录
 * @param fn
 */
export function silent<T>(fn: () => T): T {
  depth++;
  try {
    return fn();
  } finally {
    depth--;
  }
}

export function isSilent() {
  return depth > 0;
}
