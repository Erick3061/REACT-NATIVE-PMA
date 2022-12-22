import { StackScreenProps } from '@react-navigation/stack';
import React, { createRef, useCallback, useEffect, useReducer, useState } from 'react';
import { View, SectionList, ScrollView, Animated, ListRenderItemInfo, StyleSheet, Text } from 'react-native';
import { useAppSelector } from '../../app/hooks';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { Loading } from '../../components/Loading';
import Table from '../../components/table/Table';
import { useReport } from '../../hooks/useQuery';
import { Row } from '../../components/table/Row';
import { TypeReport } from '../../types/types';
import { TargetPercentaje } from '../../components/TargetPercentaje';
import Color from 'color';
import { Menu, _renderModalMenu } from '../../components/select/Menu';
import { Account, BatteryStatus, percentaje } from '../../interfaces/interfaces';
import { stylesApp } from '../../App';
import { getDay, modDate } from '../../functions/functions';
import TextInput from '../../components/TextInput';
import { IconButton } from '../../components/IconButton';
import { Button } from '../../components/Button';
import { AppBar } from '../../components/AppBar';
import { useQueryClient } from '@tanstack/react-query';

interface Props extends StackScreenProps<rootPrivateScreens, 'ResultAccountsScreen'> { };

interface initialStateBB { RESTORE: boolean, ERROR: boolean, WITHOUT_EVENTS: boolean }
interface initialStateState { Ap: boolean, Ci: boolean, Sa: boolean }

type actionReducerBB = | 'updateRESTORE' | 'updateERROR' | 'updateWITHOUT_EVENTS';
type actionReducerState = | 'updateAp' | 'updateCi' | 'updateSa';

const initialStateBB: initialStateBB = { RESTORE: true, WITHOUT_EVENTS: true, ERROR: true };
const initialStateState: initialStateState = { Ap: true, Ci: true, Sa: true };

function reducerBB(state: initialStateBB, action: actionReducerBB) {
    switch (action) {
        case 'updateERROR': return { ...state, ERROR: !state.ERROR }
        case 'updateRESTORE': return { ...state, RESTORE: !state.RESTORE }
        case 'updateWITHOUT_EVENTS': return { ...state, WITHOUT_EVENTS: !state.WITHOUT_EVENTS }
        default: return state;
    }
}

function reducerState(state: initialStateState, action: actionReducerState) {
    switch (action) {
        case 'updateAp': return { ...state, Ap: !state.Ap }
        case 'updateCi': return { ...state, Ci: !state.Ci }
        case 'updateSa': return { ...state, Sa: !state.Sa }
        default: return state;
    }
}

