import React, { useEffect } from 'react';
import { ColorSchemeName, SafeAreaView, StatusBar, useColorScheme, View } from 'react-native';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { PublicScreens } from './PublicScreens';
import { updateTheme } from '../features/appSlice';
import { CombinedDarkTheme, CombinedLightTheme } from '../config/theme/Theme';
import { NavigationContainer } from '@react-navigation/native';
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { PrivateScreens } from './PrivateScreens';
import Color from 'color';
import Text from '../components/Text';
import { baseUrl } from '../api/Api';
import { stylesApp } from '../App';

export const toastConfig = {
    success: ({ text1, text2 }: BaseToastProps) => {
        const { colors, dark, roundness } = useAppSelector(state => state.app.theme);
        return (
            <View style={[
                stylesApp.shadow,
                {
                    borderLeftWidth: 5,
                    borderLeftColor: colors.success,
                    backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background,
                    shadowColor: colors.success,
                    elevation: 2,
                    padding: 5,
                    paddingVertical: 15,
                    width: '90%',
                    borderRadius: roundness * 2,
                }
            ]}>
                {text1 && <Text variant='bodyLarge' style={[{ fontWeight: 'bold' }]}>{text1}</Text>}
                {text2 && <Text variant='bodyMedium' >{text2}</Text>}
            </View>
        )
    },
    error: ({ text1, text2 }: BaseToastProps) => {
        const { colors, dark, roundness } = useAppSelector(state => state.app.theme);
        return (
            <View style={[
                stylesApp.shadow,
                {
                    borderLeftWidth: 5,
                    borderLeftColor: colors.danger,
                    backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background,
                    shadowColor: colors.danger,
                    elevation: 2,
                    padding: 5,
                    paddingVertical: 15,
                    width: '90%',
                    borderRadius: roundness * 2,
                }
            ]}>
                {text1 && <Text variant='bodyLarge' style={[{ fontWeight: 'bold' }]}>{text1}</Text>}
                {text2 && <Text variant='bodyMedium' >{text2}</Text>}
            </View>
        )
    },
    info: ({ text1, text2 }: BaseToastProps) => {
        const { colors, dark, roundness } = useAppSelector(state => state.app.theme);
        return (
            <View style={[
                stylesApp.shadow,
                {
                    borderLeftWidth: 5,
                    borderLeftColor: colors.info,
                    backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background,
                    shadowColor: colors.info,
                    elevation: 2,
                    padding: 5,
                    paddingVertical: 15,
                    width: '90%',
                    borderRadius: roundness * 2,
                }
            ]}>
                {text1 && <Text variant='bodyLarge' style={[{ fontWeight: 'bold' }]}>{text1}</Text>}
                {text2 && <Text variant='bodyMedium' >{text2}</Text>}
            </View>
        )
    }
}

export const Root = () => {
    const { status: isAuth, theme } = useAppSelector((state) => state.app);
    const { colors, dark } = theme;
    const dispatch = useAppDispatch();
    const color: ColorSchemeName = useColorScheme();

    useEffect(() => {
        color === 'dark' ? dispatch(updateTheme(CombinedDarkTheme)) : dispatch(updateTheme(CombinedLightTheme));
    }, [color]);

    return (
        <NavigationContainer theme={theme}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <StatusBar backgroundColor={dark ? Color(colors.background).darken(.4).toString() : colors.background} barStyle={dark ? 'light-content' : 'dark-content'} />
                {(isAuth) ? <PrivateScreens /> : <PublicScreens />}
                <Toast config={toastConfig} visibilityTime={3500} position='bottom' autoHide />
            </SafeAreaView>
        </NavigationContainer>
    )
}
