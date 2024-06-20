import {
  IAnyObject,
  IPlugin,
  IPluginInitOptions
} from './types';

const NavigatePlugin: IPlugin = {
  install () {}
};

NavigatePlugin.install = function (weDebug, options:IPluginInitOptions) {
  if (!Array.isArray(options)) options = [options];

  const rules: IAnyObject[] = [];

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
            bindTap(state: any) {
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

  weDebug.addFormRule(rules, {
    group: '快捷入口'
  });
};

export default NavigatePlugin;
