import { StackScreenProps } from '@react-navigation/stack';
import React, { createRef, useCallback, useEffect, useReducer, useState } from 'react';
import { View, SectionList, ScrollView, Platform, Animated, ListRenderItemInfo, StyleSheet, Text } from 'react-native';
import { Appbar, Button, IconButton, Searchbar, Surface, TextInput, } from 'react-native-paper';
import { useAppSelector } from '../../app/hooks';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Loading } from '../../components/Loading';
import Table from '../../components/table/Table';
import { useReport } from '../../hooks/useQuery';
import { Row } from '../../components/table/Row';
import { HeaderTableValues, TypeReport } from '../../types/types';
import { TargetPercentaje } from '../../components/TargetPercentaje';
import Color from 'color';
import { Menu, _renderModalMenu } from '../../components/select/Menu';
import { Account, BatteryStatus } from '../../interfaces/interfaces';
import { stylesApp } from '../../App';
import { colors } from '../../config/colors';
import { baseUrl } from '../../api/Api';
import { color } from 'react-native-reanimated';
import { getDay, modDate } from '../../functions/functions';
import moment from 'moment';
import { at } from 'lodash';
import { ta } from 'date-fns/locale';
import id from 'date-fns/esm/locale/id/index.js';

interface Props extends StackScreenProps<rootPrivateScreens, 'ResultAccountsScreen'> { };

// const TitlesApCi: HeaderTableValues = [
//     { title: 'Fecha', keys: ['FechaOriginal'], center: true, size: 75 },
//     { title: 'Hora', keys: ['Hora'], center: true, size: 60 },
//     { title: 'Evento', keys: ['DescripcionEvent'], center: true, size: 100 },
//     { title: 'Part', keys: ['Particion'], center: true, size: 40 },
//     { title: '#Usu', keys: ['CodigoUsuario'], center: true, size: 35 },
//     { title: 'Nombre', keys: ['NombreUsuario'], center: true, size: 200 },
// ];

// const TitlesEA: HeaderTableValues = [
//     { title: 'Fecha', keys: ['FechaOriginal'], center: true, size: 75 },
//     { title: 'Hora', keys: ['Hora'], center: true, size: 60 },
//     { title: 'Evento', keys: ['DescripcionEvent'], center: true, size: 100 },
//     { title: 'Part', keys: ['Particion'], center: true, size: 40 },
//     { title: '#Usu', keys: ['CodigoUsuario'], center: true, size: 35 },
//     { title: '#Zona', keys: ['CodigoZona'], center: true, size: 40 },
//     { title: 'Nombre', keys: ['NombreUsuario', 'DescripcionZona'], center: true, size: 200 },
// ];

// export const ResultQueryScreen = ({ navigation, route }: Props) => {
//     const { params: { props: { accounts, start, end } } } = route;
//     const { theme: { colors, roundness, fonts } } = useAppSelector(state => state.app);
//     const [visible, setVisible] = React.useState<boolean>(false);
//     const [report, setReport] = useState<TypeReport>(route.params.props.report);
//     const [titles, setTitles] = useState<HeaderTableValues>([]);
//     const [key, setkey] = useState(accounts.length === 1 ? accounts[0].CodigoCte : 'Accounts');
//     const queryClient = useQueryClient();

//     useEffect(() => {
//         setVisible(false);
//         if (report === 'ApCi') {
//             setTitles(TitlesApCi);
//         } else {
//             setTitles(TitlesEA);
//         }
//     }, [report]);

//     const { isLoading, isFetching, data, refetch, error, isSuccess } = useEvents({
//         key,
//         accounts: accounts.map(acc => parseInt(acc.CodigoCte)),
//         dateStart: start,
//         dateEnd: end,
//         type: report,
//         typeAccount: 1
//     });

