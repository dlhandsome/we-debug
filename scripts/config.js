const builds = {
  core: {
    name: 'core',
    option: {
      base: 'packages/core/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/core/src/**/*.js',
    lessSrc: ['packages/core/src/**/*.less', '!packages/core/src/less/*.*'],
    copySrc: ['packages/core/src/**/*.{wxml,json}'],
    dest: 'packages/core/dist/'
  },
  'plugin-launcher': {
    name: 'plugin-launcher',
    option: {
      base: 'packages/plugin-launcher/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/plugin-launcher/src/**/*.js',
    lessSrc: 'packages/plugin-launcher/src/**/*.less',
    copySrc: ['packages/plugin-launcher/src/**/*.{wxml,json}'],
    dest: 'packages/plugin-launcher/dist/'
  },
  'plugin-network': {
    name: 'plugin-network',
    option: {
      base: 'packages/plugin-network/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/plugin-network/src/**/*.js',
    lessSrc: 'packages/plugin-network/src/**/*.less',
    copySrc: ['packages/plugin-network/src/**/*.{wxml,json}'],
    dest: 'packages/plugin-network/dist/'
  },
  'plugin-error': {
    name: 'plugin-error',
    option: {
      base: 'packages/plugin-error/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/plugin-error/src/**/*.js',
    lessSrc: 'packages/plugin-error/src/**/*.less',
    copySrc: ['packages/plugin-error/src/**/*.{wxml,json}'],
    dest: 'packages/plugin-error/dist/'
  },
  'plugin-router': {
    name: 'plugin-router',
    option: {
      base: 'packages/plugin-router/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/plugin-router/src/**/*.js',
    lessSrc: 'packages/plugin-router/src/**/*.less',
    copySrc: ['packages/plugin-router/src/**/*.{wxml,json}'],
    dest: 'packages/plugin-router/dist/'
  },
  'plugin-vconsole': {
    name: 'plugin-vconsole',
    option: {
      base: 'packages/plugin-vconsole/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/plugin-vconsole/src/**/*.js',
    lessSrc: 'packages/plugin-vconsole/src/**/*.less',
    copySrc: ['packages/plugin-vconsole/src/**/*.{wxml,json}'],
    dest: 'packages/plugin-vconsole/dist/'
  },
  'plugin-navigate': {
    name: 'plugin-navigate',
    option: {
      base: 'packages/plugin-navigate/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/plugin-navigate/src/**/*.js',
    lessSrc: 'packages/plugin-navigate/src/**/*.less',
    copySrc: ['packages/plugin-navigate/src/**/*.{wxml,json}'],
    dest: 'packages/plugin-navigate/dist/'
  }
};

if (process.env.TARGET) {
  module.exports = [].concat(builds[process.env.TARGET]);
} else {
  module.exports = Object.keys(builds).map(k => builds[k]);
}
