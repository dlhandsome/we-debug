const buble = require('rollup-plugin-buble')
const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const replace = require('rollup-plugin-replace')
const path = require('path')

const getBanner = pkg => `/**
* ${pkg.name} v${pkg.version}
* (c) ${new Date().getFullYear()} dlhandsome
* @license MIT
*/`

const resolvePkgInfo = pkg => {
  const pkgPath = path.resolve(__dirname, '../packages', pkg, 'package.json')
  return require(pkgPath)
}

const builds = {
  core: {
    entry: 'packages/core/src/libs/index.js',
    dest: 'packages/core/dist/libs/index.js',
    env: 'development',
    format: 'cjs',
    version: resolvePkgInfo('core').version,
    banner: getBanner(resolvePkgInfo('core'))
  },
  'plugin-error': {
    entry: 'packages/plugin-error/src/index.js',
    dest: 'packages/plugin-error/dist/index.js',
    env: 'development',
    format: 'cjs',
    version: resolvePkgInfo('plugin-error').version,
    banner: getBanner(resolvePkgInfo('plugin-error'))
  },
  'plugin-router': {
    entry: 'packages/plugin-router/src/index.js',
    dest: 'packages/plugin-router/dist/index.js',
    env: 'development',
    format: 'cjs',
    version: resolvePkgInfo('plugin-router').version,
    banner: getBanner(resolvePkgInfo('plugin-router'))
  }
}

function getConfig(name) {
  let opt = builds[name]
  let config = {
    input: opt.entry,
    external: opt.external,
    plugins: [
      resolve(),
      commonjs(),
      buble({
        objectAssign: 'Object.assign'
      })
    ].concat(opt.options || []),
    output: {
      file: opt.dest,
      format: opt.format,
      banner: opt.bannder,
      name: opt.moduleName || 'WeDebug'
    }
  }
  if (opt.env) {
    config.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify(opt.env),
        __VERSION__: JSON.stringify(opt.version)
      })
    )
  }
  return config
}
if (process.env.TARGET) {
  module.exports = getConfig(process.env.TARGET)
} else {
  exports.getBuild = getConfig
  exports.getAllBuilds = () => Object.keys(builds).map(getConfig)
}