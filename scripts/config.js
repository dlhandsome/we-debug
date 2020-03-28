const builds = {
  core: {
    name: 'core',
    option: {
      base: 'packages/core/src',
      allowEmpty: true
    },
    scriptsSrc: 'packages/core/src/**/*.js',
    lessSrc: 'packages/core/src/**/*.less',
    copySrc: ['packages/core/src/**/*.{wxml,json}'],
    dest: 'packages/core/dist/'
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
  }
};

if (process.env.TARGET) {
  module.exports = [].concat(builds[process.env.TARGET]);
} else {
  module.exports = Object.keys(builds).map(k => builds[k]);
}