//     const _renderTable = useCallback(() => {
//         if (data && data.cuentas?.length === 1) {
//             return (
//                 <View style={{ flex: 1 }}>
//                     {(data.cuentas[0].percentajes) && <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
//                         {
//                             (report === 'ApCi') ?
//                                 <>
//                                     <TarjetPercentaje
//                                         text='Aperturas'
//                                         max={100}
//                                         percentag//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//                                     />
//                                     <TarjetPercentaje
//                                         text='Cierres'
//                                         max={100}
//                                         percentage={data.cuentas[0].percentajes?.Cierre}
//                                         icon={{ name: 'lock-open', backgroundColor: 'red' }}
//                                         textLarge='Cierres recibidas'
//                                     />
//                                 </>
//                                 : (report === 'EA') ?
//                                     <>
//                                         <TarjetPercentaje
//                                             text='Aperturas'
//                                             max={100}
//                                             percentage={data.cuentas[0].percentajes?.Apertura}
//                                         // icon={{ name: 'lock-open', backgroundColor: 'green' }}
//                                         />
//                                         <TarjetPercentaje
//                                             text='Cierres'
//                                             max={100}
//                                             percentage={data.cuentas[0].percentajes?.Cierre}
//                                         // icon={{ name: 'lock-open', backgroundColor: 'green' }}
//                                         />
//                                         <TarjetPercentaje
//                                             text='Alarma'
//                                             max={100}
//                                             percentage={data.cuentas[0].percentajes?.Alarma}
//                                         // icon={{ name: 'lock-open', backgroundColor: 'green' }}
//                                         />
//                                         <TarjetPercentaje
//                                             text='Pruebas'
//                                             max={100}
//                                             percentage={data.cuentas[0].percentajes?.Pruebas}
//                                         // icon={{ name: 'lock-open', backgroundColor: 'green' }}
//                                         />
//                                         <TarjetPercentaje
//                                             text='Bateria'
//                                             max={100}
//                                             percentage={data.cuentas[0].percentajes?.Bateria}
//                                         // icon={{ name: 'lock-open', backgroundColor: 'green' }}
//                                         />
//                                         <TarjetPercentaje
//                                             text='Otros'
//                                             max={100}
//                                             percentage={data.cuentas[0].percentajes?.Otros}
//                                         // icon={{ name: 'lock-open', backgroundColor: 'green' }}
//                                         />
//                                     </>
//                                     : undefined
//                         }
//                     </View>}
//                     <Table
//                         Header={{ title: data.cuentas[0].Nombre.trim(), subtitle: data.cuentas[0].Direccion.trim() }}
//                         Data={data.cuentas[0].eventos}
//                         titles={titles}
//                         fontSize={10}
//                         pagination={{ iconBackgroundColor: colors.primaryContainer }}
//                         colorBackgroundTable={colors.background}
//                         showIndices
//                     />
//                 </View>
//             )
//         } else if (data?.cuentas) {
//             const test = data.cuentas.flatMap(a => { return { Nombre: a.Nombre, Direccion: a.Direccion, Eventos: a.eventos } })

//             return (
//                 <View style={{ paddingVertical: 5 }}>
//                     {/* <SectionList
//                         sections={data.cuentas.map(acc => { return { title: { name: acc.Nombre, address: acc.Direccion, ref: createRef<ScrollView>() }, data: [{ events: acc.eventos ?? [] }] } })}
//                         renderItem={({ item, section }) => {
//                             const ref = section.title.ref;
//                             return (
//                                 <Table
//                                     scrollRefHeader={ref}
//                                     Data={item.events}
//                                     titles={titles}
//                                     fontSize={10}
//                                     isShowHeader={false}
//                                     colorBackgroundTable={colors.background}
//                                     showIndices
//                                 />
//                             )
//                         }}
//                         renderSectionHeader={({ section }) => (
//                             <Surface elevation={1} style={{ marginHorizontal: 10, backgroundColor: colors.background, borderRadius: roundness }}>
//                                 <Text style={{ paddingHorizontal: 5 }}>{section.title.name}</Text>
//                                 <Text style={{ paddingHorizontal: 5 }}>{section.title.address}</Text>
//                                 <ScrollView ref={section.title.ref} horizontal showsHorizontalScrollIndicator={false}>
//                                     <Row data={titles.map(r => r.title)} tamCol={titles.map(s => { return { size: s.size ?? 50, center: s.center } })} fontSize={13} styleLabel={{ padding: 0, margin: 0 }} />
//                                 </ScrollView>
//                             </Surface>
//                         )}
//                         keyExtractor={(item, idx) => `${idx * .333}`}
//                         stickySectionHeadersEnabled
//                     /> */}
//                     {/* <Table
//                         // scrollRefHeader={ref}
//                         Data={test}
//                         titles={titles}
//                         fontSize={10}
//                         colorBackgroundTable={colors.background}
//                         showIndices
//                     /> */}
//                 </View>
//             )
//         }
//         return undefined;
//     }, [data, titles]);

