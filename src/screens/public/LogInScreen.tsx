import React, { useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, View, TextInput as NativeTextInput } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '../../components/Input';
import { StackScreenProps } from "@react-navigation/stack";
import { rootPublicScreen } from '../../navigation/PublicScreens';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Loading } from '../../components/Loading';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckAuth, LogIn } from '../../api/Api';
import { setUser } from '../../features/appSlice';
import Toast from 'react-native-toast-message';
import { SocialNetworks } from '../../components/SocialNetworks';
import { ModalTCAP } from '../../components/ModalTCAP';
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert';
import Text from '../../components/Text';
import { OrientationLocker } from 'react-native-orientation-locker';

type InputsLogIn = {
    email: string,
    password: string,
}

interface Props extends StackScreenProps<rootPublicScreen, 'LogInScreen'> { };
export const LogInScreen = ({ navigation }: Props) => {
    const { theme: { dark: isDark, colors } } = useAppSelector(store => store.app);
    const [visible, setVisible] = useState<boolean>(false);
    const [isHelp, setIsHelp] = useState<boolean>(false);
    const [aceptTerms, setAceptTerms] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { control, handleSubmit, reset, setValue, formState } = useForm<InputsLogIn>({ defaultValues: { email: '', password: '' } });

    const { isLoading, mutate, data } = useMutation(['LogIn'], LogIn, {
        retry: 0,
        onError: async err => {
            Toast.show({ text1: 'Error', text2: String(err), type: 'error' });
        },
        onSuccess: async data => {
            if (data.termsAndConditions) dispatch(setUser(data));
            else setAceptTerms(true)
        },
    });

    const { refetch } = useQuery(['Terms'], () => CheckAuth({ terms: data?.token }), {
        retry: 0,
        enabled: false,
        onError: async err => {
            Toast.show({ text1: 'Error', text2: String(err), type: 'error' });
        },
        onSuccess: async data => { await dispatch(setUser(data)); }
    })


    const onSubmit: SubmitHandler<InputsLogIn> = async (data) => {
        mutate(data);
    };

    const nextInput = useRef<NativeTextInput>(null);

    useEffect(() => {
        setValue('email', 'admin@pem-sa.com');
        setValue('password', '1234');
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Loading loading={isLoading} />
            <OrientationLocker
                orientation='PORTRAIT'
            />
            <ScrollView>
                <View style={{ paddingHorizontal: 30, alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/logo4.png')}
                        style={[
                            styles.img,
                            isDark && { tintColor: colors.onSurface },
                            {
                                height: 200,
                                width: 200
                            }
                        ]}
                    />
                    <Text variant='headlineSmall' style={[styles.title]}>PEMSA monitoreo APP</Text>
                    <KeyboardAvoidingView style={[
                        styles.ContainerViewInputs
                    ]}>
                        <Input
                            formInputs={control._defaultValues}
                            control={control}
                            name={'email'}
                            iconLeft='account'
                            placeholder='ejemplo@correo.com'
                            keyboardType='email-address'
                            rules={{ required: { value: true, message: 'Campo requerido' } }}
                            label='Correo'
                            returnKeyType='next'
                            onSubmitEditing={() => {
                                nextInput.current?.focus();
                            }}
                        />
                        <Input
                            onRef={(nextInput) => { nextInput = nextInput }}
                            formInputs={control._defaultValues}
                            control={control}
                            name={'password'}
                            iconLeft='lock'
                            keyboardType='default'
                            secureTextEntry
                            placeholder='**********'
                            rules={{ required: { value: true, message: 'Campo requerido' } }}
                            label='Contrase??a'
                            onSubmitEditing={handleSubmit(onSubmit)}
                            returnKeyType='done'
                        />
                        <Text variant='titleMedium' onPress={() => setIsHelp(true)} style={[{ fontWeight: '600', textAlign: 'right', marginVertical: 10 }]}>Olvid?? mi contrase??a</Text>
                    </KeyboardAvoidingView>
                    <View style={styles.ContainerBtns}>
                        <Button
                            text='Iniciar Sesi??n'
                            mode='contained'
                            onPress={handleSubmit(onSubmit)}
                            loading={isLoading}
                            disabled={isLoading}
                            labelStyle={{ paddingVertical: 5, paddingHorizontal: 20 }}
                        />
                    </View>
                </View>
                <SocialNetworks />
                <Text variant='titleSmall' onPress={() => setVisible(true)} style={[styles.terms]}>T??rminos y condiciones y aviso de privacidad</Text>
                <Text variant='titleSmall' style={[styles.version]}>Versi??n: {'2.4.1'}</Text>
            </ScrollView>
            <Alert visible={isHelp} type='info' icon subtitle='Contacta a tu titular para recuperar tu contrase??a' dismissable renderCancel onCancel={(cancel: boolean) => { setIsHelp(!cancel) }} />
            <ModalTCAP visible={visible} setVisible={setVisible} />
            <ModalTCAP visible={aceptTerms} setVisible={setAceptTerms} dismissable accept={{ cancel: () => setAceptTerms(false), confirm: () => { setAceptTerms(false); refetch() }, textCancel: 'cancelar', textConfirm: 'aceptar' }} />
        </View>
    )
}

export const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        paddingTop: 10
    },
    img: {
        width: '100%',
        resizeMode: 'contain',
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
