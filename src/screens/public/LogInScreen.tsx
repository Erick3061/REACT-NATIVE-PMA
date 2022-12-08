import React, { useEffect, useRef } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, View, TextInput as NativeTextInput } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '../../components/Input';
import { StackScreenProps } from "@react-navigation/stack";
import { rootPublicScreen } from '../../navigation/PublicScreens';
import { screenHeight, screenWidth, vh } from '../../config/Dimensions';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateTcyAp, updateInfo } from "../../features/alertSlice";
import { Button, Text } from 'react-native-paper';
import { Loading } from '../../components/Loading';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckAuth, LogIn } from '../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../../features/appSlice';
import { User } from '../../interfaces/interfaces';
import Toast from 'react-native-toast-message';
import { SocialNetworks } from '../../components/SocialNetworks';

type InputsLogIn = {
    email: string,
    password: string,
}

interface Props extends StackScreenProps<rootPublicScreen, 'LogInScreen'> { };
export const LogInScreen = ({ navigation }: Props) => {
    const { theme: { dark: isDark, colors } } = useAppSelector(store => store.app);
    const { showTC } = useAppSelector(state => state.alerts.tcyap);
    const dispatch = useAppDispatch();
    const { control, handleSubmit, reset, setValue, formState } = useForm<InputsLogIn>({ defaultValues: { email: '', password: '' } });

    const { isLoading, mutate, data } = useMutation(['LogIn'], LogIn, {
        retry: 0,
        onError: async err => {
            Toast.show({ text1: 'Error', text2: String(err), type: 'error' });
        },
        onSuccess: async data => {
            if (data.termsAndConditions) {
                setLogIn(data);
            } else {
                dispatch(updateTcyAp({ open: true, showTC: { dismissable: false } }))
            }
        },
    });

    const { refetch } = useQuery(['Terms'], () => CheckAuth(data?.token), {
        retry: 0,
        enabled: false,
        onError: async err => {
            Toast.show({ text1: 'Error', text2: String(err), type: 'error' });
        },
        onSuccess: async data => {
            setLogIn(data);
        },
    })

    const setLogIn = async (data: User) => {
        try {
            await AsyncStorage.setItem('token', data.token);
            dispatch(setUser(data));
        } catch (error) { Toast.show({ text1: 'Error', text2: String(error), type: 'error' }); }
    };

    const onSubmit: SubmitHandler<InputsLogIn> = async (data) => {
        mutate(data);
    };

    const nextInput = useRef<NativeTextInput>(null);

    useEffect(() => {
        setValue('email', 'holder_1@pem-sa.com');
        setValue('password', '123456');
    }, [])

    useEffect(() => {
        if (showTC?.confirm) refetch();
    }, [showTC]);



    return (
        <ScrollView style={{ height: screenHeight, width: screenWidth }}>
            {isLoading && <Loading />}
            <View style={{ paddingHorizontal: 30, alignItems: 'center' }}>
                <Text variant='titleLarge' style={[styles.title, { color: colors.primary }]}>PEMSA monitoreo APP</Text>
                <Image
                    source={require('../../assets/logo.png')}
                    style={[styles.img, isDark ? { ...styles.imgDark, backgroundColor: colors.outline } : {}]}
                />
                <KeyboardAvoidingView style={styles.ContainerViewInputs}>

                    <Input
                        formInputs={control._defaultValues}
                        control={control}
                        name={'email'}
                        renderLefttIcon='account'
                        mode='outlined'
                        placeholder='ejemplo@correo.com o usuario'
                        keyboardType='email-address'
                        rules={{ required: { value: true, message: 'Campo requerido' } }}
                        label='correo'
                        returnKeyType='next'
                        onSubmitEditing={() => {
                            nextInput.current?.focus();
                        }}
                    />
                    <Input
                        refp={nextInput}
                        formInputs={control._defaultValues}
                        control={control}
                        name={'password'}
                        renderLefttIcon='lock'
                        mode='outlined'
                        keyboardType='default'
                        placeholder='**********'
                        rules={{ required: { value: true, message: 'Campo requerido' } }}
                        isPassword
                        label='contraseña'
                        onSubmitEditing={handleSubmit(onSubmit)}
                        returnKeyType='done'
                    />
                </KeyboardAvoidingView>
                <View style={styles.ContainerBtns}>
                    <Button
                        style={styles.Btns}
                        icon={'login'}
                        mode='elevated'
                        loading={isLoading}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        labelStyle={{ textTransform: 'uppercase' }}
                    > Iniciar Sesión </Button>
                    <Button
                        style={styles.Btns}
                        icon={'lock-question'}
                        mode='elevated'
                        loading={isLoading}
                        onPress={() => dispatch(updateInfo({ open: true, icon: true, msg: 'Contacta a tu titular para recuperar tu contraseña' }))}
                        disabled={isLoading}
                    > Olvidé mi contraseña </Button>
                </View>
            </View>
            <SocialNetworks />
            <Text onPress={() => dispatch(updateTcyAp({ open: true }))} variant='bodyMedium' style={[styles.terms, { color: colors.primary }]}>Términos y condiciones y aviso de privacidad</Text>
            <Text variant='bodyMedium' style={[styles.version, { color: colors.primary }]}>Versión: {'222'}</Text>
        </ScrollView>
    )
}

export const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        paddingTop: 10
    },
    img: {
        width: '100%',
        height: vh * 35,
        resizeMode: 'contain',
    },
    imgDark: {
        width: '80%',
        height: vh * 40,
        resizeMode: 'contain',
        borderRadius: 10,
    },
    ContainerViewInputs: {
        width: '100%',
        paddingVertical: 20,
    },
    ContainerBtns: {
        paddingVertical: 10,
    },
    Btns: {
        marginVertical: 5,
    },
    terms: {
        fontWeight: '700',
        marginVertical: 20,
        textAlign: 'center'
    },
    version: {
        fontWeight: '700',
        textAlign: 'center',
        paddingBottom: 15
    }
});
