/**
 * 获取当前页面栈
 * @returns
 */
export function getCurrentPage() {
  const pages = getCurrentPages();
  return pages.length > 0 ? pages[pages.length - 1] : null;
}

/**
 * 获取参数 search 值
 * @param {*} options
 * @returns
 */
export function getRouteSearch(options = {}) {
  return Object.keys(options)
    .map(k => `${k}=${options[k]}`)
    .join('&');
}
