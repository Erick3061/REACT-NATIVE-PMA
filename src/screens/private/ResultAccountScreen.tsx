import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { ListRenderItemInfo, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { useReport } from '../../hooks/useQuery';
import { Loading } from '../../components/Loading';
import { Account, Events } from '../../interfaces/interfaces';
import { useAppSelector } from '../../app/hooks';
import Color from 'color';
import { stylesApp } from '../../App';
import { TargetPercentaje } from '../../components/TargetPercentaje';
import Table from '../../components/table/Table';
import { Menu } from '../../components/select/Menu';
import { AppBar } from '../../components/AppBar';
import { IconButton } from '../../components/IconButton';

interface Props extends StackScreenProps<rootPrivateScreens, 'ResultAccountScreen'> { };
export const ResultAccountScreen = ({ navigation, route: { params: { account, end, report, start, keys, events, typeAccount } } }: Props) => {
    const { theme: { colors, fonts, roundness, dark } } = useAppSelector(state => state.app);
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
                        <View style={{ paddingVertical: 5 }}>
                            <ScrollView horizontal alwaysBounceHorizontal contentContainerStyle={[{ marginLeft: 5 }]} showsHorizontalScrollIndicator={false}>
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
                    )
                else return undefined;
            } else { return undefined }
        } else { return undefined }
    }, [data, colors]);

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
                                    colorBackgroundTable={dark ? Color(colors.background).darken(.4).toString() : colors.background}
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
    }, [data, view, dark, Color, colors]);

    return (
        <>
            {(isLoading || isFetching) && <Loading />}
            <AppBar
                left={<IconButton name='arrow-left' style={{ marginLeft: 10 }} iconsize={30} onPress={() => navigation.goBack()} color={colors.primary} />}
                label={report === 'ap-ci' ? 'APERTURA Y CIERRE' : 'EVENTO DE ALARMA'}
                right={
                    <View style={{ marginRight: 10 }}>
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
                    </View>
                }
            />
            <View style={{ flex: 1, marginHorizontal: 5 }}>
                <Text style={[{ borderLeftWidth: 3, borderColor: colors.primary, color: colors.text }, fonts.titleMedium]}>  Entre las fechas {start} a {end}</Text>
                {_renderPercentajes()}
                {_renderData()}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 5,
        margin: 5,
        ...stylesApp.shadow,
    }
});