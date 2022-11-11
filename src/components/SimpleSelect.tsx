import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, I18nManager, Keyboard, ListRenderItemInfo, Modal, Pressable, Text, TextInput as NativeTextInput, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import _ from 'lodash';
import { useAppSelector } from '../app/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Surface, TouchableRipple } from 'react-native-paper';

type Props = {
    data: Array<any>;
    onChange: (item: any) => void;
    value: any;
    label?: string;
    Width?: number;
    Height?: number;
}

export const SimpleSelect = React.forwardRef<any, Props>(
    (props, currentRef: React.Ref<View>) => {
        const { data, onChange, value, label, Width, Height } = props;
        const { colors, roundness } = useAppSelector(state => state.app.theme);
        const { width: W, height: H } = Dimensions.get('window');
        const ref = useRef<View>(null);
        const refList = useRef<FlatList>(null);
        const search = useRef<NativeTextInput>(null);
        const [visible, setVisible] = useState<boolean>(false);
        const [position, setPosition] = useState<{ width: number, top: number, bottom: number, left: number, height: number }>();
        const [keyboardHeight, setKeyboardHeight] = useState<number>(0);


        useEffect(() => {
            const keyboardOpen = Keyboard.addListener('keyboardDidShow', (event) => {
                setKeyboardHeight(event.endCoordinates.height);
            })
            const keyboardClose = Keyboard.addListener('keyboardDidHide', () => {
                setKeyboardHeight(0);
            })
            return () => {
                keyboardOpen.remove();
                keyboardClose.remove();
            }
        }, []);

        const _close = useCallback(() => {
            if (visible) setVisible(false);
        }, [visible]);

        const _measure = useCallback(() => {
            if (ref && ref?.current) {
                ref.current.measure((_width, _height, px, py, fx, fy) => {
                    const width = Math.floor(px);
                    const top = Math.floor(py) + Math.floor(fy) + 2;
                    const bottom = H - top;
                    const left = I18nManager.isRTL
                        ? W - Math.floor(px) - Math.floor(fx)
                        : Math.floor(fx);
                    setPosition({ width, top, bottom: Math.floor(bottom), left, height: Math.floor(py) });
                });
            }
        }, [W, H]);

        const onSelect = useCallback(
            (item: any) => {
                onChange(item);
                search.current?.blur();
                Keyboard.dismiss();
                _close();
            },
            [onChange, _close]
        );

        const _renderDropDown = useCallback(() => {
            return (
                <TouchableWithoutFeedback>
                    <Surface style={{ borderRadius: roundness * 2 }}>
                        <Pressable onPress={() => setVisible(true)}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'white', alignItems: 'center', borderRadius: roundness * 2 }}>
                                <TextInput
                                    style={{ backgroundColor: 'white', padding: 0, margin: 0, color: 'black', textAlign: 'center', borderRadius: roundness * 2 }}
                                    value={String(value)}
                                    showSoftInputOnFocus={false}
                                    editable={false}
                                />
                                <Icon name={visible ? 'menu-up' : 'menu-down'} size={25} />
                            </View>
                        </Pressable>
                    </Surface>
                </TouchableWithoutFeedback >
            )
        }, [value, visible, label, colors]);

        const _renderList = useCallback(() => {
            if (position && ref.current) {
                const _renderItem = (item: ListRenderItemInfo<any>) => {
                    return (
                        <TouchableRipple onPress={() => onSelect(item.item)} rippleColor={colors.onPrimaryContainer} style={{ borderWidth: 1, borderColor: colors.primaryContainer, borderRadius: roundness * 2, marginVertical: 2, paddingVertical: 5, }}>
                            <Text style={{ textAlign: 'center', fontWeight: '500' }}>{item.item}</Text>
                        </TouchableRipple>
                    )
                }

                return (
                    <FlatList ref={refList} data={data.filter(f => f !== value)} renderItem={_renderItem} onLayout={({ nativeEvent: { layout } }) => {
                        ref.current?.measure((x, y, width, height, px, py) => {
                            setPosition({ ...position, height: layout.height + (height * 2) });
                        });
                    }} />
                )
            }
        }, [data, position, ref, roundness, value])

        const _renderModal = useCallback(() => {
            if (position) {
                const { width, bottom, height, left, top } = position;
                return (
                    <Modal
                        animationType='fade'
                        visible={visible}
                        hardwareAccelerated
                        transparent
                    >
                        <TouchableWithoutFeedback
                            onPress={_close}
                        >
                            <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(0,0,0,.2)' }}>
                                <View style={{ position: 'absolute', width: Width ?? width, top: top - (height), left, backgroundColor: 'white', borderRadius: roundness * 2, padding: 5 }}>
                                    <TouchableWithoutFeedback>
                                        <View style={{ width: '100%', height: '100%' }}>
                                            {_renderList()}
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal >
                )
            }
            return null
        }, [visible, keyboardHeight, position]);

        return (
            <View style={{ justifyContent: 'center' }} ref={ref} onLayout={_measure}>
                {_renderDropDown()}
                {_renderModal()}
            </View>
        )
    });