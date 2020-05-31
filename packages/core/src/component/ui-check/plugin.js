const uiCheckPlugin = {};

export const prefix = 'debug:ui-check:';

export let _Debug;

export let _closeBadge;

uiCheckPlugin.install = function (weDebug, options = {}) {
  if (uiCheckPlugin.installed) return;
  _Debug = weDebug;

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
                  // tempFilePath可以作为img标签的src属性显示图片
                  const tempFilePaths = res.tempFilePaths;

                  event.emit(prefix + 'upload:done', tempFilePaths[0]);
                }
              });
            }
          }
        }
      },
      options
    )
  );
  _closeBadge = weDebug.createBadge({
    key: 'close',
    show: false,
    draggable: true,
    position: {
      right: 10,
      top: 10
    }
  });

  weDebug.addBadge([_closeBadge]);

  weDebug.addFormRule([rule]);
};

export default uiCheckPlugin;
