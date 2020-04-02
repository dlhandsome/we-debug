const LauncherPlugin = {};
/**
 * 调试启动器
 *
 * @param {*} weDebug
 * @param {*} [options={}]
 */
LauncherPlugin.install = function (weDebug, options = {}) {
  if (LauncherPlugin.installed) return;
  LauncherPlugin.installed = true;

  const launcherBadge = weDebug.createBadge(
    Object.assign(
      {},
      {
        key: 'debug',
        value: '调试胶囊',
        show: true,
        draggable: true,
        position: {
          right: 10,
          bottom: 20
        },
        handler: {
          bindTap() {
            weDebug.event.emit('debug:mask:show-modal');
          }
        }
      },
      options
    )
  );

  weDebug.addBadge(launcherBadge);
};

export default LauncherPlugin;
