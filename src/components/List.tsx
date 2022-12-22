import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, TextInput as NativeTextInput } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../navigation/Root';
import Color from 'color';
import { HandleContext } from '../context/HandleContext';
import { useAppSelector } from '../app/hooks';
import Text from './Text';
import TextInput from './TextInput';
import { Button } from './Button';

interface Props<T> {
    data: Array<T>;
    valueField: keyof T;
    labelField: keyof T;
    height?: number;
    separator?: true;
    separatorColor?: string;
    colorSelected?: string;
    colorBtns?: {
        confirm: string;
        cancel: string;
    };
    itemsSelected: Array<T>;
    multiSelect?: { maxSelect: number };
    renderSearch?: {
        placeholder: string;
    }
    renderCanelBtn?: boolean;
    onChange: (item: Array<T>) => void;
}
export const List = <T extends Object>({ data, labelField, valueField, height, separator, separatorColor, multiSelect, onChange, itemsSelected, colorSelected, colorBtns, renderSearch, renderCanelBtn }: Props<T>) => {
    const [dataProvider, setDataProvider] = useState<DataProvider>(new DataProvider((r1, r2) => r1 !== r2));
    const containerList = useRef<View>(null);
    const [selected, setSelected] = useState<Array<any>>(itemsSelected);
    const [filter, setFilter] = useState<Array<any>>(data);
    const search = useRef<NativeTextInput>(null);
    const { screenWidth } = useContext(HandleContext);
    const { theme: { colors, roundness } } = useAppSelector(state => state.app);


    const _onSelect = useCallback((item: T) => {
        if (!multiSelect) {
            onChange([item]);
        } else {
            const index = selected.findIndex(f => (f[valueField] === item[valueField]));
            if (index > -1) {
                setSelected(selected.filter(f => f[valueField] !== selected[index][valueField]));
            } else {
                if (selected.length < multiSelect.maxSelect) {
                    setSelected([...selected, item]);
                } else {
                    Toast.show({ text1: 'Alerta', text2: 'Solo se pueden seleccionar hasta 5 cuentas', type: 'info' })
                }
            }
        }
    }, [dataProvider, valueField, labelField, setSelected, onChange, selected]);

    const _layoutProvider = useCallback(() => {
        return new LayoutProvider(
            index => index,
            (_, dim) => {
                dim.width = screenWidth;
                dim.height = height ?? 50;
            }
        );
    }, [dataProvider, height]);

    const _renderRow = useCallback((type: string | number, data: any, index: number, extendedState?: object | undefined) => {
        const isSelected = selected.find(f => f[valueField] === data[valueField]);
        return (
            <>
                <TouchableOpacity
                    onPress={() => _onSelect(data)}
                    style={[styles.item, { backgroundColor: isSelected ? colorSelected ?? 'lightskyblue' : undefined }]}
                >
                    <Text variant='labelMedium'>{data[labelField]}</Text>
                </TouchableOpacity>
                {separator && <View style={{ borderTopWidth: .3, borderColor: Color(separatorColor ?? 'silver').fade(.5).toString() }}></View>}
            </>
        )
    }, [dataProvider, labelField, valueField, height, separator, separatorColor, selected, colors]);

    const _renderSearch = useCallback(() => {
        const [textQueryValue, setTextQueryValue] = useState<string>('');
        const debaucedValue = useDebouncedValue(textQueryValue, 200);
        useEffect(() => {
            setFilter(() => data.filter(f => String(f[labelField]).toLowerCase().includes(debaucedValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))));
        }, [debaucedValue]);

        useEffect(() => {
            if (textQueryValue.length === 0) {
                setFilter(data);
            }
        }, [textQueryValue]);

        return (
            <TouchableWithoutFeedback>
                <View style={{ paddingHorizontal: 5 }}>
                    <TextInput
                        ref={search}
                        iconLeft='magnify'
                        placeholder={renderSearch ? renderSearch.placeholder : 'Buscar'}
                        containerStyle={[
                            {
                                borderWidth: 1,
                                borderBottomWidth: 1,
                                borderColor: colors.outlineVariant,
                                borderBottomColor: colors.outlineVariant,
                                borderRadius: roundness * 2,
                            },
                            search.current?.isFocused() && {
                                borderColor: colors.outline,
                                borderBottomColor: colors.outline,
                                borderWidth: 1,
                                borderBottomWidth: 1,
                            }
                        ]}
                        onChangeText={setTextQueryValue}
                        iconStyle={{ paddingBottom: 10 }}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }, [search, colors, roundness]);


    useEffect(() => {
        setDataProvider(dataProvider.cloneWithRows(filter));
    }, [filter]);

    return (
        <TouchableWithoutFeedback>
            <View style={{ flex: 1, padding: 5 }}>
                {renderSearch && _renderSearch()}
                <View ref={containerList} style={[styles.container, { borderColor: separatorColor ?? 'silver' }]}>
                    {
                        filter.length > 0
                            ?
                            <RecyclerListView
                                rowRenderer={_renderRow}
                                dataProvider={dataProvider}
                                layoutProvider={_layoutProvider()}
                            />
                            : <View style={{ flex: 1, justifyContent: 'center' }}><Text style={{ textAlign: 'center' }}>SIN COINCIDENCIAS</Text></View>
                    }
                </View>
                <View style={styles.containerBtns}>
                    {
                        renderCanelBtn &&
                        <Button
                            contentStyle={{ marginHorizontal: 5 }}
                            mode='contained'
                            text='cancelar'
                            customButtonColor={colorBtns?.cancel}
                            onPress={() => { onChange(itemsSelected) }}
                        />
                    }
                    {
                        multiSelect &&
                        <Button
                            contentStyle={{ marginHorizontal: 5 }}
                            mode='contained'
                            text='aceptar'
                            customButtonColor={colorBtns?.confirm}
                            onPress={() => onChange(selected)}
                        />
                    }
                </View>
                <Toast visibilityTime={4000} config={toastConfig} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    containerInput: {
        flexDirection: 'row',
        marginVertical: 3,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        padding: 3,
        borderColor: 'silver'
    },
    textInput: {
        flex: 1,
        padding: 5,
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 5,
        borderRadius: 5,
    },
    containerBtns: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    btns: {
        marginHorizontal: 5,
    }
});