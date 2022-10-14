import React from 'react';
import { Image, Linking, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { vh, vw } from '../../config/Dimensions';
import { useAppDispatch } from '../../app/hooks';
import { updateError } from '../../features/alertSlice';

export const HomeScreen = () => {
    const dispatch = useAppDispatch();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
                style={{
                    width: '100%',
                    height: vh * 20,
                    resizeMode: 'contain'
                }}
                source={require('../../assets/logo2.png')}
            />
            <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', paddingVertical: 15 }}>
                <IconButton size={vw * 12} icon='web' onPress={() => Linking.openURL('https://pem-sa.com')} />
                <IconButton size={vw * 12} icon='facebook' onPress={() => Linking.openURL('fb://page/557351134421255').catch(() =>
                    Linking.openURL('https://www.facebook.com/PEMSA-Protecci%C3%B3n-Electr%C3%B3nica-Monterrey-SA-de-CV-557351134421255')
                        .catch(() => dispatch(updateError({ open: true, msg: 'Error al abrir el enlace' })))
                )} />
                <IconButton size={vw * 12} icon='twitter' onPress={() => Linking.openURL('https://twitter.com/pemsa_85')} />
                <IconButton size={vw * 12} icon='instagram' onPress={() => Linking.openURL('https://instagram.com/pemsa_85/')} />
                <IconButton size={vw * 12} icon='whatsapp' onPress={() => Linking.openURL('https://wa.me/5212225544667')} />
            </View>
            <Text style={{ textTransform: 'uppercase', fontWeight: 'bold', paddingVertical: 10 }} variant='titleLarge'>central monitoreo 24hrs</Text>
            <Text style={{ textTransform: 'uppercase', fontWeight: 'bold', paddingVertical: 10 }} variant='titleMedium'>222 141 12 30</Text>
        </View>
    )
}
