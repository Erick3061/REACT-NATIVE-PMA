import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, TouchableHighlight, StatusBar } from 'react-native';
import Animated from 'react-native-reanimated';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { useReport } from '../../hooks/useQuery';
import { Loading } from '../../components/Loading';
import { Account, Events, Percentajes } from '../../interfaces/interfaces';
import { Appbar, Button, FAB, Portal } from 'react-native-paper';
import { useAppSelector } from '../../app/hooks';
import Color from 'color';
import { stylesApp } from '../../App';
import { TargetPercentaje } from '../../components/TargetPercentaje';
import Table from '../../components/table/Table';
import { Menu } from '../../components/select/Menu';

interface Props extends StackScreenProps<rootPrivateScreens, 'ResultAccountScreen'> { };
export const ResultAccountScreen = ({ navigation, route: { params: { account, end, report, start, keys, events, typeAccount } } }: Props) => {
    const { theme: { colors, fonts, roundness } } = useAppSelector(state => state.app);
    const { data, isLoading, isFetching, refetch } = useReport({ accounts: [account], dateStart: start, dateEnd: end, type: report, typeAccount, key: `${account}` ?? '1234567890' });
    const [view, setView] = useState<'table' | 'default'>('table');


    const _renderItem = ({ index, item, separators }: ListRenderItemInfo<Events>) => {
        return (
            <View style={[styles.item, { borderRadius: roundness * 2, backgroundColor: colors.background, shadowColor: colors.primary }]}>
                {keys.map(({ key, label }, idx) => (
                    <View key={idx + label} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                        <Text style={[fonts.titleSmall, { color: colors.text }]}>{label}</Text>
                        <Text> {Array.isArray(key) ? key.map(k => item[k]).join(' - ') : item[key]}  </Text>
                    </View>
                ))}
            </View>
        )
    };

    const _renderPercentajes = useCallback(() => {
        if (data && data.cuentas) {
            if (data.cuentas.length === 1) {
                const { percentajes } = data;
                if (percentajes)
                    return (
                        <View>
                            <View>
                                <ScrollView horizontal alwaysBounceHorizontal contentContainerStyle={{ marginHorizontal: 15 }} showsHorizontalScrollIndicator={false}>
                                    {Object.entries(percentajes).map((el, idx) => (
                                        <TargetPercentaje
                                            key={JSON.stringify(el)}
                                            max={100}
                                            text={el[0]} percentage={el[1]}
                                            style={{ marginHorizontal: 5, marginRight: idx === Object.entries(percentajes).length - 1 ? 30 : 0 }}
                                            icon={
                                                (el[0] === 'Apertura')
                                                    ? { name: 'lock-open', backgroundColor: 'green' }
                                                    : (el[0] === 'Cierre')
                                                        ? { name: 'lock', backgroundColor: colors.error }
                                                        : (el[0] === 'Alarma')
                                                            ? { name: 'bell', backgroundColor: '#eeb715' }
                                                            : (el[0] === 'Pruebas')
                                                                ? { name: 'test-tube', backgroundColor: 'steelblue' }
                                                                : (el[0] === 'Bateria')
                                                                    ? { name: 'car-battery', backgroundColor: 'green' } : { name: 'help', backgroundColor: 'silver' }
                                            } />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    )
                else return undefined;
            } else { return undefined }
        } else { return undefined }
    }, [data]);

    const _renderData = useCallback(() => {
        const ScrollY = useRef(new Animated.Value(0)).current;
        if (data && data.cuentas) {
            if (data.cuentas.length === 1) {
                const { Nombre, Direccion, eventos }: Account = data.cuentas[0];
                return (
                    <>
                        {
                            view === 'default'
                                ?
                                <Animated.FlatList
                                    data={eventos ?? []}
                                    renderItem={_renderItem}
                                    keyExtractor={(_, idx) => `${idx}`}
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { x: ScrollY } } }],
                                        { useNativeDriver: true }
                                    )}
                                />
                                :
                                <Table
                                    Header={{ title: Nombre, subtitle: Direccion }}
                                    Data={eventos ?? []}
                                    titles={keys}
                                    fontSize={11}
                                    pagination={{ iconBackgroundColor: colors.primaryContainer }}
                                    colorBackgroundTable={colors.background}
                                    showIndices
                                // test={}
                                />
                        }

                    </>
                )
            } else {
                return (<Text>more accounts</Text>)
            }

        }
        return undefined;
    }, [data, view]);

    const _renderFab = ({ view, setView }: { view: "table" | "default", setView: React.Dispatch<React.SetStateAction<"table" | "default">> }) => {
        const [open, setOpen] = useState(false);
        // if (view === 'table') return undefined;
        return (
            <Portal>
                <FAB.Group
                    open={open}
                    visible
                    icon={open ? 'close' : 'plus'}
                    actions={[
                        {
                            icon: 'file-pdf-box',
                            label: 'Descargar Pdf con gráfica',
                            onPress: () => console.log('Pressed star'),
                        },
                        {
                            icon: 'file-pdf-box',
                            label: 'Descargar Pdf',
                            onPress: () => console.log('Pressed star'),
                        },
                        {
                            icon: 'file-excel',
                            label: 'Descargar Exel',
                            onPress: () => console.log('Pressed email'),
                        },
                        {
                            icon: (view === 'default') ? 'table' : 'table-row',
                            label: (view === 'default') ? 'Visualizar tabla' : 'Visualizar cards',
                            onPress: () => (view === 'default') ? setView('table') : setView('default'),
                        },
                        {
                            icon: 'refresh',
                            label: 'Recargar',
                            onPress: () => refetch(),
                        },
                    ]}
                    onStateChange={() => setOpen(!open)}
                    onPress={() => {
                        if (open) {
                            // do something if the speed dial is open
                        }
                    }}
                />
            </Portal>
        )
    }

    return (
        <>
            {(isLoading || isFetching) && <Loading />}
            <Appbar.Header mode='small' theme={{ colors: { surface: colors.background } }}
                style={{ borderBottomWidth: 1, borderColor: Color(colors.primary).alpha(.1).toString(), height: Platform.OS === 'ios' ? 44 : 56 }}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content titleStyle={[fonts.bodyLarge, { fontWeight: 'bold' }]} title={report === 'ap-ci' ? 'APERTURA Y CIERRE' : 'EVENTO DE ALARMA'} />
                <Menu
                    options={[
                        {
                            icon: 'file-pdf-box',
                            label: 'Descargar Pdf con gráfica',
                            onPress: () => console.log('Pressed star'),
                        },
                        {
                            icon: 'file-pdf-box',
                            label: 'Descargar Pdf',
                            onPress: () => console.log('Pressed star'),
                        },
                        {
                            icon: 'file-excel',
                            label: 'Descargar Exel',
                            onPress: () => console.log('Pressed email'),
                        },
                        {
                            icon: (view === 'default') ? 'table' : 'table-row',
                            label: (view === 'default') ? 'Visualizar tabla' : 'Visualizar cards',
                            onPress: () => (view === 'default') ? setView('table') : setView('default'),
                        },
                        {
                            icon: 'refresh',
                            label: 'Recargar',
                            onPress: () => refetch(),
                        },
                    ]}
                />
            </Appbar.Header>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
                <Text style={[{ borderLeftWidth: 2, borderColor: colors.primary, color: colors.text }, fonts.bodyLarge]}>  Entre las fechas {start} a {end}</Text>
                {_renderPercentajes()}
                {_renderData()}
            </View>
            {/* {_renderFab({ view, setView })} */}
        </>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 5,
        margin: 5,
        ...stylesApp.shadow,
        // borderWidth: 1
    }
});