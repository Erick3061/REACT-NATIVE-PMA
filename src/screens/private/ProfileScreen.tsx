import React, { useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Text, View, TextInput as NativeTextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { Input } from '../../components/Input';
import { useEffect } from 'react';
import Toast, { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';
import { vw } from '../../config/Dimensions';
import { useAppSelector } from '../../app/hooks';


type ChagePassword = {
    password: string;
    newPassword: string;
    confirmPAssword: string;
}

export const ProfileScreen = () => {
    const { control, handleSubmit, reset, setValue, formState } = useForm<ChagePassword>({ defaultValues: { password: '', confirmPAssword: '', newPassword: '' } });

    const newPass = useRef<NativeTextInput>(null);
    const confPass = useRef<NativeTextInput>(null);

    const onSubmit: SubmitHandler<ChagePassword> = async (data) => {
        console.log(data);
        Toast.show({
            type: 'success',
            text1: 'Correcto',
            text2: 'Contaseña cambiada'
        })
    };

    useEffect(() => {
        setValue('password', '11');
        setValue('newPassword', '11');
        setValue('confirmPAssword', '11');
        // Toast.show({
        //     type: 'info',
        //     text1: 'Hello',
        //     text2: 'This is some something 👋'
        // });
    }, []);


    return (
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: vw * 7 }}>
            <KeyboardAvoidingView>
                <Input
                    formInputs={control._defaultValues}
                    control={control}
                    name={'password'}
                    renderLefttIcon='lock'
                    keyboardType='default'
                    placeholder='**********'
                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                    isPassword
                    mode='outlined'
                    label='Contraseña'
                    onSubmitEditing={() => newPass.current?.focus()}
                    returnKeyType='next'
                />

                <Input
                    refp={newPass}
                    formInputs={control._defaultValues}
                    control={control}
                    name={'newPassword'}
                    renderLefttIcon='lock'
                    keyboardType='default'
                    placeholder='**********'
                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                    isPassword
                    mode='outlined'
                    label='Contraseña nueva'
                    onSubmitEditing={() => confPass.current?.focus()}
                    returnKeyType='next'
                />

                <Input
                    refp={confPass}
                    formInputs={control._defaultValues}
                    control={control}
                    name={'confirmPAssword'}
                    renderLefttIcon='lock'
                    keyboardType='default'
                    placeholder='**********'
                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                    isPassword
                    mode='outlined'
                    label='Confirma tu contraseña'
                    onSubmitEditing={handleSubmit(onSubmit)}
                    returnKeyType='done'
                />

                <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                    <Button
                        style={{}}
                        icon={'login'}
                        mode='contained'
                        loading={false}
                        onPress={handleSubmit(onSubmit)}
                        disabled={false}
                        labelStyle={{ textTransform: 'uppercase' }}
                    > Iniciar Sesión </Button>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}
