import Color from 'color';
import React, { useContext } from 'react';
import { ActivityIndicator, Modal, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { OrientationContext } from '../context/OrientationContext';
export const Loading = () => {
    const { colors, fonts, roundness, dark } = useAppSelector(state => state.app.theme);
    const { vw } = useContext(OrientationContext);
    return (
        <Modal visible transparent animationType='slide' hardwareAccelerated>
            <StatusBar backgroundColor={colors.backdrop} />
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background, borderRadius: roundness * 3, width: vw * 50, height: vw * 50, shadowColor: colors.primary }]}>
                    <ActivityIndicator color={colors.primary} size={vw * 5} />
                    <Text style={[{ color: colors.primary }, fonts.bodyMedium]} >Cargando...</Text>
                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        padding: 35,
        alignItems: "center",
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
});