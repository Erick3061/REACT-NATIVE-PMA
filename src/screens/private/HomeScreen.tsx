import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../app/hooks';
import { SocialNetworks } from '../../components/SocialNetworks';
import { OrientationContext } from '../../context/OrientationContext';

export const HomeScreen = () => {
    const { theme: { fonts, colors, dark } } = useAppSelector(state => state.app);
    const { vh } = useContext(OrientationContext);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
                style={[dark && { backgroundColor: colors.outline, borderRadius: 10 }, { height: vh * 20, width: '90%', resizeMode: 'contain' }]}
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