module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'no-console': 0,
    eqeqeq: 0,
    'arrow-parens': 0,
    'comma-dangle': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'operator-linebreak': 0,
    'no-useless-concat': 0,
    'consistent-return': 0,
    'no-unused-vars': 0
  }
};
