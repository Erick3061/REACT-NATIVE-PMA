import React, { useEffect } from 'react';
import { ColorSchemeName, SafeAreaView, StatusBar, Text, useColorScheme, View } from 'react-native';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Alerts } from '../components/Alerts';
import { PublicScreens } from './PublicScreens';
import { updateTheme } from '../features/appSlice';
import { CombinedDarkTheme, CombinedLightTheme } from '../config/theme/Theme';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { colors as ColorsAlerts } from '../config/colors';
import { PrivateScreens } from './PrivateScreens';

export const toastConfig = {
    success: (props: BaseToastProps) => {
        const { colors, fonts, dark } = useAppSelector(state => state.app.theme);
        return (
            <BaseToast
                {...props}
                style={{ borderLeftColor: ColorsAlerts.Success, backgroundColor: dark ? colors.inverseOnSurface : colors.background }}
                text1Style={{ fontSize: fonts.bodyLarge.fontSize, color: colors.primary }}
                text2Style={{ fontSize: fonts.bodyMedium.fontSize, color: colors.primary }}
            />
        )
    },
    error: (props: BaseToastProps) => {
        const { colors, fonts, dark } = useAppSelector(state => state.app.theme);
        return (
            <BaseToast
                {...props}
                style={{ borderLeftColor: ColorsAlerts.Error, backgroundColor: dark ? colors.inverseOnSurface : colors.background }}
                text1Style={{ fontSize: fonts.bodyLarge.fontSize, color: colors.primary }}
                text2Style={{ fontSize: fonts.bodyMedium.fontSize, color: colors.primary }}
            />
        )
    },
    customError: (props: BaseToastProps) => {
        const { colors, fonts, dark } = useAppSelector(state => state.app.theme);
        return (
            <View style={{
                borderLeftWidth: 5,
                borderLeftColor: ColorsAlerts.Error,
                backgroundColor: dark ? colors.inverseOnSurface : colors.background,
                borderRadius: 5,
                padding: 5,
                shadowColor: colors.primary,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                width: '85%'
            }}>
                <Text style={[fonts.bodyLarge, { color: colors.primary, fontWeight: 'bold' }]}>{props.text1}</Text>
                <Text style={[fonts.bodyMedium, { color: colors.primary }]}>{props.text2}</Text>
            </View>
        )
    },
    info: (props: BaseToastProps) => {
        const { colors, fonts, dark } = useAppSelector(state => state.app.theme);
        return (
            <BaseToast
                {...props}
                style={{ borderLeftColor: ColorsAlerts.Warning, backgroundColor: dark ? colors.inverseOnSurface : colors.background }}
                text1Style={{ fontSize: fonts.bodyLarge.fontSize, color: colors.primary }}
                text2Style={{ fontSize: fonts.bodyMedium.fontSize, color: colors.primary }}
            />
        )
    }
}

export const Root = () => {
    const { status: isAuth, theme } = useAppSelector((state) => state.app);
    const dispatch = useAppDispatch();
    const color: ColorSchemeName = useColorScheme();

    useEffect(() => {
        color === 'dark' ? dispatch(updateTheme(CombinedDarkTheme)) : dispatch(updateTheme(CombinedLightTheme));
    }, [color]);

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
                <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
                    <StatusBar backgroundColor={theme.colors.background} barStyle={theme.dark ? 'light-content' : 'dark-content'} />
                    <Alerts />
                    {(isAuth) ? <PrivateScreens /> : <PublicScreens />}
                    <Toast config={toastConfig} visibilityTime={4000} />
                </SafeAreaView>
            </NavigationContainer>
        </PaperProvider>
    )
}