//     return (
//         <View style={{ flex: 1 }}>
//             <Appbar.Header mode='small' theme={{ colors: { surface: colors.background } }}
//                 style={{ borderBottomWidth: 1, borderColor: Color(colors.primary).alpha(.1).toString(), height: Platform.OS === 'ios' ? 44 : 56 }}>
//                 <Appbar.BackAction onPress={() => { navigation.goBack() }} />
//                 <Appbar.Content titleStyle={[fonts.bodyLarge, { fontWeight: 'bold' }]} title={report === 'ApCi' ? 'APERTURA Y CIERRE' : 'EVENTO DE ALARMA'} />
//                 <Menu
//                     options={[

//                         {
//                             label: 'Cambiar reporte',
//                             icon: 'swap-horizontal',
//                             onPress: () => setVisible(true),
//                         },
//                         {
//                             label: 'Descargar reporte',
//                             icon: 'file-download-outline',

//                             onPress: () => { },
//                         },
//                         {
//                             label: 'Actualizar',
//                             icon: 'refresh',
//                             onPress: () => refetch(),
//                         },
//                     ]}
//                 />
//             </Appbar.Header>

//             <View style={{ flex: 1 }}>
//                 {(isLoading || isFetching) && <Loading />}
//                 {_renderTable()}
//             </View>

//             {_renderModalMenu({
//                 open: visible,
//                 setOpen: setVisible,
//                 options: [

//                     {
//                         label: 'APERTURA Y CIERRE',
//                         icon: 'file-outline',
//                         onPress: () => {
//                             setReport('ApCi');
//                             setVisible(false);
//                             setTitles(TitlesApCi);
//                             queryClient.removeQueries(['Events', key]);
//                         },
//                     },
//                     {
//                         label: 'EVENTO DE ALARMA',
//                         icon: 'file-outline',

