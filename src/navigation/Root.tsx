import React, { useEffect } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
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

const toastConfig = {
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
    info: (props: BaseToastProps) => {
        const { colors, fonts, dark } = useAppSelector(state => state.app.theme);
        return (
            <BaseToast
                {...props}
                style={{ borderLeftColor: ColorsAlerts.Info, backgroundColor: dark ? colors.inverseOnSurface : colors.background }}
                text1Style={{ fontSize: fonts.bodyLarge.fontSize }}
                text2Style={{ fontSize: fonts.bodyMedium.fontSize }}
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
                {(isAuth) ? <PrivateScreens /> : <PublicScreens />}
                <Toast config={toastConfig} visibilityTime={4000} />
                <Alerts />
            </NavigationContainer>
        </PaperProvider>
    )
}
