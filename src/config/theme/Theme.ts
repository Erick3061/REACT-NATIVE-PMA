import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme } from '@react-navigation/native';
import Color from 'color';
import { MD3Theme, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from '../colors';

const whiteTheme: MD3Theme = {
  ...MD3LightTheme,
  // roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    onPrimaryContainer: "rgb(79, 86, 169)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(224, 224, 255)",
    primary: "rgb(3, 8, 101)",
    secondary: "rgb(92, 93, 114)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(225, 224, 249)",
    onSecondaryContainer: "rgb(25, 26, 44)",
    tertiary: "rgb(120, 83, 107)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 216, 238)",
    onTertiaryContainer: "rgb(46, 17, 38)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(27, 27, 31)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(27, 27, 31)",
    surfaceVariant: "rgb(227, 225, 236)",
    onSurfaceVariant: "rgb(70, 70, 79)",
    outline: "rgb(119, 118, 128)",
    outlineVariant: "rgb(199, 197, 208)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(48, 48, 52)",
    inverseOnSurface: "rgb(243, 240, 244)",
    inversePrimary: "rgb(190, 194, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(246, 243, 251)",
      level2: "rgb(241, 238, 248)",
      level3: "rgb(236, 233, 246)",
      level4: "rgb(234, 231, 245)",
      level5: "rgb(230, 228, 243)"
    },
    surfaceDisabled: "rgba(27, 27, 31, 0.12)",
    onSurfaceDisabled: "rgba(27, 27, 31, 0.38)",
    backdrop: "rgba(48, 48, 56, 0.4)"
  }
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  // roundness: 4,
  colors: {
    ...whiteTheme.colors,
    onPrimaryContainer: "rgb(191, 194, 255)",
    onPrimary: "rgb(31, 36, 123)",
    primaryContainer: "rgb(55, 61, 146)",
    primary: "rgb(224, 224, 255)",
    secondary: "rgb(197, 196, 221)",
    onSecondary: "rgb(46, 47, 66)",
    secondaryContainer: "rgb(68, 69, 89)",
    onSecondaryContainer: "rgb(225, 224, 249)",
    tertiary: "rgb(232, 185, 213)",
    onTertiary: "rgb(70, 38, 59)",
    tertiaryContainer: "rgb(94, 60, 82)",
    onTertiaryContainer: "rgb(255, 216, 238)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(27, 27, 31)",
    onBackground: "rgb(229, 225, 230)",
    surface: "rgb(27, 27, 31)",
    onSurface: "rgb(229, 225, 230)",
    surfaceVariant: "rgb(70, 70, 79)",
    onSurfaceVariant: "rgb(199, 197, 208)",
    outline: "rgb(145, 143, 154)",
    outlineVariant: "rgb(70, 70, 79)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(229, 225, 230)",
    inverseOnSurface: "rgb(48, 48, 52)",
    inversePrimary: "rgb(80, 86, 172)",
    elevation: {
      level0: "transparent",
      level1: "rgb(35, 35, 42)",
      level2: "rgb(40, 40, 49)",
      level3: "rgb(45, 45, 56)",
      level4: "rgb(47, 47, 58)",
      level5: "rgb(50, 50, 62)"
    },
    surfaceDisabled: "rgba(229, 225, 230, 0.12)",
    onSurfaceDisabled: "rgba(229, 225, 230, 0.38)",
    backdrop: "rgba(48, 48, 56, 0.4)"
  }
};

const CombinedLightTheme: MD3Theme & Theme = {
  ...NavigationDefaultTheme,
  ...whiteTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...whiteTheme.colors,
  },
};
const CombinedDarkTheme: MD3Theme & Theme = {
  ...NavigationDarkTheme,
  ...darkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...darkTheme.colors,
  },
};

export { CombinedDarkTheme, CombinedLightTheme };