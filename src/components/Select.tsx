import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    Dimensions, FlatList, I18nManager, Keyboard, Modal, Pressable, StyleSheet,
    TextInput as NativeTextInput, TouchableOpacity,
    TouchableWithoutFeedback, View, VirtualizedList
} from 'react-native';
import { IconButton, Text, TextInput } from 'react-native-paper';
import _ from 'lodash';
import { useAppSelector } from '../app/hooks';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { vh } from '../config/Dimensions';
import Toast from 'react-native-toast-message';

type Props = {
    valueField: string;
    labelField: string;
    label?: string;
    data: Array<{ label: string, value: any }>;
    valueSelect: { label: string, value: any };
    flatListProps?: any;
    onBlur?: () => void;
    onChange: (item: any) => void;
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
            valueSelect
        } = props;

        const { colors } = useAppSelector(state => state.app.theme);
        const { width: W, height: H } = Dimensions.get('window');
        const ref = useRef<View>(null);
        const search = useRef<NativeTextInput>(null);
        const refList = useRef<FlatList>(null);

        const initialCurrentValue: { label: string, value: any } = { label: '', value: '' };
        const initialLimit: number = 50;

        const [visible, setVisible] = useState<boolean>(false);
        const [limit, setLimit] = useState<number>(initialLimit)
        const [filter, setFilter] = useState<Array<{ label: string, value: any }>>([]);
        const [position, setPosition] = useState<{ width: number, top: number, bottom: number, left: number, height: number }>();
        const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
        const [textQueryValue, setTextQueryValue] = useState<string>('');
        const debaucedValue = useDebouncedValue(textQueryValue, 200);

        useEffect(() => {
            setLimit(initialLimit)
            setFilter(() => data.filter(f => f.label.toLowerCase().includes(debaucedValue.toLowerCase())));
        }, [debaucedValue]);

        useEffect(() => {
            if (textQueryValue === '') {
                setLimit(initialLimit)
                setFilter(data.slice(0, initialLimit));
            }
        }, [textQueryValue]);

        useEffect(() => {//Keyboard action
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

        useEffect(() => {
            Toast.show({
                text1: JSON.stringify({ limit, data: data.length })
            })
        }, [limit]);


        const _close = useCallback(() => {
            if (visible) setVisible(false);
            setLimit(initialLimit);
            setFilter(data.slice(0, limit));
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
                onChange(item);
                search.current?.blur();
                Keyboard.dismiss();
                _close();
            },
            [onChange, _close]
        );

        const _renderItem = ({ item, index }: { item: any; index: number }) => {
            const selected = _.isEqual(_.get(item, valueField), valueSelect.value);
            return (
                <TouchableOpacity
                    key={index.toString()}
                    // onPress={() => console.log(item)}
                    onPress={() => onSelect(item)}
                    style={[
                        { borderColor: colors.onPrimary, borderWidth: 1 },
                        styles.item,
                        selected && { backgroundColor: colors.primaryContainer },
                    ]}
                >
                    <Text variant='bodyLarge' style={{ paddingHorizontal: 10 }}>
                        {_.get(item, labelField)}
                    </Text>
                </TouchableOpacity>
            );
        };

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
                            <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(0,0,0,.1)' }}>
                                <View style={{ width, height: topHeight, top, backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
                                    <TouchableWithoutFeedback>
                                        <View style={{ width: '100%', height: '100%' }}>
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
                                                    <IconButton
                                                        style={{ alignSelf: 'flex-end' }}
                                                        containerColor={colors.primary}
                                                        iconColor={colors.onPrimary}
                                                        icon={'close'}
                                                        size={vh * 2}
                                                        onPress={_close}
                                                    />
                                                </View>
                                            </TouchableWithoutFeedback>
                                            <FlatList
                                                ref={refList}
                                                keyboardShouldPersistTaps="handled"
                                                removeClippedSubviews
                                                initialNumToRender={initialLimit}
                                                ListEmptyComponent={<Text>Sin coincidencias</Text>}
                                                contentContainerStyle={{
                                                    paddingTop: 5,
                                                    flexGrow: 1
                                                }}
                                                data={textQueryValue !== '' ? filter.slice(0, initialLimit) : filter}
                                                renderItem={_renderItem}
                                                keyExtractor={(_item, index) => index.toString()}
                                                onEndReachedThreshold={0.2}
                                                onEndReached={() => {
                                                    if (textQueryValue === '') {
                                                        const newLimit: number = limit + initialLimit;
                                                        setLimit(newLimit);
                                                        setFilter([...filter, ...data.slice(limit, newLimit)]);
                                                    }
                                                }}
                                                onScrollToIndexFailed={info => {
                                                    new Promise(resolve => setTimeout(() => resolve, 500)).then(() => {
                                                        refList.current?.scrollToIndex({ index: info.index, animated: true });
                                                    });
                                                }}
                                            />
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
                            right={value !== '' ? <TextInput.Icon icon='close' onPress={() => onSelect(initialCurrentValue)} /> : undefined}
                            error={error}
                        />
                    </Pressable>
                </TouchableWithoutFeedback>
                {_renderModal()}
            </View>
        )
    });

const styles = StyleSheet.create({
    item: {
        paddingVertical: vh,
        borderRadius: 7,
        marginVertical: 2
    }
});