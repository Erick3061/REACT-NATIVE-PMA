import { Events } from "../interfaces/interfaces";

export type TypeReport = 'ap-ci' | 'event-alarm' | 'batery' | 'state' | 'apci-week';
export type typeAccount = number;
export type HeaderTableValues = Array<{ title: string, keys?: Array<keyof Events>, size?: number, center?: boolean }>;

export declare type Colors = {
    primary: string;
    primaryContainer: string;
    secondary: string;
    secondaryContainer: string;
    tertiary: string;
    tertiaryContainer: string;
    surface: string;
    surfaceVariant: string;
    surfaceDisabled: string;
    background: string;
    error: string;
    errorContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;
    onTertiary: string;
    onTertiaryContainer: string;
    onSurface: string;
    onSurfaceVariant: string;
    onSurfaceDisabled: string;
    onError: string;
    onErrorContainer: string;
    onBackground: string;
    outline: string;
    outlineVariant: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    shadow: string;
    scrim: string;
    backdrop: string;
    info: string,
    danger: string,
    warning: string,
    success: string,
    question: string
    test: string;
    other: string;
};

export declare enum TypescaleKey {
    displayLarge = "displayLarge",
    displayMedium = "displayMedium",
    displaySmall = "displaySmall",
    headlineLarge = "headlineLarge",
    headlineMedium = "headlineMedium",
    headlineSmall = "headlineSmall",
    titleLarge = "titleLarge",
    titleMedium = "titleMedium",
    titleSmall = "titleSmall",
    labelLarge = "labelLarge",
    labelMedium = "labelMedium",
    labelSmall = "labelSmall",
    bodyLarge = "bodyLarge",
    bodyMedium = "bodyMedium",
    bodySmall = "bodySmall"
}

export declare type Font = {
    fontFamily: string;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
};

export declare type Type = {
    fontFamily: string;
    letterSpacing: number;
    fontWeight: Font['fontWeight'];
    lineHeight: number;
    fontSize: number;
};

export declare type Typescale = {
    [key in TypescaleKey]: Type;
} & {
    ['default']: Omit<Type, 'lineHeight' | 'fontSize'>;
};

export declare type ThemeBase = {
    dark: boolean;
    roundness: number;
    colors: Colors;
    fonts: Typescale;
};