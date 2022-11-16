import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, StyleProp, TextStyle, Pressable, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Button, Switch, Text, TouchableRipple } from 'react-native-paper';
import { vh, vw, screenHeight } from '../../config/Dimensions';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { StackScreenProps } from '@react-navigation/stack';
import { rootPublicScreen } from '../../navigation/PublicScreens';
import { ScrollView } from 'react-native-gesture-handler';
import { updateError, updateQuestion } from '../../features/alertSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import { baseUrl } from '../../api/Api';

type PagerViewOnPageScrollEventData = { position: number; offset: number; }

interface Props extends StackScreenProps<rootPublicScreen, 'IntroductionScreen'> { };

type data = Array<{
    title: string;
    description: Array<{
        text: string;
        style?: StyleProp<TextStyle>
    }>
    key: string;
}>

const data: data = [
    {
        title: 'BIENVENIDO',
        description:
            [
                { text: 'Ahora nos acercamos a usted para brindale el acceso de informacón de su sistema de alarma', style: { paddingTop: 10, } }
            ],
        key: 'first',
    },
    {
        title: '¿Para qué sirve la aplicación?',
        description:
            [
                { text: 'Podrá realizar consultas de los eventos recibidos en la central de monitoreo', style: { paddingVertical: 5 } },
                { text: 'Descargar en formato PDF las consultas realizadas', style: { paddingVertical: 5 } }
            ],
        key: 'second',
    },
    {
        title: '¿Como acceder a la aplicación?',
        description:
            [
                { text: '1: Seleccionar el botón de registro', style: { paddingTop: 10 } },
                { text: '2: Llenar los campos solicitados' },
                { text: '3: Aceptar los términos y condiciones y aviso de privacidad' },
                { text: '4: Seleccionar el botón de registrar' },
                { text: '' },
                { text: 'Cualquier duda o problema tecnico spbre su sistema de alarma que se presente, podrá cominicarse con nosotros y lo atenderemos con gusto' },
                { text: '' },
                { text: 'Correo electronico:', style: { textAlign: 'center' } },
                { text: 'correo@pem-sa.com', style: { textAlign: 'center' } },
                { text: 'Número telefónico', style: { textAlign: 'center' } },
                { text: '222 141 12 30', style: { textAlign: 'center' } },

            ],
        key: 'third',
    },
];

const DOT_SIZE = 15;

