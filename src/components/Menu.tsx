import Color from 'color';
import { toPairs } from 'lodash';
import React, { useState, useRef, useCallback } from 'react';
import { LayoutRectangle, Modal, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector } from '../app/hooks';

interface option {
    label: string,
    onPress: () => void;
}

interface Props {
    options: Array<option>
}

export const Menu = (props: Props) => {
    const { theme: { colors, roundness } } = useAppSelector(state => state.app);
    const [open, setOpen] = useState<boolean>(false);
    const [positionActivator, setPositionActivator] = useState<LayoutRectangle>();
    const activator = useRef<TouchableHighlight>(null);


    const _renderOptions = useCallback(() => {
        if (positionActivator) {
            const { width, height, x, y } = positionActivator;
            return (
                <View style={[styles.modal, { right: 20, top: y, borderRadius: roundness * 3 }]}>
                    {
                        props.options.map((o, idx) => {
                            return (
                                <Text key={o.label + idx} onPress={o.onPress}>{o.label}</Text>
                            )
                        })
                    }
                </View>
            )
        }
        return undefined;
    }, [positionActivator]);

    return (
        <>
            <TouchableHighlight
                ref={activator}
                underlayColor={Color(colors.primaryContainer).toString()}
                style={{ padding: 5, borderRadius: 100 }}
                onPress={() => setOpen(true)}
                onLayout={layout => setPositionActivator(layout.nativeEvent.layout)}
            >
                <Icon color={colors.primary} size={25} name='dots-vertical' />
            </TouchableHighlight>
            <Modal visible={open} transparent animationType='fade'>
                <SafeAreaView style={{ backgroundColor: colors.backdrop }} />
                <View style={[styles.containerModal, { backgroundColor: colors.backdrop }]}>
                    <Pressable style={{ width: '100%', height: '100%' }} onPress={() => setOpen(false)} />
                    {_renderOptions()}
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    containerModal: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        position: 'absolute',
        padding: 15
    }
});