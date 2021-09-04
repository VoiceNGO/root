module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current', esmodules: true } }],
    '@babel/preset-typescript',
  ],
  exclude: ['@babel/plugin-transform-regenerator'],
  plugins: [
    // 'codegen',
    // 'transform-decorators-legacy',
    // 'transform-class-properties',
    // 'transform-es2015-modules-commonjs',
    // 'transform-flow-strip-types',
    // 'transform-function-bind',
    // 'transform-object-rest-spread',
    // 'source-map-support',
  ],
  sourceType: 'module',
};
