import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme } from '@react-navigation/native';
import Color from 'color';
import { MD3Theme, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from '../colors';

const whiteTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 5,
  colors: {
    ...MD3LightTheme.colors,
    // primary: colors.Primary,
    // onPrimary: colors.background,
    // primaryContainer: colors.PrimaryLight,
    // onPrimaryContainer: colors.PrimaryDark,

    // secondary: 'green',
    // onSecondary: 'blue',
    // secondaryContainer: colors.PrimaryLight,
    // onSecondaryContainer: colors.PrimaryDark,

    // tertiary: 'magenta',
    // onTertiary: 'magenta',
    // tertiaryContainer: 'magenta',
    // onTertiaryContainer: 'magenta',

    // background: colors.background,
    // onBackground: 'pink',
    // onSurface: colors.Primary,

    // surfaceVariant: Color(colors.Primary).alpha(.1).rgb().string(),
    // onSurfaceVariant: colors.Primary,
    // outline: colors.PrimaryLight,
    primary: colors.Primary,
    primaryContainer: colors.PrimaryLight,
    secondary: colors.Secondary,
    secondaryContainer: colors.PrimaryLight,
    tertiary: 'pink',
    tertiaryContainer: 'pink',
    surface: colors.background,
    surfaceVariant: Color(colors.Primary).alpha(.1).rgb().string(),
    // surfaceDisabled: 'pink',
    background: colors.background,
    onPrimary: Color(colors.Primary).lighten(11).rgb().string(),
    onPrimaryContainer: colors.Primary,
    onSecondary: 'pink',
    onSecondaryContainer: colors.Primary,
    onTertiary: 'pink',
    onTertiaryContainer: 'pink',
    onSurface: colors.Primary,
    onSurfaceVariant: colors.Primary,
    // onSurfaceDisabled: 'pink',
    onBackground: colors.Primary,
    outline: Color(colors.Primary).alpha(.5).rgb().string(),
    inverseSurface: 'pink',
    inverseOnSurface: 'pink',
    inversePrimary: 'pink',
  }
};

const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 5,
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