import Color from 'color';
import React, { useState, useRef, useCallback, useContext } from 'react';
import { LayoutRectangle, Modal, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TouchableHighlight, View, Platform, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { stylesApp } from '../../App';
import { useAppSelector } from '../../app/hooks';
import { OrientationContext } from '../../context/OrientationContext';
import { Button } from '../Button';

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
    const { screenHeight } = useContext(OrientationContext);
    const [area, setArea] = useState<LayoutRectangle>();
    const plus: number = 2;

    const _renderItems = () => {
        return props.options.map((o, idx) => {
            return (
                <Button
                    key={idx}
                    mode='elevated'
                    text={o.label}
                    icon={o.icon ?? 'home'}
                    contentStyle={{ alignItems: 'flex-start', elevation: 2, marginVertical: 5 }}
                    colorPressed={colors.primaryContainer}
                    onPress={() => {
                        props.setOpen(false);
                        o.onPress();
                    }}
                />
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
                        backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background,
                        ...stylesApp.shadow
                    }]}>
                        {_renderItems()}
                    </Animated.View>
                    :
                    <View style={[styles.modal, {
                        right: 20, top: props.positionActivator.y, borderRadius: roundness * plus, ...stylesApp.shadow, backgroundColor: dark ?
                            Color(colors.background).darken(.4).toString() : colors.background
                    }]}>
                        {_renderItems()}
                    </View>
            )
        } else if (area) {
            return (
                <View
                    style={[styles.modal, {
                        width: '100%',
                        bottom: screenHeight - (area.height + area.y * 2),
                        paddingBottom: area.y + 20,
                        borderTopRightRadius: roundness * plus,
                        borderTopLeftRadius: roundness * plus,
                        maxHeight: 400,
                        ...stylesApp.shadow
                    }]}
                >
                    <ScrollView>
                        {_renderItems()}
                    </ScrollView>
                </View>
            )
        }
        return undefined;
    }, [props.positionActivator, area, screenHeight, colors]);

    return (
        <Modal visible={props.open} transparent animationType='fade'>
            <StatusBar backgroundColor={colors.backdrop} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.backdrop }}>
                <Pressable style={{ flex: 1 }}
                    onPress={() => props.setOpen(false)}
                    onLayout={layout => {
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
        position: 'absolute',
        padding: 15
    },
    containerItemModal: {
        borderWidth: .3,
        marginVertical: 3,
        padding: 5
    }
});