import path from 'path';

/** 获取绝对路径 */
export const getAbsolutePath = (p: string, src?: string): string => (path.isAbsolute(p) ? p : path.resolve(src || process.cwd(), p));
