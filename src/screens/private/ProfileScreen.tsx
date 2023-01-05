import React, { useContext, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, View, TextInput as NativeTextInput } from 'react-native';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { HandleContext } from '../../context/HandleContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';


type ChagePassword = {
    password: string;
    newPassword: string;
    confirmPAssword: string;
}

export const ProfileScreen = () => {
    const { control, handleSubmit, reset, setValue, formState } = useForm<ChagePassword>({ defaultValues: { password: '', confirmPAssword: '', newPassword: '' } });
    // const { vw } = useContext(HandleContext);
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
    }, []);


    return (
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
            <KeyboardAvoidingView>
                <Input
                    formInputs={control._defaultValues}
                    control={control}
                    iconLeft='lock'
                    name={'password'}
                    keyboardType='default'
                    placeholder='**********'
                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                    secureTextEntry
                    label='Contraseña'
                    onSubmitEditing={() => newPass.current?.focus()}
                    returnKeyType='next'
                />

                <Input
                    onRef={newPass => newPass = newPass}
                    formInputs={control._defaultValues}
                    control={control}
                    name={'newPassword'}
                    iconLeft='lock'
                    keyboardType='default'
                    placeholder='**********'
                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                    secureTextEntry
                    label='Contraseña nueva'
                    onSubmitEditing={() => confPass.current?.focus()}
                    returnKeyType='next'
                />

                <Input
                    onRef={confPass => confPass = confPass}
                    formInputs={control._defaultValues}
                    control={control}
                    name={'confirmPAssword'}
                    iconLeft='lock'
                    keyboardType='default'
                    placeholder='**********'
                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                    secureTextEntry
                    label='Confirma tu contraseña'
                    onSubmitEditing={handleSubmit(onSubmit)}
                    returnKeyType='done'
                />

                <View style={{ alignItems: 'flex-end', paddingVertical: 15 }}>
                    <Button
                        text='Cambiar contraseña'
                        icon={'swap-horizontal'}
                        mode='contained'
                        loading={false}
                        onPress={handleSubmit(onSubmit)}
                        disabled={false}
                        labelStyle={{ textTransform: 'uppercase' }}
                        contentStyle={{ paddingVertical: 5 }}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}
