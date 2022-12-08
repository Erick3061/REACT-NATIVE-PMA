import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, I18nManager, Keyboard, Modal, Pressable, TextInput as NativeTextInput, TouchableWithoutFeedback, View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { TextInput } from 'react-native-paper';
import _ from 'lodash';
import { useAppSelector } from '../../app/hooks';
import { List } from '../List';
import { stylesApp } from '../../App';

interface Props<T> {
    valueField: keyof T;
    labelField: keyof T;
    itemsSelected: Array<T>;
    colorSelected?: string;
    data: Array<T>;
    onChange: (item: Array<T>) => void;
    value: string;
    label?: string;
    error?: boolean;
    multiSelect?: { maxSelect: number };
    animationType?: "slide" | "none" | "fade";
    maxHeight?: number;
    renderCancelBtn?: boolean;
    renderSearch?: {
        placeholder: string;
    }
}

export const Select = <T extends Object>(props: Props<T>) => {
    const {
        valueField,
        labelField,
        data,
        onChange,
        value,
        error,
        label,
        multiSelect,
        itemsSelected,
        animationType,
        maxHeight,
        renderSearch,
        colorSelected,
        renderCancelBtn
    } = props;

    const { colors, roundness } = useAppSelector(state => state.app.theme);
    const { width: W, height: H } = Dimensions.get('window');
    const heightOption: number = 40;
    const ref = useRef<View>(null);
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
        (items: Array<T>) => {
            onChange(items);
            search.current?.blur();
            Keyboard.dismiss();
            _close();
        },
        [onChange, _close]
    );

    const _renderDropDown = useCallback(() => {
        return (
            <TouchableWithoutFeedback>
                <Pressable onPress={() => setVisible(true)}>
                    <TextInput
                        style={{}}
                        value={value}
                        mode='outlined'
                        label={value !== '' ? 'Cuenta seleccionada' : label}
                        placeholder={visible ? 'Buscando cuentas ...' : 'Seleccione una cuenta'}
                        showSoftInputOnFocus={false}
                        editable={false}
                        right={value !== '' ? <TextInput.Icon color={colors.primary} icon='close' onPress={() => onSelect([])} /> : <TextInput.Icon color={colors.primary} icon={visible ? 'chevron-up' : 'chevron-down'} onPress={() => setVisible(true)} />}
                        error={error}
                    />
                </Pressable>
            </TouchableWithoutFeedback>
        )
    }, [error, value, visible, label, colors]);

    const _renderModal = useCallback(() => {
        if (position) {
            const { width, bottom, height, left, top } = position;
            return (
                <Modal
                    transparent
                    animationType={animationType}
                    visible={visible}
                    hardwareAccelerated
                >
                    <StatusBar backgroundColor={colors.backdrop} />
                    <TouchableWithoutFeedback
                        onPress={maxHeight ? _close : () => { }}
                    >
                        <SafeAreaView style={{ flex: 1, backgroundColor: colors.backdrop }}>
                            <View style={[modal.Modal]}>
                                <View style={[
                                    modal.Container,
                                    {
                                        width,
                                        borderRadius: roundness * 2
                                    },
                                    maxHeight
                                        ? {
                                            height: renderCancelBtn ? (data.length + 1) * heightOption + 20 : (data.length) * heightOption + 30,
                                            maxHeight,
                                            position: 'absolute',
                                            top,
                                            left
                                        }
                                        : {
                                            height: '100%'
                                        }
                                ]}>
                                    <TouchableWithoutFeedback>
                                        <List
                                            data={data}
                                            itemsSelected={itemsSelected}
                                            labelField={labelField}
                                            valueField={valueField}
                                            separator
                                            separatorColor={colors.primary}
                                            colorSelected={colorSelected}
                                            onChange={onSelect}
                                            multiSelect={multiSelect}
                                            renderSearch={renderSearch}
                                            colorBtns={{ cancel: colors.error, confirm: colors.primary }}
                                            renderCanelBtn={renderCancelBtn}
                                            height={40}
                                        />
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </SafeAreaView>
                    </TouchableWithoutFeedback>
                </Modal>
            )
        }
        return null
    }, [visible, keyboardHeight, position]);

    return (
        <View style={{ justifyContent: 'center', flex: 1 }} ref={ref} onLayout={_measure}>
            {_renderDropDown()}
            {_renderModal()}
        </View>
    )
};

const modal = StyleSheet.create({
    Modal: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10
    },
    Container: {
        backgroundColor: 'white',
        padding: 5,
        ...stylesApp.shadow
    }
});