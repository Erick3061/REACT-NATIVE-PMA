import React, { useContext } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../app/hooks';
import { SocialNetworks } from '../../components/SocialNetworks';
import Text from '../../components/Text';
import { HandleContext } from '../../context/HandleContext';
import { Orientation } from '../../interfaces/interfaces';

//https://arxiv.org/pdf/2111.09296.pdf

export const HomeScreen = () => {
    const { theme: { fonts, colors, dark } } = useAppSelector(state => state.app);
    const { orientation } = useContext(HandleContext);
    return (
        <View style={[
            { flex: 1 },
            orientation === Orientation.landscape && {
                flexDirection: 'row'
            }
        ]}>
            <View style={[
                { flex: 1, justifyContent: 'flex-end' },
                orientation === Orientation.landscape && {
                    justifyContent: 'center'
                }
            ]}>
                <Image
                    style={{ resizeMode: 'contain', height: '50%', width: '100%' }}
                    source={require('../../assets/logo2.png')}
                />
            </View>
            <View style={[
                { flex: 1, justifyContent: 'center', alignItems: 'center' }
            ]}>
                <SocialNetworks />
                <Text variant='titleLarge' style={[styles.text, { fontWeight: 'bold' }]}>central monitoreo 24hrs</Text>
                <Text variant='titleMedium' style={[styles.text, { fontWeight: 'bold' }]}>222 141 12 30</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        textTransform: 'uppercase',
        paddingVertical: 15,
    }
});