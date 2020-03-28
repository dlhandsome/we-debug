const path = require('path')
const { spawnSync } = require('child_process')

const packages = [
  'core',
  'plugin-error',
  'plugin-router'
]

function testAll(pkgs) {
  if (pkgs.length === 0) {
    pkgs = packages
  }
  pkgs.forEach(pkg => {
    testOne(pkg)
  })
}

function testOne(name) {
  process.env.FORCE_COLOR = 1
  spawnSync('npm', ['run', 'test'], {
    cwd: path.join(process.cwd(), 'packages', name),
    env: process.env,
    stdio: 'inherit'
  })
}

// eslint-disable-next-line no-unused-vars
(function main([bin, file, ...args]) {
  testAll(args)
})(process.argv)
