import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Image, KeyboardAvoidingView, ScrollView, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { Input } from '../../components/Input'
import { screenHeight, screenWidth } from '../../config/Dimensions'
import { styles } from './LogInScreen'

export const ForgetPasswordScreen = () => {
    const { control, handleSubmit, reset, setValue } = useForm<{ email: string }>({ defaultValues: { email: '' } });
    const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
        console.log(data);
    };


    return (
        <ScrollView style={{ height: screenHeight, width: screenWidth }}>
            <View style={{ height: screenHeight, width: screenWidth, paddingHorizontal: 30, alignItems: 'center' }}>
                <Text variant='headlineMedium' style={styles.title}>PEMSA monitoreo APP</Text>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.img}
                />
                <KeyboardAvoidingView style={styles.ContainerViewInputs}>
                    {/* <Input
                        
                        formInputs={control._defaultValues}
                        control={control}
                        name={'email'}
                        icon='account'
                        placeholder='ejemplo@correo.com o usuario'
                        rules={{ required: { value: true, message: 'Campo requerido' } }}
                        label='correo'

                    /> */}
                </KeyboardAvoidingView>
                <View style={styles.ContainerBtns}>
                    <Button
                        style={styles.Btns}
                        icon='email-send'
                        mode='contained'
                        loading={false}
                        onPress={handleSubmit(onSubmit)}
                        disabled={false}
                        labelStyle={{ textTransform: 'uppercase' }}
                    > Recuperar </Button>
                </View>
            </View>
        </ScrollView>
    )
}
