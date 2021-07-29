const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file');
const pkg = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const name = pkg.name;
const date = new Date().toISOString().slice(0, 10);
const banner = `${name} ${pkg.version} by ${pkg.author} ${date}\n${pkg.homepage}\nLicense ${pkg.license}`;

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

const isDevMode = process.argv.includes('--mode=development');

module.exports = {
  entry: {
    [name]: `./src/index.ts`,
  },
  output: {
    path: path.resolve(__dirname, './build'),
    publicPath: '/build',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: name.replace(/^\w|(-\w)/g, l => l.toUpperCase().replace(/\W/, '')), // To PascalCase
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
        test: /\.(frag|vert)$/,
        use: {
          loader: 'webpack-glsl-minify',
          options: {
            preserveAll: true,
          }
        },
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    usedExports: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 2020,
          mangle: {
            properties: {
              regex: /^_/
            }
          }
        },
      })
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: `${isDevMode}`,
    }),
    // new webpack.BannerPlugin(banner),
    new BundleAnalyzerPlugin({
      openAnalyzer: !isDevMode,
    }),
    afterBuildTaskPlugin,
  ],
  devServer: {
    open: true,
    allowedHosts: ['cdn.jsdelivr.net'],
  },
};