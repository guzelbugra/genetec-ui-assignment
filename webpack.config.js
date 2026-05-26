const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => {
  const isProd = options.mode === 'production';
  const currentEntry = isProd ? './src/index.ts' : './src/main.tsx';

  const activePlugins = [];
  if (!isProd) {
    activePlugins.push(
      new HtmlWebpackPlugin({
        template: './public/index.html',
      })
    );
  }

  return {
    entry: currentEntry,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      clean: true,
      library: {
        name: 'CoreUI',
        type: 'umd',
        export: 'default',
      },
      globalObject: 'this',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  localIdentName: 'ui-[local]-[hash:base64:4]',
                },
              },
            },
          ],
        },
      ],
    },
    externals: isProd ? {
      react: 'react',
      'react-dom': 'react-dom',
    } : {},
    plugins: activePlugins,
    devServer: {
      port: 3000,
      hot: true,
      open: true,
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
  };
};