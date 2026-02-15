module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@stores': './src/stores',
            '@types': './src/types',
            '@utils': './src/utils',
            '@config': './src/config',
            '@theme': './src/theme',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
