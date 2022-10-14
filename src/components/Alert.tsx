import React, { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Button, Dialog, SegmentedButtons, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { colors } from '../config/colors';
import { vw } from '../config/Dimensions';
import { CombinedDarkTheme, CombinedLightTheme } from '../config/theme/Theme';
import { updateQuestion } from '../features/alertSlice';
import { updateTheme } from '../features/appSlice';
import { LightenDarkenColor } from '../functions/functions';

type Props = {
    type: 'info' | 'error' | 'question' | 'warning' | 'success' | 'theme';
    icon?: boolean;
    text?: { title: string, subtitle: string, msg: string };
    textConfirm?: string;
    textCancel?: string;
    visible: boolean;
    dismissable?: boolean;
    dispatch?: () => void;
    func?: () => void;
    timeClose?: number;
}

export const Alert = ({ icon, visible, dismissable, text, type, dispatch, textCancel, textConfirm, timeClose }: Props) => {

    const { colors: ThemeColors, dark } = useAppSelector((state) => state.app.theme);
    const { question } = useAppSelector((state) => state.alerts);
    const alertDispatch = useAppDispatch();
    const opacity = useRef(new Animated.Value(0)).current;
    const zoom = useRef(new Animated.Value(2)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const aminIn = useRef(new Animated.Value(0)).current;
    const AnimatedIcon = Animated.createAnimatedComponent(Icon);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const closeAlert = () => {
        opacity.setValue(0);
        zoom.setValue(2);
        fadeAnim.setValue(0);
        aminIn.setValue(0);
        setIsVisible(false);
        dispatch && dispatch();
    }
    const { iconColor, nameIcon } =
        type === 'info' ? { nameIcon: 'information-outline', iconColor: colors.Info }
            : type === 'warning' ? { nameIcon: 'alert-circle-outline', iconColor: colors.Warning }
                : type === 'success' ? { nameIcon: 'check-circle-outline', iconColor: colors.Success }
                    : type === 'error' ? { nameIcon: 'close-circle-outline', iconColor: colors.Error }
                        : type === 'question' ? { nameIcon: 'help-circle-outline', iconColor: colors.Question }
                            : { nameIcon: 'palette', iconColor: colors.Info };


    React.useEffect(() => {
        if (isVisible) {
            Animated.timing(aminIn, {
                toValue: 1,
                duration: 500,
                easing: Easing.bounce,
                useNativeDriver: true,
            }).start();
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.ease,
                    useNativeDriver: true
                }),
                Animated.timing(zoom, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.in(Easing.bounce),
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isVisible]);

    React.useEffect(() => {
        if (isVisible && timeClose) {
            const time = setTimeout(() => {
                closeAlert();
            }, timeClose);
            return () => {
                clearTimeout(time);
            }
        }
    }, [])


    return (
        // <Animated.View style={{ position: 'absolute', width: screenWidth, height: screenHeight, backgroundColor: 'rgba(0,0,0,0)', transform: [{ scale: aminIn }] }}>
        <Dialog
            style={{ backgroundColor: ThemeColors.background }}
            visible={isVisible}
            dismissable={dismissable}
            onDismiss={() => closeAlert()}
        >
            {
                icon && <Dialog.Icon icon={() =>
                    <AnimatedIcon
                        name={nameIcon}
                        color={iconColor}
                        size={vw * 17}
                        style={{ padding: 10, transform: [{ scale: zoom }], opacity }}
                    />
                } />
            }
            <Dialog.ScrollArea>
                <Animated.View style={{ opacity: fadeAnim }}>
                    {text && text.title && <Text style={{ textAlign: 'center', marginVertical: 4 }} variant='titleLarge'>{text.title}</Text>}
                    {text && text.subtitle && <Text style={{ textAlign: 'center', marginVertical: 4 }} variant='titleMedium'>{text.subtitle}</Text>}
                    {text && text.msg && <Text style={{ textAlign: 'center', marginVertical: 4 }} variant='titleSmall'>{text.msg}</Text>}
                </Animated.View>
                {
                    type === 'theme' &&
                    <Animated.View style={{ marginVertical: 20, transform: [{ scale: aminIn }] }}>
                        <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', padding: 10 }}>
                            {
                                Object.entries(ThemeColors).map((C, idx) => <Text key={`${idx}`}> <Icon size={15} name='checkbox-blank-circle' color={`${C[1]}`} />{C[0]} </Text>)
                            }
                        </View>
                        <SegmentedButtons
                            style={{ alignSelf: 'center' }}
                            value={dark ? 'dark' : 'white'}
                            onValueChange={() => { }}
                            buttons={[
                                {
                                    value: 'white',
                                    label: 'claro',
                                    icon: 'weather-sunny',
                                    onPress: () => alertDispatch(updateTheme(CombinedLightTheme))
                                },
                                {
                                    value: 'dark',
                                    label: 'oscuro',
                                    icon: 'weather-night',
                                    onPress: () => alertDispatch(updateTheme(CombinedDarkTheme))
                                }
                            ]}
                        />
                    </Animated.View>
                }
            </Dialog.ScrollArea>
            <Dialog.Actions style={{ display: 'flex', justifyContent: 'center' }}>
                {
                    type === 'question'
                        ?
                        <>
                            <Button
                                style={styles.btnSeparate}
                                contentStyle={[styles.btnConfirm]}
                                labelStyle={{ textTransform: 'uppercase' }}
                                mode='contained-tonal'
                                onPress={() => alertDispatch(updateQuestion({ ...question, confirm: true }))}
                            >{textConfirm ?? 'si'}</Button>
                            <Button
                                style={styles.btnSeparate}
                                contentStyle={{}}
                                labelStyle={{ textTransform: 'uppercase' }}
                                mode='contained-tonal'
                                onPress={() => closeAlert()}
                            >{textCancel ?? 'no'}</Button>
                        </>
                        :
                        <Button
                            labelStyle={{ textTransform: 'uppercase' }}
                            mode='contained-tonal'
                            onPress={() => closeAlert()}
                        >Aceptar</Button>
                }
            </Dialog.Actions>
        </Dialog >
        // </Animated.View>
    )
}
const styles = StyleSheet.create({
    btnSeparate: {
        marginHorizontal: 5
    },
    btnConfirm: {
        backgroundColor: LightenDarkenColor(colors.Success, -20)
    }
});