import React, { useContext, useEffect, useState } from 'react';
import { ColorSchemeName, SafeAreaView, StatusBar, useColorScheme, View, LayoutRectangle } from 'react-native';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { PublicScreens } from './PublicScreens';
import { updateTheme } from '../features/appSlice';
import { CombinedDarkTheme, CombinedLightTheme } from '../config/theme/Theme';
import { NavigationContainer } from '@react-navigation/native';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { PrivateScreens } from './PrivateScreens';
import Color from 'color';
import Text from '../components/Text';
import { stylesApp } from '../App';
import { HandleContext } from '../context/HandleContext';
import { OrientationLocker } from 'react-native-orientation-locker';
import { Orientation } from '../interfaces/interfaces';

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
                    padding: 10,
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
                    padding: 10,
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
                    padding: 10,
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
    const [layout, setLayout] = useState<LayoutRectangle>();
    const { setToBo, changeOrientation } = useContext(HandleContext);

    useEffect(() => {
        color === 'dark' ? dispatch(updateTheme(CombinedDarkTheme)) : dispatch(updateTheme(CombinedLightTheme));
    }, [color]);

    useEffect(() => {
        if (layout) { setToBo(layout); }
    }, [layout]);

    return (
        <>
            <OrientationLocker
                orientation='UNLOCK'
                onChange={resp => resp.includes('PORTRAIT') ? changeOrientation(Orientation.portrait) : changeOrientation(Orientation.landscape)}
            />
            <NavigationContainer theme={theme}>
                <SafeAreaView style={{ flex: 1 }}>
                    {/* <StatusBar backgroundColor={dark ? Color(colors.background).darken(.4).toString() : colors.background} barStyle={dark ? 'light-content' : 'dark-content'} /> */}
                    <View
                        style={{ flex: 1 }}
                        onLayout={({ nativeEvent: { layout } }) => setLayout(layout)}
                    >
                        {(isAuth) ? <PrivateScreens /> : <PublicScreens />}
                    </View>
                    <Toast
                        config={toastConfig}
                        position='bottom'
                        autoHide={false}
                    />
                </SafeAreaView>
            </NavigationContainer>
        </>
    )
}
