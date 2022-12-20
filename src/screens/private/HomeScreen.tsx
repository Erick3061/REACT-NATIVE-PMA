import React, { useContext } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../app/hooks';
import { SocialNetworks } from '../../components/SocialNetworks';
import Text from '../../components/Text';
import { OrientationContext } from '../../context/OrientationContext';

export const HomeScreen = () => {
    const { theme: { fonts, colors, dark } } = useAppSelector(state => state.app);
    const { vh } = useContext(OrientationContext);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
                style={[dark && { backgroundColor: colors.outline, borderRadius: 10 }, { height: vh * 20, width: '90%', resizeMode: 'contain', marginVertical: 15 }]}
                source={require('../../assets/logo2.png')}
            />
            <SocialNetworks />
            <Text variant='titleLarge' style={[styles.text, { fontWeight: 'bold' }]}>central monitoreo 24hrs</Text>
            <Text variant='titleMedium' style={[styles.text, { fontWeight: 'bold' }]}>222 141 12 30</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        textTransform: 'uppercase',
        paddingVertical: 15,
    }
});