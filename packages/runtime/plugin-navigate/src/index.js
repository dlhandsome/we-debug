const NavigatePlugin = {};

NavigatePlugin.install = function (weDebug, options) {
  if (!Array.isArray(options)) options = [options];

  const rules = [];

  options.forEach(o => {
    const rule = weDebug.createFormRule(
      Object.assign(
        {},
        {
          title: o.title || '',
          state: {
            name: o.name || '前往'
          },
          desc: o.desc || '',
          type: 'arrow',
          handler: {
            bindTap(state) {
              if (!state.disabled) {
                wx.navigateTo({
                  url: o.url
                });
              }
            }
          }
        },
        options
      )
    );

    rules.push(rule);
  });

  weDebug.addFormRule(rules);
};

export default NavigatePlugin;
