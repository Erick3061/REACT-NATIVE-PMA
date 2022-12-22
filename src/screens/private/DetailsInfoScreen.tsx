import React, { useContext, useState } from 'react'
import { Image, View } from 'react-native'
import { HandleContext } from '../../context/HandleContext';
import { useAppSelector } from '../../app/hooks';
import { ModalTCAP } from '../../components/ModalTCAP';
import Text from '../../components/Text';

export const DetailsInfoScreen = () => {
    const { vh } = useContext(HandleContext);
    const { theme: { colors, fonts, dark } } = useAppSelector(state => state.app);
    const [visible, setVisible] = useState<boolean>(false)
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Image
                style={[
                    {
                        width: '100%',
                        height: vh * 25,
                        resizeMode: 'contain'
                    },
                    dark && { tintColor: colors.onSurface }
                ]}
                source={require('../../assets/logo2.png')}
            />
            <View style={{ paddingHorizontal: 25 }}>
                <Text variant='titleSmall' style={[, { paddingVertical: 10, textAlign: 'center' }]}>Versión: 2928</Text>
                <Text variant='titleSmall' style={[, { paddingVertical: 10, }]}>© 2021-2032 Protección Electrónica Monterrey S.A. de C.V</Text>
                <Text variant='titleSmall' style={[, { paddingVertical: 10, }]}>® Protección Electrónica Monterrey S.A. de C.V</Text>
                <Text
                    style={[fonts.titleMedium, { paddingVertical: 20, textAlign: 'center', fontWeight: 'bold' }]}
                    onPress={() => setVisible(true)}
                >Términos y condiciones y aviso de privacidad</Text>
            </View>
            <ModalTCAP visible={visible} setVisible={setVisible} />
        </View>
    )
}
