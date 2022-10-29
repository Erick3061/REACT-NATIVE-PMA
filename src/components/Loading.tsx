import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { vw } from '../config/Dimensions';
export const Loading = () => {
    const { colors, fonts, roundness } = useAppSelector(state => state.app.theme);
    return (
        <Modal visible transparent animationType='slide' hardwareAccelerated>
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: colors.background, borderRadius: roundness * 2, width: vw * 40, height: vw * 40, shadowColor: colors.primary }]}>
                    <ActivityIndicator color={colors.primary} size={'large'} />
                    <Text style={[{ color: colors.primary }, fonts.bodyLarge]} >Cargando...</Text>
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