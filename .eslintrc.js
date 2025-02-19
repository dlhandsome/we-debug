module.exports = {
  parser: '@babel/eslint-parser', // 建议更新为新版解析器
  parserOptions: {
    requireConfigFile: false, // 添加这行来禁用配置文件检查
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ['@babel/preset-env'] // 直接在这里配置 Babel
    }
  },
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  rules: {
    strict: [0],
    eqeqeq: 2,
    quotes: [2, 'single', { allowTemplateLiterals: true }],
    'no-underscore-dangle': 0,
    'eol-last': 0,
    camelcase: 0,
    'no-loop-func': 0,
    'no-trailing-spaces': 0,
    'consistent-return': 0,
    'new-cap': 0,
    'no-shadow': 0,
    semi: 0,
    'no-process-exit': 0,
    'no-empty': 0,
    yoda: 0,
    'no-new-func': 0
  },
  globals: {
    wx: 'readonly',
    qq: 'readonly',
    getCurrentPages: 'readonly',
    Component: 'readonly',
    expect: 'readonly',
    __VERSION__: 'readonly'
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier']
};
