import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { useReport } from '../../hooks/useQuery';
import { Loading } from '../../components/Loading';
import { Account, Events, percentaje, Orientation } from '../../interfaces/interfaces';
import { useAppSelector } from '../../app/hooks';
import Color from 'color';
import { stylesApp } from '../../App';
import { TargetPercentaje } from '../../components/TargetPercentaje';
import Table from '../../components/table/Table';
import { AppBar } from '../../components/AppBar';
import { IconButton } from '../../components/IconButton';
import { HandleContext } from '../../context/HandleContext';
import { useQueryClient } from '@tanstack/react-query';
import Text from '../../components/Text';

interface Props extends StackScreenProps<rootPrivateScreens, 'ResultAccountScreen'> { };
export const ResultAccountScreen = ({ navigation, route: { params: { account, end, report, start, keys, events, typeAccount } } }: Props) => {
    const { theme: { colors, fonts, roundness, dark } } = useAppSelector(state => state.app);

    const { data, isLoading, isFetching, refetch, error } = useReport({ accounts: [account.code], dateStart: start, dateEnd: end, type: report, typeAccount, key: String(account.code) });

    const [view, setView] = useState<'table' | 'default'>('default');

    const { handleError, orientation, downloadReport, isDownload } = useContext(HandleContext);
    const queryClient = useQueryClient();

    const _renderItem = ({ index, item, separators }: ListRenderItemInfo<Events>) => {
        return (
            <View style={[styles.item, { borderRadius: roundness * 2, backgroundColor: colors.background, shadowColor: colors.primary, flex: 1 }]}>
                {keys.map(({ key, label }, idx) => (
                    <View key={idx + label} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                        <Text style={[fonts.titleSmall, { color: colors.text }]}>{label}</Text>
                        <Text numberOfLines={3}> {Array.isArray(key) ? key.map(k => item[k]).join(' - ') : item[key]}  </Text>
                    </View>
                ))}
            </View>
        )
    };

    const _renderPercentajes = useCallback(() => {
        if (data && data.cuentas && orientation === Orientation.portrait) {
            if (data.cuentas.length === 1) {
                const { percentajes } = data;
                if (percentajes)
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
                                            amount={`${events}/${total}`}
                                            percentage={percentaje}
                                            textLarge={text}
                                            icon={
                                                (el[0] === 'Aperturas')
                                                    ? { name: 'lock-open', backgroundColor: colors.success }
                                                    : (el[0] === 'Cierres')
                                                        ? { name: 'lock', backgroundColor: colors.danger }
                                                        : (el[0] === 'APCI')
                                                            ? { name: 'security', backgroundColor: colors.success }
                                                            : (el[0] === 'Alarma')
                                                                ? { name: 'bell', backgroundColor: colors.danger }
                                                                : (el[0] === 'Pruebas')
                                                                    ? { name: 'cog', backgroundColor: colors.test }
                                                                    : (el[0] === 'Battery')
                                                                        ? { name: 'car-battery', backgroundColor: colors.warning }
                                                                        : { name: 'help', backgroundColor: colors.other }
                                            } />
                                    )
                                })}
                            </ScrollView>
                        </View>
                    )
                else return undefined;
            } else { return undefined }
        } else { return undefined }
    }, [data, colors, orientation]);

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

    useEffect(() => {
        if (error) handleError(String(error));
    }, [error])

    const Download = (withGrap?: boolean) => {
        downloadReport({
            data: {
                accounts: [account.code],
                showGraphs: withGrap ? true : false,
                typeAccount,
                dateStart: start,
                dateEnd: end
            },
            endpoint: (report === 'ap-ci') ? 'download-ap-ci' : 'download-event-alarm',
            fileName: `${(report === 'ap-ci') ? 'Apertura y cierre' : 'Evento de alarma'} ${start} ${end} ${account.name}.pdf`
        })
    }

    const keyQuery = ["Events", String(account), report, start, end];

    return (
        <>
            <Loading loading={isLoading} refresh={isFetching || isDownload} />
            <AppBar
                disabled={isLoading || isFetching || isDownload}
                style={{ paddingHorizontal: 10 }}
                menu={[
                    {
                        text: 'Descargar pdf con gráfica',
                        icon: 'file-pdf-box',
                        onPress: () => {
                            Download(true);
                        },
                        contentStyle: { ...styles.btnMenu }
                    },
                    {
                        text: 'Descargar pdf',
                        icon: 'file-pdf-box',
                        onPress: () => {
                            Download(true);
                        },
                        contentStyle: { ...styles.btnMenu }
                    },
                    view === 'default' ? {
                        text: 'ver tabla',
                        onPress: () => setView('table'),
                    } : {
                        text: 'ver lista',
                        onPress: () => setView('default'),
                    },
                    {
                        text: 'Recargar',
                        icon: 'refresh',
                        onPress: () => refetch(),
                        contentStyle: { ...styles.btnMenu }
                    },

                ]}>
                <IconButton name='arrow-left'
                    disabled={isLoading || isFetching || isDownload}
                    iconsize={28}
                    onPress={() => {
                        queryClient.removeQueries({ queryKey: keyQuery })
                        navigation.goBack();
                    }}
                    color={colors.primary}
                />
                <Text variant='titleMedium'>{report === 'ap-ci' ? 'APERTURA Y CIERRE' : 'EVENTO DE ALARMA'}</Text>
            </AppBar>
            <View style={{ flex: 1, margin: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant='titleMedium' adjustsFontSizeToFit style={[{ borderLeftWidth: 3, borderColor: colors.primary, color: colors.text }]}>  Entre las fechas {start} a {end}</Text>
                    <IconButton
                        disabled={isLoading || isFetching || isDownload}
                        style={{ marginHorizontal: 10 }}
                        name={(view === 'default') ? 'table' : 'table-row'}
                        onPress={() => (view === 'default') ? setView('table') : setView('default')}
                        color={colors.primary}
                    />
                </View>
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
    },
    btnMenu: {
        alignItems: 'flex-start',
        marginVertical: 5
    }
});