const Item = ({ title, description, scrollOffsetAnimatedValue }: {
    description: Array<{ text: string; style?: StyleProp<TextStyle> }>;
    title: string;
    scrollOffsetAnimatedValue: Animated.Value;
    positionAnimatedValue: Animated.Value;
}) => {
    const inputRange = [0, 0.5, 0.99];
    const inputRangeOpacity = [0, 0.5, 0.99];
    const scale = scrollOffsetAnimatedValue.interpolate({ inputRange, outputRange: [1, 0, 1], });
    const opacity = scrollOffsetAnimatedValue.interpolate({ inputRange: inputRangeOpacity, outputRange: [1, 0, 1], });
    const { colors } = useAppSelector(state => state.app.theme);
    return (
        <Animated.View style={{ flex: 1, paddingHorizontal: 15, alignItems: 'center', transform: [{ scale }], opacity }} >
            <Image
                source={require('../../assets/logo2.png')}
                style={[styles.imageStyle]}
            />
            <View>
                <View >
                    <Text variant='headlineSmall' style={{ ...styles.heading, color: colors.primary }}>{title}</Text>
                </View>
                <Animated.View style={[{ opacity, flexDirection: 'column' }]}>
                    {
                        description.map((el, key) =>
                            <Text key={key} variant='bodyMedium' style={[el.style ?? styles.description, { color: colors.primary }]}>
                                {el.text}
                            </Text>
                        )
                    }
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const Dots = ({ positionAnimatedValue, scrollOffsetAnimatedValue }: { scrollOffsetAnimatedValue: Animated.Value; positionAnimatedValue: Animated.Value; }) => {
    const inputRange = [0, data.length];
    const margin: number = 2;
    const { theme: { colors } } = useAppSelector(state => state.app)
    const translateX = Animated.add(scrollOffsetAnimatedValue, positionAnimatedValue).interpolate({
        inputRange,
        outputRange: [0, data.length * (DOT_SIZE + (margin * 2))]
    });


    return (
        <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row' }} >
                <Animated.View
                    style={[
                        styles.paginationDot, { margin, backgroundColor: colors.primary, zIndex: 1 },
                        {
                            position: 'absolute',
                            transform: [{ translateX: translateX }],
                        },
                    ]}
                />
                {data.map((item) => {
                    return (
                        <Animated.View key={item.key} style={[styles.paginationDot, { margin, borderWidth: 1, borderColor: 'lightgrey' }]} />
                    );
                })}
            </View>
        </View>
    )
}

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export const IntroductionScreen = ({ navigation }: Props) => {
    const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
    const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
    const [page, setPage] = useState<number>(0);
    const [showPages, setShowPages] = useState<boolean>(false);
    const { colors } = useAppSelector(state => state.app.theme);
    const confirm = useAppSelector(state => state.alerts.question.confirm);
    const Pager = useRef<PagerView>(null);
    const dispatch = useAppDispatch();
    const wellcome = async () => {
        try {
            await AsyncStorage.setItem('isWellcomeOff', 'true');
            dispatch(updateQuestion({ open: false, confirm: undefined, msg: '', dismissable: true, icon: true }));
            navigation.replace('LogInScreen');
        } catch (error) { dispatch(updateError({ open: true, msg: `${error}` })) }
    }
    useEffect(() => {
        if (confirm !== undefined) {
            wellcome();
        }
    }, [confirm])

    useEffect(() => {
        navigation.reset
    }, [])


    return (
        <View style={[styles.container]}>
            <AnimatedPagerView
                initialPage={positionAnimatedValue}
                style={{ flex: 1 }}
                ref={Pager}
                onPageScroll={Animated.event<PagerViewOnPageScrollEventData>(
                    [{ nativeEvent: { offset: scrollOffsetAnimatedValue, position: positionAnimatedValue } }],
                    {
                        listener: ({ nativeEvent: { position, offset } }) => {
                            setPage(() => position)
                        }, useNativeDriver: true,
                    }
                )}
            >
                {data.map((item, key) => (
                    <ScrollView key={key}>
                        <View collapsable={false} key={item.title}>
                            <Item {...item} scrollOffsetAnimatedValue={scrollOffsetAnimatedValue} positionAnimatedValue={positionAnimatedValue} />
                        </View>
                    </ScrollView>
                ))}
            </AnimatedPagerView>
            <Dots positionAnimatedValue={positionAnimatedValue} scrollOffsetAnimatedValue={scrollOffsetAnimatedValue} />
            <View style={{ paddingHorizontal: 15 }}>
                {(page === data.length - 1) &&
                    <TouchableRipple onPress={() => setShowPages(!showPages)}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, padding: 5 }}>
                            <Text style={{ textTransform: 'uppercase', color: colors.primary }}>omitir bienvenida</Text>
                            <Switch value={showPages} onValueChange={() => setShowPages(!showPages)} />
                        </View>
                    </TouchableRipple>}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                    <Button
                        mode='elevated'
                        labelStyle={{ textTransform: 'uppercase' }}
                        style={styles.btns}
                        onPress={() => {
                            if (page === data.length - 1) {
                                if (showPages) { dispatch(updateQuestion({ open: true, msg: '¿Estas seguro de omitir la BIENVENIDA ?', dismissable: false, icon: true })); }
                                else {
                                    navigation.replace('LogInScreen');
                                }
                            }
                            Pager.current?.setPage(page + 1)
                        }}
                    >{(page === data.length - 1) ? 'ir a inicio' : 'siguiente'}</Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bootom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btns: {
        marginHorizontal: 5,
    },
    checkboxContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageStyle: {
        // width: vw * 50,.
        height: vh * 20,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    heading: {
        textTransform: 'uppercase',
        fontWeight: '700',
        textAlign: 'center'
    },
    description: {
        textAlign: 'justify',
    },
    pagination: {
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationDot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
    },
});