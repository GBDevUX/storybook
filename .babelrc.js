module.exports = {
  presets: [
    ['@babel/preset-env', { shippedProposals: true }],
    '@babel/preset-flow',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    'babel-plugin-add-react-displayname',
    'babel-plugin-macros',
    ['emotion', { sourceMap: true, autoLabel: true }],
  ],
  env: {
    test: {
      plugins: ['babel-plugin-require-context-hook', 'babel-plugin-dynamic-import-node'],
    },
  },
  overrides: [
    {
      test: './examples/vue-kitchen-sink',
      presets: [['@babel/preset-env', { shippedProposals: true }], 'babel-preset-vue'],
    },
    {
      test: [
        './addons/storyshots',
        './addons/storysource/src/loader',
        './app/**/src/server/**',
        './lib/codemod',
        './lib/core/src/server',
        './lib/node-logger',
      ],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '8.11',
            },
          },
        ],
      ],
    },
  ],
};