//                         onPress: () => {
//                             setReport('EA');
//                             setVisible(false);
//                             setTitles(TitlesEA);
//                             queryClient.removeQueries(['Events', key]);
//                         },
//                     },
//                 ],
//             })}
//         </View >
//     );
// };
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
    const { theme: { colors, fonts, roundness } } = useAppSelector(state => state.app);

    const { data, isLoading, isFetching, refetch } = useReport({ accounts: [...accounts], dateStart: start, dateEnd: end, type: report, typeAccount, key: JSON.stringify(accounts.sort()) });

    const [filterData, setFilterData] = useState<typeof data>();

    const [stateBB, dispatchBB] = useReducer(reducerBB, initialStateBB);//Problemas de baterias
    const [stateState, dispatchState] = useReducer(reducerState, initialStateState);//Estado de sucursales

    const colorSR: string = colors.error;
    const colorCR: string = '#eeb715';
    const colorSE: string = 'green';

    const colorA: string = 'green';
    const colorC: string = colors.error;
    const colorS: string = colors.notification;


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
                <View style={{ marginVertical: 5 }}>
                    <View>
                        <ScrollView horizontal alwaysBounceHorizontal contentContainerStyle={{ marginHorizontal: 15 }} showsHorizontalScrollIndicator={false}>
                            {Object.entries(percentajes).map((el, idx) => (
                                <TargetPercentaje
                                    key={JSON.stringify(el)}
                                    max={100}
                                    text={
                                        (el[0] === 'sinRestaure') ? 'Sin restaure'
                                            : (el[0] === 'conRestaure') ? 'Con Restaure'
                                                : (el[0] === 'abiertas') ? 'Abiertas'
                                                    : (el[0] === 'cerradas') ? 'Cerradas'
                                                        : (el[0] === 'sinEstado') ? 'Sin Estado'
                                                            : 'sin Eventos'}
                                    percentage={el[1]}
                                    style={{ marginHorizontal: 5, marginRight: idx === Object.entries(percentajes).length - 1 ? 30 : 0 }}
                                    icon={
                                        (el[0] === 'sinRestaure') ? { name: 'alert-circle', backgroundColor: colorSR }
                                            : (el[0] === 'conRestaure') ? { name: 'alert', backgroundColor: colorCR }
                                                : (el[0] === 'abiertas') ? { name: 'lock-open', backgroundColor: colorA }
                                                    : (el[0] === 'cerradas') ? { name: 'lock', backgroundColor: colorC }
                                                        : (el[0] === 'sinEstado') ? { name: 'alert', backgroundColor: colorS }
                                                            : { name: 'check', backgroundColor: colorSE }
                                    } />
                            ))}
                        </ScrollView>
                    </View>
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
                    <Row key={'days'} tamCol={[{ size: 30 }, { size: sizeName }, ...tam]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase' }} fontSize={11 + 2} data={['', '', ...filterData.fechas]} />
                    <Row key={'nameDays'} tamCol={[{ size: 30 }, { size: sizeName }, ...tam]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase' }} fontSize={11 + 2} data={['', '', ...days]} />
                    <Row key={'header'} style={{ borderBottomWidth: 1, borderColor: colors.primaryContainer }} tamCol={[{ size: 30, center: true }, { size: sizeName }, ...tam]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase' }} fontSize={11 + 2} data={['#', 'Nombre', ...ApCi]} />
                </>
            )
        }
        return undefined;
    }, [filterData]);

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
                                    <Row key={(idx + 1) + acc.CodigoCte} style={{ borderBottomWidth: 1, borderColor: colors.primaryContainer }} data={[`${idx + 1}`, acc.Nombre, ...test ?? []]} fontSize={11} tamCol={[{ size: 30, center: true }, { size: sizeName }, ...tam]} />
                                )
                            } else {
                                return (
                                    <Row key={(idx + 1) + acc.CodigoCte} style={{ borderBottomWidth: 1, borderColor: colors.primaryContainer }} data={[`${idx + 1}`, acc.Nombre, ...SN]} fontSize={11} tamCol={[{ size: 30, center: true }, { size: sizeName }, ...tam]} />
                                )
                            }
                        })
                    }
                    <Row key={'days'} tamCol={[]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase' }} fontSize={10} data={['']} />
                </>
            )
        }
        return undefined;
    }, [filterData]);

    const _renderTables = useCallback((report: TypeReport) => {
        if (filterData)
            if (report === 'apci-week') {
                return (
                    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
                                        colorBackgroundTable={colors.background}
                                        showIndices
                                    />
                                )
                            }}
                            renderSectionHeader={({ section }) => (
                                <Surface elevation={1} style={{ marginHorizontal: 10, backgroundColor: colors.background, borderRadius: roundness }}>
                                    <Text style={{ paddingHorizontal: 5 }}>{section.title.name}</Text>
                                    <Text style={{ paddingHorizontal: 5 }}>{section.title.address}</Text>
                                    <ScrollView ref={section.title.ref} horizontal showsHorizontalScrollIndicator={false}>
                                        <Row data={keys.map(r => r.label)} tamCol={keys.map(s => { return { size: s.size ?? 50, center: s.center } })} fontSize={13} styleLabel={{ padding: 0, margin: 0 }} />
                                    </ScrollView>
                                </Surface>
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
    }, [filterData, keys]);

    const _renderCards = useCallback(() => {
        let shadowColor: string = colors.primary;
        const _renderItem = ({ index, item, separators }: ListRenderItemInfo<Account>) => {
            if (report === 'batery')
                return (
                    <View style={[styles.item, {
                        borderRadius: roundness * 2,
                        backgroundColor: colors.background

                    }]}>
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                            <Text style={[fonts.titleSmall, { color: colors.text, flex: 1 }]}>#</Text>
                            <Text style={{ flex: 1, textAlign: 'right', paddingRight: 10 }}>{index + 1}</Text>
                        </View>
                        {keys.map(({ key, label }, idx) => {
                            const color = (item['estado'] === BatteryStatus.ERROR) ? colorSR : (item['estado'] === BatteryStatus.RESTORE) ? colorCR : (item['estado'] === BatteryStatus.WITHOUT_EVENTS) ? colorSE : undefined
                            return (
                                <View key={idx + label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                                    <Text style={[fonts.titleSmall, { flex: 1 }, label === 'Estado' ? { color } : {}]}>{label}</Text>
                                    <Text adjustsFontSizeToFit numberOfLines={2} style={[{
                                        flex: 1,
                                        textAlign: 'right',
                                    }, label === 'Estado' ? { color } : {}]} > {
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
                        backgroundColor: colors.background
                    }]}>
                        <View key={index + 1} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                            <Text style={[fonts.titleSmall, { color: colors.text, flex: 1 }]}>#</Text>
                            <Text style={{ flex: 1, textAlign: 'right', paddingRight: 10 }}>{index + 1}</Text>
                        </View>
                        <View key={index + item.CodigoAbonado} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                            <Text style={[fonts.titleSmall, { flex: 1 }]}>Abonado</Text>
                            <Text adjustsFontSizeToFit numberOfLines={2} style={{ flex: 1, textAlign: 'right', paddingRight: 10 }}>{item.CodigoAbonado}</Text>
                        </View>
                        <View key={index + item.Nombre} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                            <Text style={[fonts.titleSmall, { flex: 1 }]}>Nombre</Text>
                            <Text adjustsFontSizeToFit numberOfLines={2} style={{ flex: 1, textAlign: 'right', paddingRight: 10 }}>{item.Nombre}</Text>
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
                                    <Text style={[fonts.titleSmall, { flex: 1 }, label === 'Estado' ? { color: shadowColor } : {}]}>{label}</Text>
                                    {
                                        (item.eventos && item.eventos[0])
                                            ?
                                            <Text style={[fonts.titleSmall, { flex: 1, textAlign: 'right' }, label === 'Estado' ? { color: shadowColor } : {}]}>
                                                {
                                                    /**@ts-ignore */
                                                    Array.isArray(key) ? key.map(k => item.eventos[0][k]) : item.eventos[0][key]
                                                }</Text>
                                            : <Text style={[label === 'Estado' ? { color: shadowColor } : {}]}>----</Text>
                                    }
                                </View>
                            )
                        }
                        )}
                        <View key={index + 'button'} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                            <Text style={[fonts.titleSmall, { color: colors.text, flex: 1 }]}>{ }</Text>
                            <Button onPress={() => { }}>Detalles</Button>
                        </View>
                    </View>
                )
            return <></>
        };

        const _renderButtonsBB = useCallback(() => {
            if (report === 'batery') {
                return (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 5 }}>
                        <Searchbar value='' style={{ flex: 1 }} />
                        <IconButton style={{ backgroundColor: stateBB.ERROR ? colorSR : undefined }} iconColor={stateBB.ERROR ? colors.background : colorSR} icon={'alert-circle'} onPress={() => dispatchBB('updateERROR')} />
                        <IconButton style={{ backgroundColor: stateBB.RESTORE ? colorCR : undefined }} iconColor={stateBB.RESTORE ? colors.background : colorCR} icon={'alert'} onPress={() => dispatchBB('updateRESTORE')} />
                        <IconButton style={{ backgroundColor: stateBB.WITHOUT_EVENTS ? colorSE : undefined }} iconColor={stateBB.WITHOUT_EVENTS ? colors.background : colorSE} icon={'check'} onPress={() => dispatchBB('updateWITHOUT_EVENTS')} />
                    </View>
                )
            }
            return undefined;
        }, [stateBB, report]);

        const _renderButtonsState = useCallback(() => {
            if (report === 'state') {
                return (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 5 }}>
                        <Searchbar value='' style={{ flex: 1 }} />
                        <IconButton style={{ backgroundColor: stateState.Ap ? colorA : undefined }} iconColor={stateState.Ap ? colors.background : colorA} icon={'lock-open'} onPress={() => dispatchState('updateAp')} />
                        <IconButton style={{ backgroundColor: stateState.Ci ? colorC : undefined }} iconColor={stateState.Ci ? colors.background : colorC} icon={'lock'} onPress={() => dispatchState('updateCi')} />
                        <IconButton style={{ backgroundColor: stateState.Sa ? colorS : undefined }} iconColor={stateState.Sa ? colors.background : colorS} icon={'alert'} onPress={() => dispatchState('updateSa')} />
                    </View>
                )
            }
            return undefined;
        }, [stateState, report]);

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
    }, [filterData, stateBB, stateState, keys]);

    return (
        <>
            {(isLoading || isFetching) && <Loading />}
            <Appbar.Header mode='small' theme={{ colors: { surface: colors.background } }}
                style={{ borderBottomWidth: 1, borderColor: Color(colors.primary).alpha(.1).toString(), height: Platform.OS === 'ios' ? 44 : 56 }}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content titleStyle={[fonts.bodyLarge, { fontWeight: 'bold' }]} title={
                    report === 'ap-ci' ? 'APERTURA Y CIERRE'
                        : (report === 'event-alarm') ? 'EVENTO DE ALARMA'
                            : (report === 'batery') ? 'PROBLEMAS DE BATERÍAS'
                                : (report === 'state') ? 'ESTADO DE SUCURSALES'
                                    : (report === 'apci-week') ? 'HORARIO DE APERTURAS Y CIERRES'
                                        : ''}
                />
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
            </Appbar.Header>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
                <Text style={[{ borderLeftWidth: 2, borderColor: colors.primary, color: colors.text }, fonts.bodyLarge]}>  {(data?.nombre) ? data.nombre : 'Grupo personalizado, cuentas individuales'}</Text>
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
        // borderWidth: 1
    },
    container: {
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        ...stylesApp.shadow
    },
    textTitlesHeader: {
        paddingHorizontal: 5,
        fontWeight: 'bold'
    },
});