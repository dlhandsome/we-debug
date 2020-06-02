const uiCheckPlugin = {};

export const prefix = 'debug:ui-check:';
export let Debug;
export let closeBadge;

uiCheckPlugin.install = function (weDebug, options = {}) {
  if (uiCheckPlugin.installed) return;
  Debug = weDebug;

  const event = weDebug.store.event;

  const rule = weDebug.createFormRule(
    Object.assign(
      {},
      {
        title: 'UI对比',
        desc: '点击按钮上传视觉稿',
        type: 'button',
        state: {
          name: '上传'
        },
        handler: {
          bindTap(state) {
            if (!state.disabled) {
              wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                  const tempFilePaths = res.tempFilePaths;

                  event.emit(prefix + 'init', tempFilePaths[0]);
                }
              });
            }
          }
        }
      },
      options.rule
    )
  );

  closeBadge = weDebug.createBadge(
    Object.assign(
      {},
      {
        key: 'close',
        show: false,
        draggable: true,
        position: {
          right: 10,
          top: 10
        },
        handler: {
          bindTap() {
            event.emit(prefix + 'destory');
          }
        }
      },
      options.closeBadge
    )
  );

  weDebug.addBadge([closeBadge]);
  weDebug.addFormRule([rule]);
};

export default uiCheckPlugin;
