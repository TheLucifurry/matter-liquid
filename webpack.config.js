const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const Case = require('case');
const replace = require('replace-in-file');
const pkg = require('./package.json');

const name = Case.kebab(pkg.name);
const date = new Date().toISOString().slice(0, 10);
const banner = `${name} ${pkg.version} by ${pkg.author} ${date}\n${pkg.homepage}\nLicense ${pkg.license}`;

function copySync(src, dest) {
  fs.writeFileSync(dest, fs.readFileSync(src));
  console.info('\tCopied: ', path.basename(dest));
};

function afterBuildTask(compilation, callback) {
  replace.sync({
    files: ['index.js', 'index.html', 'examples/*.js'],
    from: [
      /(['"])(.*)(['"][;,\s]*\/\/\s*PLUGIN_NAME)/g,
      /(['"])(.*)(['"][;,\s]*\/\/\s*PLUGIN_VERSION)/g,
      /(['"])(.*)(['"][;,\s]*\/\/\s*PLUGIN_REPO_URL)/g,
    ],
    to: [
      "$1" + name + "$3",
      "$1" + pkg.version + "$3",
      "$1" + pkg.repository.url.replace('.git', '') + "$3",
    ]
  });
  callback();
}

const afterBuildTaskPlugin = {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('afterBuildTaskPlugin', afterBuildTask);
  }
};

module.exports = {
  entry: {
    [name]: `./src/index.ts`,
    // [name + '.min']: `./src/index.ts`
  },
  output: {
    library: Case.pascal(name),
    path: path.resolve(__dirname, './build'),
    publicPath: '/build',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  externals: {
    'matter-js': {
      commonjs: 'matter-js',
      commonjs2: 'matter-js',
      amd: 'matter-js',
      root: 'Matter'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   include: /\.min\.js$/,
    //   minimize: true
    // }),
    new webpack.BannerPlugin(banner),
    afterBuildTaskPlugin,
  ],
  devServer: {
    open: true,
    allowedHosts: ['cdn.jsdelivr.net'],
  },
};