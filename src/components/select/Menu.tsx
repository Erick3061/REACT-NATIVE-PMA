import Color from 'color';
import { toPairs } from 'lodash';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { LayoutRectangle, Modal, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TouchableHighlight, View, Platform, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { stylesApp } from '../../App';
import { useAppSelector } from '../../app/hooks';
import { screenHeight } from '../../config/Dimensions';

interface option {
    label: string,
    icon?: string,
    onPress: () => void;
}

interface Props {
    options: Array<option>
}

export const _renderModalMenu = (props: Props &
{
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    positionActivator?: LayoutRectangle,
}) => {
    const { theme: { colors, roundness, dark } } = useAppSelector(state => state.app);
    const [area, setArea] = useState<LayoutRectangle>();
    const plus: number = 2;

    const _renderItems = () => {
        return props.options.map((o, idx) => {
            return (
                <TouchableHighlight
                    key={o.label + idx}
                    underlayColor={Color(colors.primaryContainer).toString()}
                    style={[styles.containerItemModal,
                    {
                        borderRadius: roundness * plus,
                        borderColor: Color(colors.primaryContainer).toString(),

                    }]}
                    onPress={() => {
                        props.setOpen(false);
                        o.onPress();
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Icon name={o.icon ?? 'home'} style={{ marginLeft: 5 }} size={30} color={colors.primary} />
                        <Text style={{ marginHorizontal: 5, color: colors.text }}>{o.label}</Text>
                    </View>
                </TouchableHighlight>
            )
        })
    }

    const _renderOptions = useCallback(() => {
        if (props.positionActivator && area) {
            return (
                Platform.OS === 'ios'
                    ?
                    <Animated.View style={[styles.modal, {
                        width: '100%',
                        bottom: screenHeight - (area.height + area.y * 2),
                        paddingBottom: area.y,
                        borderTopRightRadius: roundness * plus,
                        borderTopLeftRadius: roundness * plus,
                        ...stylesApp.shadow
                    }]}>
                        {_renderItems()}
                    </Animated.View>
                    :
                    <View style={[styles.modal, { right: 20, top: props.positionActivator.y, borderRadius: roundness * plus, ...stylesApp.shadow }]}>
                        {_renderItems()}
                    </View>
            )
        } else if (area) {
            return (
                <Animated.View style={[styles.modal, {
                    width: '100%',
                    bottom: screenHeight - (area.height + area.y * 2),
                    paddingBottom: area.y + 20,
                    borderTopRightRadius: roundness * plus,
                    borderTopLeftRadius: roundness * plus,
                    maxHeight: 400,
                    ...stylesApp.shadow
                }]}>
                    <ScrollView>
                        {_renderItems()}
                    </ScrollView>
                </Animated.View>
            )
        }
        return undefined;
    }, [props.positionActivator, area]);

    return (
        <Modal visible={props.open} transparent animationType='fade'>
            <StatusBar backgroundColor={colors.backdrop} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.backdrop }}>
                <Pressable style={{ flex: 1 }} onPress={() => props.setOpen(false)} onLayout={layout => {
                    console.log(layout.nativeEvent.layout);
                    setArea(layout.nativeEvent.layout);
                }} />
                {_renderOptions()}
            </SafeAreaView>
        </Modal>
    )
}

export const Menu = (props: Props) => {
    const { theme: { colors, roundness } } = useAppSelector(state => state.app);
    const [open, setOpen] = useState<boolean>(false);
    const [positionActivator, setPositionActivator] = useState<LayoutRectangle>();
    const activator = useRef<TouchableHighlight>(null);
    const slide = useRef(new Animated.Value(0)).current;

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
            {_renderModalMenu({ open, setOpen, options: props.options, positionActivator })}
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
    },
    containerItemModal: {
        borderWidth: 1,
        marginVertical: 3
    }
});