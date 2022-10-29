import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, I18nManager, Keyboard, Modal, Pressable, StyleSheet, Text, TextInput as NativeTextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import _ from 'lodash';
import { useAppSelector } from '../app/hooks';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { vh, vw } from '../config/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { List } from './List ';

type Props = {
    valueField: string;
    labelField: string;
    label?: string;
    data: Array<any>;
    valuesSelected: Array<any>;
    flatListProps?: any;
    onBlur?: () => void;
    onChange: (item: Array<{ label: string, value: any }>) => void;
    value: string;
    error?: boolean;
}

export const Select = React.forwardRef<any, Props>(
    (props, currentRef: React.Ref<View>) => {
        const {
            valueField,
            labelField,
            data,
            onChange,
            value,
            error,
            label,
            valuesSelected
        } = props;

        const { colors, roundness } = useAppSelector(state => state.app.theme);
        const { width: W, height: H } = Dimensions.get('window');
        const ref = useRef<View>(null);
        const search = useRef<NativeTextInput>(null);
        const initialCurrentValue: { label: string, value: any } = { label: '', value: '' };
        const [visible, setVisible] = useState<boolean>(false);
        const [filter, setFilter] = useState<Array<{ label: string, value: any }>>([]);
        const [position, setPosition] = useState<{ width: number, top: number, bottom: number, left: number, height: number }>();
        const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
        const [textQueryValue, setTextQueryValue] = useState<string>('');
        const debaucedValue = useDebouncedValue(textQueryValue, 200);

        useEffect(() => {
            setFilter(() => data.filter(f => String(_.get(f, labelField)).toLowerCase().includes(debaucedValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))));
        }, [debaucedValue]);

        useEffect(() => {
            if (textQueryValue === '') {
                setFilter(data);
            }
        }, [textQueryValue]);

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
            setFilter(data);
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
            (item: { label: string, value: any }) => {
                onChange([item]);
                search.current?.blur();
                Keyboard.dismiss();
                _close();
            },
            [onChange, _close]
        );

        const _renderSearch = useCallback(() => {
            return (
                <TouchableWithoutFeedback>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            style={{ flex: 1 }}
                            ref={search}
                            dense
                            mode='outlined'
                            label={'Buscar Cuenta'}
                            left={<TextInput.Icon icon={'magnify'} />}
                            autoCapitalize='none'
                            onChangeText={setTextQueryValue}
                        />
                        <View style={{ justifyContent: 'center' }}>
                            <Icon
                                style={{ alignSelf: 'flex-end', backgroundColor: colors.primary, color: colors.onPrimary, borderRadius: roundness, marginLeft: 5, }}
                                name='close'
                                size={vw * 8}
                                onPress={_close}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        }, [search, vh, colors, _close, setTextQueryValue]);

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
                            right={value !== '' ? <TextInput.Icon color={colors.primary} icon='close' onPress={() => onSelect(initialCurrentValue)} /> : <TextInput.Icon color={colors.primary} icon={visible ? 'chevron-up' : 'chevron-down'} onPress={() => setVisible(true)} />}
                            error={error}
                        />
                    </Pressable>
                </TouchableWithoutFeedback>
            )
        }, [error, value, visible, label, initialCurrentValue, colors])

        const _renderModal = useCallback(() => {
            if (position) {
                const { width, height, bottom, left, top } = position;
                let topHeight = (H - (top + 10) - keyboardHeight);

                return (
                    <Modal
                        transparent
                        animationType='slide'
                        visible={visible}
                        hardwareAccelerated
                    >
                        <TouchableWithoutFeedback onPress={_close}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.1)', paddingVertical: 20 }}>
                                <View style={{ width, height: '100%', backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
                                    <TouchableWithoutFeedback>
                                        <View style={{ width: '100%', height: '100%' }}>
                                            {_renderSearch()}
                                            <List data={filter} label={labelField} separatorColor={colors.primary} separator />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                )
            }
            return null
        }, [visible, keyboardHeight, position, filter]);

        return (
            <View style={{ justifyContent: 'center' }} ref={ref} onLayout={_measure}>
                {_renderDropDown()}
                {_renderModal()}
            </View>
        )
    });