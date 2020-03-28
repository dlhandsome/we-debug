const path = require('path')
const { spawnSync } = require('child_process')

const packages = [
  'core',
  'plugin-error',
  'plugin-router'
]

function installAll(pkgs) {
  if (pkgs.length === 0) {
    pkgs = packages
  }
  pkgs.forEach(pkg => {
    install(pkg)
  })
}

function install(name) {
  process.env.FORCE_COLOR = 1
  spawnSync('npm', ['install'], {
    cwd: path.join(process.cwd(), 'packages', name),
    env: process.env,
    stdio: 'inherit'
  })
}

// eslint-disable-next-line no-unused-vars
(function main([bin, file, ...args]) {
  installAll(args)
})(process.argv)
