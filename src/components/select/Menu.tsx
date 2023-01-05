import Color from 'color';
import React, { useState, useRef, useCallback, useContext } from 'react';
import { LayoutRectangle, Modal, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, TouchableHighlight, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { stylesApp } from '../../App';
import { useAppSelector } from '../../app/hooks';
import { HandleContext } from '../../context/HandleContext';
import { Orientation } from '../../interfaces/interfaces';
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
    const { top, bottom, orientation } = useContext(HandleContext);
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
                        o.onPress && o.onPress();
                    }}
                />
            )
        })
    }

    const _renderOptions = useCallback(() => {
        if (props.positionActivator) {
            return (
                // Platform.OS === 'ios'
                //     ?
                //     <View style={[styles.modal,
                //     {
                //         width: '100%',
                //         bottom,
                //         borderRadius: roundness * plus,
                //         backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background,
                //         shadowColor: colors.onSurface
                //     },
                //     orientation === Orientation.landscape && {
                //         backgroundColor: 'red'
                //     }
                //     ]}>
                //         {_renderItems()}
                //     </View>
                //     :
                <View style={[
                    styles.modal,
                    stylesApp.shadow,
                    {
                        right: 20,
                        top: props.positionActivator.y + 10 + top, borderRadius: roundness * plus,
                        backgroundColor: dark
                            ? Color(colors.background).darken(.4).toString()
                            : colors.background,
                        shadowColor: colors.onSurface
                    }]}>
                    {_renderItems()}
                </View>
            )
        } else {
            return (
                <View
                    style={[styles.modal, {
                        width: '100%',
                        bottom: 100 - (top + bottom * 2),
                        paddingBottom: bottom + 20,
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
    }, [props.positionActivator, 100, colors, orientation]);

    return (
        <Modal visible={props.open} transparent animationType='fade' supportedOrientations={['landscape', 'portrait']}>
            <StatusBar backgroundColor={colors.backdrop} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.backdrop }}>
                <Pressable style={{ flex: 1 }}
                    onPress={() => props.setOpen(false)} />
                {_renderOptions()}
            </SafeAreaView>
        </Modal>
    )
}

export const Menu = (props: Props) => {
    const { theme: { colors } } = useAppSelector(state => state.app);
    const [open, setOpen] = useState<boolean>(false);
    const [positionActivator, setPositionActivator] = useState<LayoutRectangle>();
    const activator = useRef<TouchableHighlight>(null);

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