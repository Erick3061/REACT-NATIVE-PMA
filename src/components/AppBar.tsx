import React, { useContext, useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, StyleProp, TextStyle, View, ViewStyle, LayoutRectangle, Platform } from 'react-native';
import { stylesApp } from '../App';
import { useAppSelector } from '../app/hooks';
import Color, { lab } from 'color';
import Text from './Text';
import { IconBtn } from './IconButton';
import { HandleContext } from '../context/HandleContext';
import { Orientation } from '../interfaces/interfaces';
import { Button, Props as ButtonProps } from './Button';
interface Props {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>
    menu?: Array<ButtonProps>;
    disabled?: boolean;
}

export const renderContent = ({ children }: { children: React.ReactNode }) => {
    return (
        React.Children.toArray(children as React.ReactNode | Array<React.ReactNode>)
            .filter((child) => child != null && typeof (child) !== 'boolean')//aseguramos que es un Elemento
            .map((child, i) => {
                //@ts-ignore
                if (!React.isValidElement(child) || ![Text].includes(child.type)) return child;

                const props: { style?: StyleProp<TextStyle>; } = {};
                //@ts-ignore
                if (child.type === Text) {
                    props.style = [{ flex: 1, marginHorizontal: 10 }]
                }

                return React.cloneElement(child, props);
            })
    )
}


export const AppBar = ({ children, style, menu, disabled }: Props) => {
    const { theme: { colors, dark, roundness } } = useAppSelector(state => state.app);
    const [open, setOpen] = useState<boolean>(false);
    const { top, bottom, screenWidth, orientation, screenHeight } = useContext(HandleContext);
    const [layout, setLayout] = useState<LayoutRectangle>();
    const height: number = 45;
    const radius: number = roundness * 3;

    useEffect(() => {
        if (disabled) {
            setOpen(false);
        }
    }, [disabled])

    return (
        <View style={[
            stylesApp.shadow,
            {
                backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background,
                flexDirection: 'row', alignItems: 'center', shadowColor: colors.text, height
            },
            style
        ]}>
            {renderContent({ children })}
            {menu && <IconBtn
                disabled={disabled}
                name='dots-horizontal-circle'
                color={colors.primary}
                onPress={() => setOpen(true)}
                onLayout={({ nativeEvent: { layout } }) => setLayout(layout)}
                style={{ marginRight: 5 }}
            />}
            <Modal visible={open} animationType='fade' hardwareAccelerated transparent supportedOrientations={['landscape', 'portrait']} >
                <SafeAreaView style={{ flex: 1 }}>
                    <Pressable style={{ flex: 1, backgroundColor: Color(colors.backdrop).fade(.3).toString() }} onPress={() => setOpen(false)} />
                    <View style={[
                        {
                            position: 'absolute',
                            top: top + (layout ? orientation === Orientation.portrait ? (layout?.y + layout.height) : 0 : 0),
                            right: orientation === Orientation.portrait
                                ? layout ? screenWidth - (layout.x + layout.width) : 0
                                : Platform.OS === 'ios' ? bottom - (screenWidth + (layout ? layout?.width : 0)) : layout ? screenHeight - (layout.x + layout.width) : 0
                            ,
                            backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background, padding: 10,
                        },
                        stylesApp.shadow, { shadowColor: colors.primary, borderRadius: radius, shadowRadius: radius, elevation: 3 }
                    ]}>
                        {
                            menu?.map((op, idx) => {
                                return (
                                    <View key={idx + 1}>
                                        <Button {...op} />
                                        {Platform.OS === 'ios' && idx < menu.length - 1 && <View style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: Color(colors.background).fade(.2).toString(), backgroundColor: colors.onSurface }} />}
                                    </View>
                                )
                            })
                        }
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    )
}