export const ResultAccountsScreen = ({ navigation, route: { params: { accounts, end, report, start, keys, typeAccount } } }: Props) => {
    const { theme: { colors, fonts, roundness, dark } } = useAppSelector(state => state.app);

    const { data, isLoading, isFetching, refetch } = useReport({ accounts: [...accounts], dateStart: start, dateEnd: end, type: report, typeAccount, key: JSON.stringify(accounts.sort()) });

    const [filterData, setFilterData] = useState<typeof data>();
    const queryClient = useQueryClient();
    const keyQuery = ["Events", String(accounts), report, start, end];


    const [stateBB, dispatchBB] = useReducer(reducerBB, initialStateBB);//Problemas de baterias
    const [stateState, dispatchState] = useReducer(reducerState, initialStateState);//Estado de sucursales

    const colorSR: string = colors.danger;
    const colorCR: string = colors.warning;
    const colorSE: string = colors.success;

    const colorA: string = colors.success;
    const colorC: string = colors.danger;
    const colorS: string = colors.warning;


    useEffect(() => {
        setFilterData(data);
    }, [data]);

    useEffect(() => {
        if (data) {
            const filter = Object.entries(stateBB).filter(a => a[1]).map(a => a[0].replace('_', '-'));
            const a = data.cuentas?.filter(a => (filter.find(f => a.estado === f) !== undefined));
            setFilterData({ ...data, cuentas: a })
        }
    }, [stateBB]);

    useEffect(() => {
        if (data) {
            const filter = Object.entries(stateState).filter(a => a[1]).map(a => (a[0] === 'Ap' ? 'apert' : a[0] === 'Ci' ? 'cier' : 'se'));
            const res = data.cuentas?.filter(acc => {
                return filter.find(f => {
                    if (f === 'apert' || f === 'cier') {
                        if (acc.eventos && acc.eventos[0].DescripcionEvent.toLowerCase().includes(f)) return acc;
                    } else {
                        if (!acc.eventos) return acc
                    }
                });
            });
            setFilterData({ ...data, cuentas: res });
        }
    }, [stateState]);

    const _renderPercentajes = useCallback(() => {
        if (data && data.percentajes) {
            const { percentajes } = data;
            return (
                <View style={{ paddingVertical: 5 }}>
                    <ScrollView horizontal alwaysBounceHorizontal contentContainerStyle={[{ marginLeft: 5 }]} showsHorizontalScrollIndicator={false}>
                        {Object.entries(percentajes).map((el, idx) => {
                            const { label, total, percentaje, text, events }: percentaje = el[1];
                            const title: string = label ?? el[0];

                            return (
                                <TargetPercentaje
                                    key={JSON.stringify(el)}
                                    max={100}
                                    text={title}
                                    percentage={percentaje}
                                    amount={`${events}/${total}`}
                                    textLarge={text}
                                    icon={
                                        (el[0] === 'sinRestaure') ? { name: 'alert-circle', backgroundColor: colorSR }
                                            : (el[0] === 'conRestaure') ? { name: 'alert', backgroundColor: colorCR }
                                                : (el[0] === 'abiertas') ? { name: 'lock-open', backgroundColor: colorA }
                                                    : (el[0] === 'cerradas') ? { name: 'lock', backgroundColor: colorC }
                                                        : (el[0] === 'sinEstado') ? { name: 'alert', backgroundColor: colorS }
                                                            : (el[0] === 'Aperturas') ? { name: 'lock-open', backgroundColor: colorA }
                                                                : (el[0] === 'Cierres') ? { name: 'lock', backgroundColor: colorC }
                                                                    : { name: 'check', backgroundColor: colorSE }
                                    } />
                            )
                        })}
                    </ScrollView>
                </View>
            )
        } else { return undefined }
    }, [filterData]);

    const _renderHead = useCallback(() => {
        const sizeName: number = 200;
        if (filterData && filterData.fechas) {
            const tam = new Array(filterData.fechas.length).fill({ size: 100, center: true });
            const days = filterData.fechas.map(a => getDay(modDate({ dateI: new Date(a) }).weekday));
            const ApCi = new Array(tam.length).fill(['AP', 'CI']);

            return (
                <>
                    <Row key={'days'} tamCol={[{ size: 30 }, { size: sizeName }, ...tam]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase', color: colors.text }} fontSize={11 + 2} data={['', '', ...filterData.fechas]} />
                    <Row key={'nameDays'} tamCol={[{ size: 30 }, { size: sizeName }, ...tam]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase', color: colors.text }} fontSize={11 + 2} data={['', '', ...days]} />
                    <Row key={'header'} style={{ borderBottomWidth: 1, borderColor: Color(colors.text).fade(.9).toString() }} tamCol={[{ size: 30, center: true }, { size: sizeName }, ...tam]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase', color: colors.text }} fontSize={11 + 2} data={['#', 'Nombre', ...ApCi]} />
                </>
            )
        }
        return undefined;
    }, [filterData, colors]);

    const _renderDataDays = useCallback(() => {
        const sizeName: number = 200;
        if (filterData && filterData.fechas) {
            const tam = new Array(filterData.fechas.length).fill({ size: 100, center: true });
            const SN = new Array(filterData.fechas.length).fill(['--:--', '--:--']);
            return (
                <>
                    {
                        filterData.cuentas?.map((acc, idx) => {
                            if (acc.eventos) {
                                const test = filterData.fechas?.map(day => {
                                    const perDay = acc.eventos?.filter(ev => ev.FechaOriginal === day);
                                    if (perDay !== undefined) {
                                        if (perDay.length === 0) {
                                            return ['--:--', '--:--'];
                                        }
                                        if (perDay.length === 1) {
                                            return (perDay[0].DescripcionEvent.toLowerCase().includes('apert')) ? [perDay[0].Hora.slice(0, 5), '--:--'] : ['--:--', perDay[0].Hora.slice(0, 5)];
                                        }
                                        if (perDay.length > 1) {
                                            let ap: string = '--:--';
                                            let ci: string = '--:--';
                                            const test = perDay.map(s => {
                                                if (s.DescripcionEvent.toLowerCase().includes('apert')) {
                                                    if (ap === '--:--') {
                                                        ap = s.Hora.slice(0, 5);
                                                    }
                                                } else if (s.DescripcionEvent.toLowerCase().includes('cierr')) {
                                                    ci = s.Hora.slice(0, 5);
                                                }
                                                return [ap, ci]
                                            });
                                            return test[test.length - 1];
                                        }
                                    }
                                    return '';
                                });
                                return (
                                    <Row key={(idx + 1) + acc.CodigoCte} styleLabel={{ color: colors.text }} style={{ borderBottomWidth: 1, borderColor: Color(colors.text).fade(.9).toString() }} data={[`${idx + 1}`, acc.Nombre, ...test ?? []]} fontSize={11} tamCol={[{ size: 30, center: true }, { size: sizeName }, ...tam]} />
                                )
                            } else {
                                return (
                                    <Row key={(idx + 1) + acc.CodigoCte} styleLabel={{ color: colors.text }} style={{ borderBottomWidth: 1, borderColor: Color(colors.text).fade(.9).toString() }} data={[`${idx + 1}`, acc.Nombre, ...SN]} fontSize={11} tamCol={[{ size: 30, center: true }, { size: sizeName }, ...tam]} />
                                )
                            }
                        })
                    }
                    <Row key={'days'} tamCol={[]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase' }} fontSize={10} data={['']} />
                </>
            )
        }
        return undefined;
    }, [filterData, colors, dark, Color]);

    const _renderTables = useCallback((report: TypeReport) => {
        if (filterData)
            if (report === 'apci-week') {
                return (
                    <View style={[styles.container, { backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background }]}>
                        <ScrollView horizontal={true}>
                            <View>
                                {_renderHead()}
                                <ScrollView >
                                    {_renderDataDays()}
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
                )
            }
        if (report === 'ap-ci' || report === 'event-alarm') {
            if (filterData?.cuentas) {
                return (
                    <View style={{ paddingVertical: 5 }}>
                        <SectionList
                            sections={filterData.cuentas.map(acc => { return { title: { name: acc.Nombre, address: acc.Direccion, ref: createRef<ScrollView>() }, data: [{ events: acc.eventos ?? [] }] } })}
                            renderItem={({ item, section }) => {
                                return (
                                    <Table
                                        scrollRefHeader={section.title.ref}
                                        Data={item.events}
                                        /**@ts-ignore */
                                        titles={keys}
                                        fontSize={10}
                                        isShowHeader={false}
                                        colorBackgroundTable={dark ? Color(colors.background).darken(.4).toString() : colors.background}
                                        showIndices
                                    />
                                )
                            }}
                            renderSectionHeader={({ section }) => (
                                <View style={{ marginHorizontal: 10, backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background, borderRadius: roundness }}>
                                    <Text style={{ paddingHorizontal: 5, color: colors.text }}>{section.title.name}</Text>
                                    <Text style={{ paddingHorizontal: 5, color: colors.text }}>{section.title.address}</Text>
                                    <ScrollView ref={section.title.ref} horizontal showsHorizontalScrollIndicator={false}>
                                        <Row
                                            data={keys.map(r => r.label)}
                                            tamCol={keys.map(s => { return { size: s.size ?? 50, center: s.center } })}
                                            fontSize={13}
                                            styleLabel={{ padding: 0, margin: 0, color: colors.text, textTransform: 'uppercase' }} />
                                    </ScrollView>
                                </View>
                            )}
                            keyExtractor={(item, idx) => `${idx}`}
                            stickySectionHeadersEnabled
                        />
                    </View>
                )
            }
            return undefined;
        }
        return undefined;
    }, [filterData, keys, colors, roundness, dark]);

    const _renderCards = useCallback(() => {
        let shadowColor: string = colors.primary;
        const _renderItem = ({ index, item, separators }: ListRenderItemInfo<Account>) => {
            if (report === 'batery')
                return (
                    <View style={[styles.item, {
                        borderRadius: roundness * 2,
                        backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background

                    }]}>
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                            <Text style={[fonts.titleSmall, { color: colors.text, flex: 1 }]}>#</Text>
                            <Text style={{ flex: 1, textAlign: 'right', paddingRight: 10, color: colors.text }}>{index + 1}</Text>
                        </View>
                        {keys.map(({ key, label }, idx) => {
                            const color = (item['estado'] === BatteryStatus.ERROR) ? colorSR : (item['estado'] === BatteryStatus.RESTORE) ? colorCR : (item['estado'] === BatteryStatus.WITHOUT_EVENTS) ? colorSE : undefined
                            return (
                                <View key={idx + label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                                    <Text style={[fonts.titleSmall, { flex: 1, color: colors.text }, label === 'Estado' && { color }]}>{label}</Text>
                                    <Text adjustsFontSizeToFit numberOfLines={2} style={[{
                                        flex: 1,
                                        textAlign: 'right',
                                        color: colors.text
                                    }, label === 'Estado' && { color }]} > {
                                            /*@ts-ignore */
                                            Array.isArray(key) ? 'arr' : item[key]
                                        }</Text>
                                </View>
                            )
                        }
                        )}
                    </View>
                )
            if (report === 'state')
                return (
                    <View style={[styles.item, {
                        borderRadius: roundness * 2,
                        backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background
                    }]}>
                        <View key={index + 1} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                            <Text style={[fonts.titleSmall, { color: colors.text, flex: 1 }]}>#</Text>
                            <Text style={{ flex: 1, textAlign: 'right', paddingRight: 10, color: colors.text }}>{index + 1}</Text>
                        </View>
                        <View key={index + item.CodigoAbonado} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                            <Text style={[fonts.titleSmall, { flex: 1, color: colors.text }]}>Abonado</Text>
                            <Text adjustsFontSizeToFit numberOfLines={2} style={{ flex: 1, textAlign: 'right', paddingRight: 10, color: colors.text }}>{item.CodigoAbonado}</Text>
                        </View>
                        <View key={index + item.Nombre} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                            <Text style={[fonts.titleSmall, { flex: 1, color: colors.text }]}>Nombre</Text>
                            <Text adjustsFontSizeToFit numberOfLines={2} style={{ flex: 1, textAlign: 'right', paddingRight: 10, color: colors.text }}>{item.Nombre}</Text>
                        </View>
                        {keys.map(({ key, label }, idx) => {
                            if ((item.eventos && item.eventos[0])) {
                                if (item.eventos[0].DescripcionEvent.toLocaleLowerCase().includes('cier')) shadowColor = colorC;
                                else shadowColor = colorA;
                            } else {
                                shadowColor = colors.notification;
                            }
                            return (
                                <View key={idx + label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                                    <Text style={[fonts.titleSmall, { flex: 1, color: colors.text }, label === 'Estado' && { color: shadowColor }]}>{label}</Text>
                                    {
                                        (item.eventos && item.eventos[0])
                                            ?
                                            <Text style={[fonts.titleSmall, { flex: 1, textAlign: 'right', color: colors.text }, label === 'Estado' && { color: shadowColor }]}>
                                                {
                                                    /**@ts-ignore */
                                                    Array.isArray(key) ? key.map(k => item.eventos[0][k]) : item.eventos[0][key]
                                                }</Text>
                                            : <Text style={[{ color: colors.text }, label === 'Estado' && { color: shadowColor }]}>----</Text>
                                    }
                                </View>
                            )
                        }
                        )}
                        <View key={index + 'button'} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                            <Text style={[fonts.titleSmall, { color: colors.text, flex: 1 }]}>{ }</Text>
                            <Button
                                contentStyle={{ marginVertical: 4 }}
                                labelStyle={[fonts.bodySmall, { textTransform: 'capitalize', fontWeight: 'bold' }]}
                                mode='contained-tonal'
                                text='Detalles'
                                colorPressed={Color(colors.primary).fade(.8).toString()}
                                onPress={() => { }}
                            />
                        </View>
                    </View>
                )
            return <></>
        };

        const _renderSearchBar = useCallback(() => {
            return (
                <View style={[{ flex: 1, marginRight: 5 }]}>
                    <TextInput
                        containerStyle={[stylesApp.shadow, {
                            elevation: 2,
                            backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background,
                            borderBottomWidth: 0,
                            borderRadius: roundness,
                            shadowRadius: roundness
                        }]}
                        inputStyle={[
                            fonts.bodyLarge,
                            {
                                color: colors.text,
                            }
                        ]}
                        iconLeft='magnify'
                        placeholder='Buscar cuenta'
                        placeholderTextColor={Color(colors.text).fade(.5).toString()}
                    />
                </View>
            )
        }, [colors, Color, roundness, dark, stylesApp]);

        const _renderButtonsBB = useCallback(() => {
            if (report === 'batery') {
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, marginHorizontal: 7 }}>
                        {_renderSearchBar()}
                        <IconButton
                            style={[{ padding: 3, borderColor: colorSR, borderWidth: .2, marginHorizontal: 3 }]}
                            color={stateBB.ERROR ? colors.background : colorSR}
                            iconsize={30}
                            name={'alert-circle'}
                            onPress={() => dispatchBB('updateERROR')}
                            colorActive={colorSR}
                            active={stateBB.ERROR}
                        />
                        <IconButton
                            style={[{ padding: 3, borderColor: colorCR, borderWidth: .2, marginHorizontal: 3 }]}
                            color={stateBB.RESTORE ? colors.background : colorCR}
                            iconsize={30}
                            name={'alert'}
                            onPress={() => dispatchBB('updateRESTORE')}
                            colorActive={colorCR}
                            active={stateBB.RESTORE}
                        />
                        <IconButton
                            style={[{ padding: 3, borderColor: colorSE, borderWidth: .2, marginHorizontal: 3 }]}
                            color={stateBB.WITHOUT_EVENTS ? colors.background : colorSE}
                            iconsize={30}
                            name={'check'}
                            onPress={() => dispatchBB('updateWITHOUT_EVENTS')}
                            colorActive={colorSE}
                            active={stateBB.WITHOUT_EVENTS}
                        />
                    </View>
                )
            }
            return undefined;
        }, [stateBB, report, colorCR, colorSR, colorSE, colors, dark]);

        const _renderButtonsState = useCallback(() => {
            if (report === 'state') {
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, marginHorizontal: 7 }}>
                        {_renderSearchBar()}
                        <IconButton
                            style={[{ padding: 3, borderColor: colorA, borderWidth: .2, marginHorizontal: 3 }]}
                            color={stateState.Ap ? colors.background : colorA}
                            name={'lock-open'}
                            onPress={() => dispatchState('updateAp')}
                            colorActive={colorA}
                            active={stateState.Ap}
                        />
                        <IconButton
                            style={[{ padding: 3, borderColor: colorC, borderWidth: .2, marginHorizontal: 3 }]}
                            color={stateState.Ci ? colors.background : colorC}
                            name={'lock'}
                            onPress={() => dispatchState('updateCi')}
                            colorActive={colorC}
                            active={stateState.Ci}
                        />
                        <IconButton
                            style={[{ padding: 3, borderColor: colorS, borderWidth: .2, marginHorizontal: 3 }]}
                            color={stateState.Sa ? colors.background : colorS}
                            name={'alert'}
                            onPress={() => dispatchState('updateSa')}
                            colorActive={colorS}
                            active={stateState.Sa}
                        />
                    </View>
                )
            }
            return undefined;
        }, [stateState, report, dark, colorA, colorS, colorC, colors, roundness, fonts, Color]);

        return (
            <>
                {_renderButtonsBB()}
                {_renderButtonsState()}
                <Animated.FlatList
                    data={filterData?.cuentas ?? []}
                    renderItem={_renderItem}
                    keyExtractor={(_, idx) => `${idx}`}
                    ListEmptyComponent={<Text style={[fonts.titleMedium, { textAlign: 'center' }]}>Sin coincidencias</Text>}
                // onScroll={Animated.event(
                //     [{ nativeEvent: { contentOffset: { x: ScrollY } } }],
                //     { useNativeDriver: true }
                // )}
                />
            </>
        )
    }, [filterData, stateBB, stateState, keys, colors, fonts, dark]);

    return (
        <>
            {(isLoading || isFetching) && <Loading />}
            <AppBar
                left={
                    <IconButton name='arrow-left'
                        style={{ marginLeft: 10 }}
                        iconsize={30}
                        onPress={() => {
                            queryClient.removeQueries({ queryKey: keyQuery })
                            navigation.goBack()
                        }}
                        color={colors.primary}
                    />
                }
                label={
                    report === 'ap-ci' ? 'APERTURA Y CIERRE'
                        : (report === 'event-alarm') ? 'EVENTO DE ALARMA'
                            : (report === 'batery') ? 'PROBLEMAS DE BATERÍAS'
                                : (report === 'state') ? 'ESTADO DE SUCURSALES'
                                    : (report === 'apci-week') ? 'HORARIO DE APERTURAS Y CIERRES'
                                        : ''}
                right={
                    <View style={{ marginRight: 10 }}>
                        <Menu
                            options={
                                [
                                    ...(report === 'apci-week') ? [
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
                                        }
                                    ] : [],
                                    // {
                                    //     icon: (view === 'default') ? 'table' : 'table-row',
                                    //     label: (view === 'default') ? 'Visualizar tabla' : 'Visualizar cards',
                                    //     onPress: () => (view === 'default') ? setView('table') : setView('default'),
                                    // },
                                    {
                                        icon: 'refresh',
                                        label: 'Recargar',
                                        onPress: () => refetch(),
                                    },
                                ]
                            }
                        />
                    </View>
                }
            />
            <View style={{ flex: 1, margin: 5 }}>
                <Text style={[{ borderLeftWidth: 3, borderColor: colors.primary, color: colors.text }, fonts.titleMedium]}>  {(data?.nombre) ? data.nombre : 'Grupo personalizado, cuentas individuales'}</Text>
                {_renderPercentajes()}
                {(report === 'state' || report === 'batery') ? _renderCards() : _renderTables(report)}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 5,
        margin: 5,
        ...stylesApp.shadow,
        elevation: 2,
        // borderWidth: 1
    },
    container: {
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 5,
        marginVertical: 5,
        ...stylesApp.shadow,
        elevation: 2,
    },
    textTitlesHeader: {
        paddingHorizontal: 5,
        fontWeight: 'bold'
    },
});