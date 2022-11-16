import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { vh } from '../../config/Dimensions';
import { useAppSelector } from '../../app/hooks';
import { SocialNetworks } from '../../components/SocialNetworks';

export const HomeScreen = () => {
    const { theme: { fonts, colors } } = useAppSelector(state => state.app);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
                style={{ height: vh * 20, resizeMode: 'contain' }}
                source={require('../../assets/logo2.png')}
            />
            <SocialNetworks />
            <Text style={[fonts.titleLarge, styles.text, { color: colors.text, fontWeight: 'bold' }]}>central monitoreo 24hrs</Text>
            <Text style={[fonts.titleMedium, styles.text, { color: colors.text, fontWeight: 'bold' }]}>222 141 12 30</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        textTransform: 'uppercase',
        paddingVertical: 10
    }
});