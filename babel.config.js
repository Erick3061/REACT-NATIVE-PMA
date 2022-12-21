module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: [],
    },
  },
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
