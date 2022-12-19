import React, { useContext, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { OrientationContext } from '../../context/OrientationContext';
import { useAppSelector } from '../../app/hooks';
import { ModalTCAP } from '../../components/ModalTCAP';

export const DetailsInfoScreen = () => {
    const { vh } = useContext(OrientationContext);
    const { theme: { colors, fonts } } = useAppSelector(state => state.app);
    const [visible, setVisible] = useState<boolean>(false)
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
                <Text style={[fonts.titleSmall, { color: colors.text, paddingVertical: 10, textAlign: 'center' }]}>Versión: 2928</Text>
                <Text style={[fonts.titleSmall, { color: colors.text, paddingVertical: 10, }]}>© 2021-2032 Protección Electrónica Monterrey S.A. de C.V</Text>
                <Text style={[fonts.titleSmall, { color: colors.text, paddingVertical: 10, }]}>® Protección Electrónica Monterrey S.A. de C.V</Text>
                <Text
                    style={[fonts.titleMedium, { color: colors.text, paddingVertical: 20, textAlign: 'center', fontWeight: 'bold' }]}
                    onPress={() => setVisible(true)}
                >Términos y condiciones y aviso de privacidad</Text>
            </View>
            <ModalTCAP visible={visible} setVisible={setVisible} />
        </View>
    )
}
