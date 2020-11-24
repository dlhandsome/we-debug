const builds = {
  core: {
    name: 'core',
    option: {
      base: 'packages/runtime/core/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/core/src/**/*.js',
    lessSrc: ['packages/runtime/core/src/**/*.less', '!packages/runtime/core/src/less/*.*'],
    copySrc: ['packages/runtime/core/src/**/*.{wxml,json}'],
    dest: 'packages/runtime/core/dist/'
  },
  miniprogram: {
    name: 'miniprogram',
    option: {
      base: 'packages/runtime/miniprogram/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/miniprogram/src/**/*.js',
    lessSrc: ['packages/runtime/miniprogram/src/**/*.less', '!packages/runtime/miniprogram/src/less/*.*'],
    copySrc: ['packages/runtime/miniprogram/src/**/*.{wxml,json}'],
    dest: 'packages/runtime/miniprogram/dist/'
  },
  'plugin-launcher': {
    name: 'plugin-launcher',
    option: {
      base: 'packages/runtime/plugin-launcher/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/plugin-launcher/src/**/*.js',
    lessSrc: 'packages/runtime/plugin-launcher/src/**/*.less',
    copySrc: ['packages/runtime/plugin-launcher/src/**/*.{wxml,json}'],
    dest: 'packages/runtime/plugin-launcher/dist/'
  },
  'plugin-network': {
    name: 'plugin-network',
    option: {
      base: 'packages/runtime/plugin-network/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/plugin-network/src/**/*.js',
    lessSrc: 'packages/runtime/plugin-network/src/**/*.less',
    copySrc: ['packages/runtime/plugin-network/src/**/*.{wxml,json}'],
    dest: 'packages/runtime/plugin-network/dist/'
  },
  'plugin-error': {
    name: 'plugin-error',
    option: {
      base: 'packages/runtime/plugin-error/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/plugin-error/src/**/*.js',
    lessSrc: 'packages/runtime/plugin-error/src/**/*.less',
    copySrc: ['packages/runtime/plugin-error/src/**/*.{wxml,json}'],
    dest: 'packages/runtime/plugin-error/dist/'
  },
  'plugin-router': {
    name: 'plugin-router',
    option: {
      base: 'packages/runtime/plugin-router/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/plugin-router/src/**/*.js',
    lessSrc: 'packages/runtime/plugin-router/src/**/*.less',
    copySrc: ['packages/runtime/plugin-router/src/**/*.{wxml,json}'],
    dest: 'packages/runtime/plugin-router/dist/'
  },
  'plugin-vconsole': {
    name: 'plugin-vconsole',
    option: {
      base: 'packages/runtime/plugin-vconsole/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/plugin-vconsole/src/**/*.js',
    lessSrc: 'packages/runtime/plugin-vconsole/src/**/*.less',
    copySrc: ['packages/runtime/plugin-vconsole/src/**/*.{wxml,json}'],
    dest: 'packages/runtime/plugin-vconsole/dist/'
  },
  'plugin-navigate': {
    name: 'plugin-navigate',
    option: {
      base: 'packages/runtime/plugin-navigate/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/plugin-navigate/src/**/*.js',
    lessSrc: 'packages/runtime/plugin-navigate/src/**/*.less',
    copySrc: ['packages/runtime/plugin-navigate/src/**/*.{wxml,json}'],
    dest: 'packages/runtime/plugin-navigate/dist/'
  },
  'plugin-ui-check': {
    name: 'plugin-ui-check',
    option: {
      base: 'packages/runtime/plugin-ui-check/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/plugin-ui-check/src/**/*.js',
    lessSrc: 'packages/runtime/plugin-ui-check/src/**/*.less',
    copySrc: ['packages/runtime/plugin-ui-check/src/**/*.{wxml,json}'],
    dest: 'packages/runtime/plugin-ui-check/dist/'
  }
};

if (process.env.TARGET) {
  module.exports = [].concat(builds[process.env.TARGET]);
} else {
  module.exports = Object.keys(builds).map(k => builds[k]);
}
