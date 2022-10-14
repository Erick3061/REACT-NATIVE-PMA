import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme } from '@react-navigation/native';
import Color from 'color';
import { MD3Theme, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from '../colors';

const whiteTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 3,
  mode: 'exact',
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.Primary,
    onPrimary: '#e8eaf6',
    primaryContainer: '#c5cae9',
    onPrimaryContainer: colors.PrimaryDark,

    secondary: 'green',
    onSecondary: 'blue',
    secondaryContainer: '#c5cae9',
    onSecondaryContainer: colors.PrimaryDark,

    tertiary: 'magenta',
    onTertiary: 'magenta',
    tertiaryContainer: 'magenta',
    onTertiaryContainer: 'magenta',

    background: colors.background,
    onBackground: 'pink',
    onSurface: colors.Primary,

    surfaceVariant: Color(colors.Primary).alpha(.1).rgb().string(),
    onSurfaceVariant: colors.Primary,
    outline: colors.PrimaryLight,
  }
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 3,
  mode: 'adaptive',
  colors: {
    ...whiteTheme.colors,
    primary: colors.DarkPrimary,
    onPrimary: 'aliceblue',
    primaryContainer: 'aliceblue',
    onPrimaryContainer: colors.DarkPrimaryDark,

    secondary: 'green',
    onSecondary: 'blue',
    secondaryContainer: colors.SecondaryDark,
    onSecondaryContainer: 'aliceblue',

    tertiary: 'magenta',
    onTertiary: 'magenta',
    tertiaryContainer: 'magenta',
    onTertiaryContainer: 'magenta',

    background: colors.DarkPrimaryDark,
    onBackground: 'pink',
    onSurface: 'aliceblue',

    onSurfaceVariant: 'aliceblue',
    outline: colors.DarkPrimaryLight,

    error: colors.Error
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