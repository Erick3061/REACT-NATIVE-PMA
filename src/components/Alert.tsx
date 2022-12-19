import React, { useCallback, useContext, useRef, useState } from 'react';
import { Animated, Easing, Modal, StatusBar, StyleSheet, View, Pressable, Text, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Button } from './Button';
import { stylesApp } from '../App';
import Color from 'color';
import { OrientationContext } from '../context/OrientationContext';

interface Props {
    type: 'info' | 'error' | 'question' | 'warning' | 'success' | 'theme';
    icon?: boolean;
    title?: string,
    subtitle?: string,
    msg?: string
    visible: boolean;
    dismissable?: boolean;
    func?: () => void;
    timeClose?: number;
    questionProps?: {
        textConfirm: string;
        textCancel: string;
        funcConfirm: () => void;
        funcCancel: () => void;
    }
    textCancel?: string;
    onCancel?: (cancel: boolean) => void;
    renderCancel?: boolean
}

export const Alert = ({ icon, visible, dismissable, type, timeClose, func, questionProps, msg, subtitle, title, renderCancel, textCancel, onCancel }: Props) => {

    const { theme: { colors, dark, fonts, roundness } } = useAppSelector((state) => state.app);
    const { vw, vh } = useContext(OrientationContext);
    const alertDispatch = useAppDispatch();
    const opacity = useRef(new Animated.Value(0)).current;
    const zoom = useRef(new Animated.Value(2)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const aminIn = useRef(new Animated.Value(0)).current;
    const AnimatedIcon = Animated.createAnimatedComponent(Icon);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const minWidth: number = vw * 70;
    const minHeight: number = vh * 25;

    const closeAlert = () => {
        opacity.setValue(0);
        zoom.setValue(2);
        fadeAnim.setValue(0);
        aminIn.setValue(0);
        onCancel && onCancel(true);
        setIsVisible(false);
    }
    const { iconColor, nameIcon } =
        type === 'info' ? { nameIcon: 'information-outline', iconColor: colors.Info }
            : type === 'warning' ? { nameIcon: 'alert-circle-outline', iconColor: colors.Warning }
                : type === 'success' ? { nameIcon: 'check-circle-outline', iconColor: colors.Success }
                    : type === 'error' ? { nameIcon: 'close-circle-outline', iconColor: colors.error }
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
                onCancel && onCancel(true);
            }, timeClose);
            return () => {
                clearTimeout(time);
            }
        }
    }, []);

    React.useEffect(() => {
        setIsVisible(visible)
    }, [visible])


    const _renderIcon = useCallback(() => {
        if (icon) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <AnimatedIcon
                        name={nameIcon}
                        color={iconColor}
                        size={vw * 13}
                        style={{ transform: [{ scale: zoom }], opacity }}
                    />
                </View>
            )
        }
        return undefined;
    }, [icon]);

    const _renderButtons = useCallback(() => {
        if (type === 'question' && questionProps) {
            const { funcCancel, funcConfirm, textCancel, textConfirm } = questionProps;
            return (
                <Animated.View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', transform: [{ scale: aminIn }] }}>
                    <Button
                        text={textCancel ?? 'no'}
                        mode='contained'
                        customButtonColor={colors.error}
                        colorTextPressed={colors.background}
                        onPress={() => {
                            closeAlert()
                            funcCancel()
                        }}
                    />
                    <Button
                        contentStyle={{ marginHorizontal: 5 }}
                        customButtonColor={colors.Success}
                        text={textConfirm ?? 'si'}
                        mode='text'
                        onPress={() => {
                            closeAlert()
                            funcConfirm()
                        }}
                    />
                </Animated.View>
            )
        }
        if (renderCancel) {
            return (
                <View style={{ alignItems: 'flex-end' }}>
                    <Button
                        text={textCancel ?? 'cerrar'}
                        mode='contained'
                        onPress={() => {
                            onCancel && onCancel(true)
                            closeAlert()
                        }}
                    />
                </View>
            )
        }
        return undefined;
    }, [type, questionProps, renderCancel, textCancel])

    return (
        <Modal visible={isVisible} transparent animationType='fade'>
            <StatusBar backgroundColor={colors.backdrop} />
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Pressable style={{ width: '100%', height: '100%', backgroundColor: Color(colors.backdrop).fade(.7).toString() }} onPress={() => {
                    if (dismissable) {
                        onCancel && onCancel(true);
                        setIsVisible(false)
                    }
                }} />
                <View style={[styles.modal, { backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background, borderRadius: roundness * 3, minHeight, minWidth, width: '90%' }]}>
                    {_renderIcon()}
                    <View style={{ justifyContent: 'center', flex: 1 }}>
                        <View>
                            <ScrollView>
                                <Animated.View style={{ opacity }}>
                                    {title && <Text style={[fonts.titleLarge, styles.title, { color: colors.text }]}>{title}</Text>}
                                    {subtitle && <Text style={[fonts.titleMedium, styles.title, { color: colors.text }]}>{subtitle}</Text>}
                                    {msg && <Text style={[fonts.titleSmall, styles.title, { color: colors.text }]}>{msg}</Text>}
                                </Animated.View>
                            </ScrollView>
                        </View>
                    </View>
                    {_renderButtons()}
                </View>
            </SafeAreaView>
        </Modal>
    )
}
export const styles = StyleSheet.create({
    btnSeparate: {
        marginHorizontal: 5
    },
    btnConfirm: {
        backgroundColor: 'steelblue'
    },
    modal: {
        position: 'absolute',
        padding: 20,
        ...stylesApp.shadow
    },
    title: {
        textAlign: 'center',
        marginVertical: 4
    }
});