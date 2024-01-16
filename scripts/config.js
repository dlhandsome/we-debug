const builds = {
  'gulp-tool': {
    name: 'gulp-tool',
    option: {
      base: 'packages/compiler/gulp-tool/src',
      allowEmpty: true
    },
    tsSrc: 'packages/compiler/gulp-tool/src/**/*.ts',
    scriptsSrc: 'packages/compiler/gulp-tool/src/**/*.js',
    dest: 'packages/compiler/gulp-tool/dist/',
    pkg: 'packages/compiler/gulp-tool/package.json'
  },
  core: {
    name: 'core',
    option: {
      base: 'packages/runtime/core/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/core/src/**/*.js',
    lessSrc: ['packages/runtime/core/src/**/*.less', '!packages/runtime/core/src/less/*.*'],
    copySrc: ['packages/runtime/core/src/**/*.{wxml,json}'],
    dest: 'packages/runtime/core/dist/',
    pkg: 'packages/runtime/core/package.json'
  },
  miniprogram: {
    name: 'miniprogram',
    option: {
      base: 'packages/runtime/miniprogram/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/runtime/miniprogram/src/**/*.js',
    lessSrc: ['packages/runtime/miniprogram/src/**/*.less', '!packages/runtime/miniprogram/src/less/*.*'],
    copySrc: [
      'packages/runtime/miniprogram/src/**',
      '!packages/runtime/miniprogram/src/**.ts',
      '!packages/runtime/miniprogram/src/**.js',
      '!packages/runtime/miniprogram/src/**.ts'
    ],
    dest: 'packages/runtime/miniprogram/dist/',
    pkg: 'packages/runtime/miniprogram/package.json'
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
    dest: 'packages/runtime/plugin-launcher/dist/',
    pkg: 'packages/runtime/plugin-launcher/package.json'
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
    dest: 'packages/runtime/plugin-network/dist/',
    pkg: 'packages/runtime/plugin-network/package.json'
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
    dest: 'packages/runtime/plugin-error/dist/',
    pkg: 'packages/runtime/plugin-error/package.json'
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
    dest: 'packages/runtime/plugin-router/dist/',
    pkg: 'packages/runtime/plugin-router/package.json'
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
    dest: 'packages/runtime/plugin-vconsole/dist/',
    pkg: 'packages/runtime/plugin-vconsole/package.json'
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
    dest: 'packages/runtime/plugin-navigate/dist/',
    pkg: 'packages/runtime/plugin-navigate/package.json'
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
    dest: 'packages/runtime/plugin-ui-check/dist/',
    pkg: 'packages/runtime/plugin-ui-check/package.json'
  }
};

if (process.env.TARGET) {
  module.exports = [].concat(builds[process.env.TARGET]);
} else {
  module.exports = Object.keys(builds).map(k => builds[k]);
}
