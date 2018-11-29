import path from 'path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

const resolveLocal = dir => path.join(__dirname, dir);

const r = resolveLocal('../../../node_modules');
const out = resolveLocal('../../core/dll');

export default ({ entry, provided = [] }) => ({
  name: 'storybook-ui',
  mode: 'production',

  entry,
  output: {
    path: out,
    filename: '[name]_dll.js',
    library: '[name]_dll',
  },
  externals: provided,

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    shippedProposals: true,
                    modules: false,
                    targets: '> 0.25%, not dead',
                  },
                ],
                '@babel/preset-react',
                '@babel/preset-flow',
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
    modules: [path.join(__dirname, '../../../node_modules')],
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DllPlugin({
      context: r,
      path: `${out}/[name]-manifest.json`,
      name: '[name]_dll',
    }),
  ],
  optimization: {
    concatenateModules: true,
    portableRecords: true,
    moduleIds: 'hashed',
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: file => file.replace('.js', '.LICENCE'),
          banner: licenseFile => `License information can be found in ${licenseFile}`,
        },
      }),
    ],
  },
  performance: {
    hints: false,
  },
});