import React from 'react'
import { Linking, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useAppSelector } from '../app/hooks'

export const SocialNetworks = () => {
    const { theme: { colors } } = useAppSelector(state => state.app);
    return (
        <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', paddingVertical: 5, justifyContent: 'center' }}>
            <IconButton iconColor={colors.primary} icon='web' onPress={() => Linking.openURL('https://pem-sa.com')} />
            <IconButton iconColor={colors.primary} icon='facebook' onPress={() => Linking.openURL('fb://page/557351134421255')
                .catch(() => Linking.openURL('https://www.facebook.com/PEMSA-Protecci%C3%B3n-Electr%C3%B3nica-Monterrey-SA-de-CV-557351134421255')
                    .catch(() => {
                        // dispatch(updateError({ open: true, msg: 'Error al abrir el enlace' }))
                    })
                )} />
            <IconButton iconColor={colors.primary} icon='twitter' onPress={() => Linking.openURL('https://twitter.com/pemsa_85')} />
            <IconButton iconColor={colors.primary} icon='instagram' onPress={() => Linking.openURL('https://instagram.com/pemsa_85/')} />
        </View>
    )
}
