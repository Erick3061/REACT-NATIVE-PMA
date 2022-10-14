import React from 'react'
import { Image, View } from 'react-native'
import { Text } from 'react-native-paper';
import { vh } from '../../config/Dimensions';
import { useAppDispatch } from '../../app/hooks';
import { updateTcyAp } from '../../features/alertSlice';

export const DetailsInfoScreen = () => {
    const dispatch = useAppDispatch();
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Image
                style={{
                    width: '100%',
                    height: vh * 25,
                    resizeMode: 'contain'
                }}
                source={require('../../assets/logo2.png')}
            />
            <View style={{ paddingHorizontal: 25 }}>
                <Text style={{ paddingVertical: 10, textAlign: 'center' }} variant='bodyLarge'>Versión: 2928</Text>
                <Text style={{ paddingVertical: 10, }} variant='bodyLarge'>© 2021-2032 Protección Electrónica Monterrey S.A. de C.V</Text>
                <Text style={{ paddingVertical: 10, }} variant='bodyLarge'>® Protección Electrónica Monterrey S.A. de C.V</Text>
                <Text
                    variant='titleMedium'
                    style={{ paddingVertical: 20, textAlign: 'center', fontWeight: 'bold' }}
                    onPress={() => dispatch(updateTcyAp({ open: true }))}
                >Términos y condiciones y aviso de privacidad</Text>
            </View>
        </View>
    )
}
