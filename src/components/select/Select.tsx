import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, I18nManager, Keyboard, Modal, TextInput as NativeTextInput, TouchableWithoutFeedback, View, SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';
import { useAppSelector } from '../../app/hooks';
import { List } from '../List';
import { stylesApp } from '../../App';
import TextInput from '../TextInput';
import Color from 'color';
import { HandleContext } from '../../context/HandleContext';

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

    const { colors, roundness, dark } = useAppSelector(state => state.app.theme);
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
                let width = Math.floor(px);
                let top = Math.floor(py) + Math.floor(fy) + 2;
                let bottom = H - top;
                let left = I18nManager.isRTL
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
                <TextInput
                    value={value}
                    label={value !== '' ? 'Cuenta seleccionada' : label}
                    placeholder={visible ? 'Buscando cuentas ...' : 'Seleccione una cuenta'}
                    showSoftInputOnFocus={false}
                    iconRight={value !== '' ? 'close' : visible ? 'chevron-up' : 'chevron-down'}
                    editable={false}
                    onPress={() => setVisible(true)}
                    onRightPress={() => {
                        if (value !== '') {
                            onSelect([])
                        } else {
                            setVisible(true)
                        }
                    }}
                    containerStyle={{
                        borderRadius: roundness,
                        borderWidth: .2,
                        borderBottomWidth: .2,
                        borderBottomColor: colors.primary,
                        borderColor: colors.primary,
                        paddingLeft: 15,
                        marginVertical: 10,
                    }}
                    iconStyle={{ marginRight: 15 }}
                // error={error}
                />
            </TouchableWithoutFeedback>
        )
    }, [error, value, visible, label, colors]);

    const _renderModal = useCallback(() => {
        if (position) {
            const { width, bottom, height, left, top } = position;
            const { top: topSafe, screenHeight, bottom: bottomSafe } = useContext(HandleContext);
            let isDes: boolean = false;
            if (maxHeight) {
                isDes = ((screenHeight - topSafe) - bottomSafe) < (maxHeight + top - topSafe);
            }

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
                                        height: maxHeight ?? '100%',
                                        width,
                                        borderRadius: roundness * 2,
                                        backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background,
                                        shadowColor: colors.onSurface
                                    },
                                    maxHeight ? {
                                        position: 'absolute',
                                        top: !isDes ? Platform.OS === 'ios' ? top : top : undefined,
                                        bottom: isDes ? 0 : undefined
                                    } : {}
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
                                            colorBtns={{ cancel: colors.danger, confirm: colors.success }}
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
    }, [visible, keyboardHeight, position, colors, dark, heightOption, maxHeight]);

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