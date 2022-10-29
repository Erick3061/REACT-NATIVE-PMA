import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    Dimensions, FlatList, I18nManager, Keyboard, Modal, Pressable, StyleSheet,
    Text,
    TextInput as NativeTextInput, TouchableOpacity,
    TouchableWithoutFeedback, View
} from 'react-native';
import { RecyclerListView, LayoutProvider, DataProvider } from "recyclerlistview";

import { Button, TextInput } from 'react-native-paper';
import _ from 'lodash';
import { useAppSelector } from '../app/hooks';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { vh, vw, screenWidth } from '../config/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    valueField: string;
    labelField: string;
    data: Array<{ label: string, value: any }>;
    valuesSelected?: Array<{ label: string, value: any }>;
    flatListProps?: any;
    onBlur?: () => void;
    onChange: (item: any) => void;
    error?: boolean;
}

export const MultipleSelect = React.forwardRef<any, Props>(
    (props, currentRef: React.Ref<View>) => {
        const {
            valueField,
            labelField,
            data,
            onChange,
            error,
            valuesSelected
        } = props;

        const { colors, roundness } = useAppSelector(state => state.app.theme);
        const { width: W, height: H } = Dimensions.get('window');
        const ref = useRef<View>(null);
        const search = useRef<NativeTextInput>(null);
        const refList = useRef<FlatList>(null);

        const initialCurrentValue: { label: string, value: any } = { label: '', value: '' };
        const initialLimit: number = 30;

        const [visible, setVisible] = useState<boolean>(false);
        const [limit, setLimit] = useState<number>(initialLimit);
        const [dataProvider, setDataProvider] = useState<DataProvider>(new DataProvider((r1, r2) => r1 !== r2));
        const [filter, setFilter] = useState<Array<{ label: string, value: any }>>([]);
        // const [selected, setSelected] = useState<Array<{ label: string, value: any }>>(valuesSelected);
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

        useEffect(() => {
            setFilter(data.slice(0, initialLimit));
            // console.log(valuesSelected);
        }, [valuesSelected])


        useEffect(() => {
            const keyboardOpen = Keyboard.addListener('keyboardDidShow', (event) => {
                setKeyboardHeight(event.endCoordinates.height);
            })
            const keyboardClose = Keyboard.addListener('keyboardDidHide', () => {
                setKeyboardHeight(0);
            });

            setDataProvider(dataProvider.cloneWithRows(data));

            return () => {
                keyboardOpen.remove();
                keyboardClose.remove();
            }

        }, []);

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
            },
            [onChange, _close]
        );

        const _renderItem = ({ item, index }: { item: any; index: number }) => {
            let isSelected: boolean = (valuesSelected?.find(f => _.isEqual(_.get(item, valueField), f.value))) ? true : false;
            return (
                <TouchableOpacity
                    key={item.key}
                    onPress={() => { console.log(item) }}
                >
                    <Text style={{ paddingHorizontal: 10, color: colors.primary, marginVertical: 5 }}>{item.label}</Text>
                </TouchableOpacity>
                // <TouchableOpacity
                //     key={index.toString()}
                //     onPress={() => onSelect(item)}
                //     style={[
                //         { borderColor: colors.onPrimary, borderWidth: 1 },
                //         styles.item,
                //         isSelected && { backgroundColor: colors.primaryContainer },
                //     ]}
                // >
                //     <Text style={{ paddingHorizontal: 10, color: colors.primary }}>
                //         {_.get(item, labelField)}
                //     </Text>
                // </TouchableOpacity>
            );
        };

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
                            mode='outlined'
                            placeholder={visible ? 'Seleccionando cuentas ...' : 'Seleccione sus cuentas'}
                            showSoftInputOnFocus={false}
                            editable={false}
                            right={true ? <TextInput.Icon color={colors.primary} icon='close' onPress={() => {
                                //onSelect(initialCurrentValue)
                            }} /> : <TextInput.Icon color={colors.primary} icon={visible ? 'chevron-up' : 'chevron-down'} onPress={() => setVisible(true)} />}
                            error={error}
                        />
                    </Pressable>
                </TouchableWithoutFeedback>
            )
        }, [error, visible, initialCurrentValue, colors]);

        const _renderLayoutProvider = () => {
            const ViewTypes = {
                FULL: 0,
                HALF_LEFT: 1,
                HALF_RIGHT: 2
            };

            return new LayoutProvider(
                index => {
                    if (index % 3 === 0) {
                        return ViewTypes.FULL;
                    } else if (index % 3 === 1) {
                        return ViewTypes.HALF_LEFT;
                    } else {
                        return ViewTypes.HALF_RIGHT;
                    }
                },
                (type, dim) => {
                    switch (type) {
                        case ViewTypes.HALF_LEFT:
                            dim.width = screenWidth / 2;
                            dim.height = 160;
                            break;
                        case ViewTypes.HALF_RIGHT:
                            dim.width = screenWidth / 2;
                            dim.height = 160;
                            break;
                        case ViewTypes.FULL:
                            dim.width = screenWidth;
                            dim.height = 140;
                            break;
                        default:
                            dim.width = 0;
                            dim.height = 0;
                    }
                }
            );
        }

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
                            <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgba(0,0,0,.1)', marginVertical: 20 }}>
                                <View style={{ width, height: '100%', backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
                                    <TouchableWithoutFeedback>
                                        <View style={{ width: '100%', height: '100%' }}>
                                            {_renderSearch()}
                                            {/* <FlatList
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
                                                onEndReachedThreshold={0.1}
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
                                            /> */}
                                            {/* <RecyclerListView
                                                dataProvider={dataProvider}
                                                layoutProvider={() => _renderLayoutProvider}
                                            /> */}
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                                                <Button mode='contained' labelStyle={{ textTransform: 'uppercase' }} onPress={() => onChange(undefined)}>Limpiar</Button>
                                                <Button mode='contained' labelStyle={{ textTransform: 'uppercase' }}>Confirmar</Button>
                                            </View>
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

const styles = StyleSheet.create({
    item: {
        paddingVertical: vh,
        borderRadius: 7,
        marginVertical: 2
    }
});