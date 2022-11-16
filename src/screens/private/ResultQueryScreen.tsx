import { StackScreenProps } from '@react-navigation/stack';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Switch, ActivityIndicator, Pressable, SectionList, ScrollView, Modal } from 'react-native';
import { Appbar, List, Menu, Surface, Text, TextInput, } from 'react-native-paper';
import { useAppSelector } from '../../app/hooks';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Loading } from '../../components/Loading';
import Table from '../../components/table/Table';
import { Events } from '../../interfaces/interfaces';
import { useEvents } from '../../hooks/Events';
import { Row } from '../../components/table/Row';
import { screenWidth } from '../../config/Dimensions';
import { HeaderTableValues, TypeReport } from '../../types/types';
import { TarjetPercentaje } from '../../components/TarjetPercentaje';

interface Props extends StackScreenProps<rootPrivateScreens, 'ResultQueryScreen'> { };

const TitlesApCi: HeaderTableValues = [
    { title: 'Fecha', keys: ['FechaOriginal'], center: true, size: 75 },
    { title: 'Hora', keys: ['Hora'], center: true, size: 60 },
    { title: 'Evento', keys: ['DescripcionEvent'], center: true, size: 100 },
    { title: 'Part', keys: ['Particion'], center: true, size: 40 },
    { title: '#Usu', keys: ['CodigoUsuario'], center: true, size: 35 },
    { title: 'Nombre', keys: ['NombreUsuario'], center: true, size: 200 },
];

const TitlesEA: HeaderTableValues = [
    { title: 'Fecha', keys: ['FechaOriginal'], center: true, size: 75 },
    { title: 'Hora', keys: ['Hora'], center: true, size: 60 },
    { title: 'Evento', keys: ['DescripcionEvent'], center: true, size: 100 },
    { title: 'Part', keys: ['Particion'], center: true, size: 40 },
    { title: '#Usu', keys: ['CodigoUsuario'], center: true, size: 35 },
    { title: '#Zona', keys: ['CodigoZona'], center: true, size: 40 },
    { title: 'Nombre', keys: ['NombreUsuario', 'DescripcionZona'], center: true, size: 200 },
];

export const ResultQueryScreen = ({ navigation, route }: Props) => {
    const { params: { props: { accounts, start, end } } } = route;
    const { theme: { colors, roundness, fonts } } = useAppSelector(state => state.app);
    const [visible, setVisible] = React.useState<boolean>(false);
    const [report, setReport] = useState<TypeReport>(route.params.props.report);
    const [titles, setTitles] = useState<HeaderTableValues>([]);
    const [key, setkey] = useState(accounts.length === 1 ? accounts[0].CodigoCte : 'Accounts');
    const queryClient = useQueryClient();

    const logError = (text: string) => Toast.show({ text1: 'Error', text2: text, type: 'error' });

    useEffect(() => {
        setVisible(false);
        if (report === 'ApCi') {
            setTitles(TitlesApCi);
        } else {
            setTitles(TitlesEA);
        }
    }, [report]);

    const { isLoading, isFetching, data, refetch, error, isSuccess } = useEvents({
        key,
        accounts: accounts.map(acc => parseInt(acc.CodigoCte)),
        dateStart: start,
        dateEnd: end,
        type: report,
        typeAccount: 1
    });

    useEffect(() => {
        if (error) logError(`${error}`);
    }, [error]);

    const _renderTable = useCallback(() => {
        if (data && data.cuentas?.length === 1) {
            return (
                <View style={{ flex: 1 }}>
                    {(data.cuentas[0].porcentajes) && <View style={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                        {
                            (report === 'ApCi') ?
                                <>
                                    <TarjetPercentaje
                                        text='Aperturas'
                                        max={100}
                                        percentage={data.cuentas[0].porcentajes?.Apertura}
                                        icon={{ name: 'lock-open', backgroundColor: 'green' }}
                                        textLarge='Aperturas recibidas'
                                    // updated={}
                                    />
                                    <TarjetPercentaje
                                        text='Cierres'
                                        max={100}
                                        percentage={data.cuentas[0].porcentajes?.Cierre}
                                        icon={{ name: 'lock-open', backgroundColor: 'red' }}
                                        textLarge='Cierres recibidas'
                                    />
                                </>
                                : (report === 'EA') ?
                                    <>
                                        <TarjetPercentaje
                                            text='Aperturas'
                                            max={100}
                                            percentage={data.cuentas[0].porcentajes?.Apertura}
                                        // icon={{ name: 'lock-open', backgroundColor: 'green' }}
                                        />
                                        <TarjetPercentaje
                                            text='Cierres'
                                            max={100}
                                            percentage={data.cuentas[0].porcentajes?.Cierre}
                                        // icon={{ name: 'lock-open', backgroundColor: 'green' }}
                                        />
                                        <TarjetPercentaje
                                            text='Alarma'
                                            max={100}
                                            percentage={data.cuentas[0].porcentajes?.Alarma}
                                        // icon={{ name: 'lock-open', backgroundColor: 'green' }}
                                        />
                                        <TarjetPercentaje
                                            text='Pruebas'
                                            max={100}
                                            percentage={data.cuentas[0].porcentajes?.Pruebas}
                                        // icon={{ name: 'lock-open', backgroundColor: 'green' }}
                                        />
                                        <TarjetPercentaje
                                            text='Bateria'
                                            max={100}
                                            percentage={data.cuentas[0].porcentajes?.Bateria}
                                        // icon={{ name: 'lock-open', backgroundColor: 'green' }}
                                        />
                                        <TarjetPercentaje
                                            text='Otros'
                                            max={100}
                                            percentage={data.cuentas[0].porcentajes?.Otros}
                                        // icon={{ name: 'lock-open', backgroundColor: 'green' }}
                                        />
                                    </>
                                    : undefined
                        }
                    </View>}
                    <Table
                        Header={{ title: data.cuentas[0].Nombre.trim(), subtitle: data.cuentas[0].Direccion.trim() }}
                        Data={data.cuentas[0].eventos}
                        titles={titles}
                        fontSize={10}
                        pagination={{ iconBackgroundColor: colors.primaryContainer }}
                        colorBackgroundTable={colors.background}
                        showIndices
                    />
                </View>
            )
        } else if (data?.cuentas) {
            return (
                <View style={{ paddingVertical: 5 }}>
                    <SectionList
                        sections={data.cuentas.map(acc => { return { title: { name: acc.Nombre, address: acc.Direccion, ref: createRef<ScrollView>() }, data: [{ events: acc.eventos ?? [] }] } })}
                        renderItem={({ item, section }) => {
                            const ref = section.title.ref;
                            return (
                                <Table
                                    scrollRefHeader={ref}
                                    Data={item.events}
                                    titles={titles}
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
                                    <Row data={titles.map(r => r.title)} tamCol={titles.map(s => { return { size: s.size ?? 50, center: s.center } })} fontSize={13} styleLabel={{ padding: 0, margin: 0 }} />
                                </ScrollView>
                            </Surface>
                        )}
                        keyExtractor={(item, idx) => `${idx * .333}`}
                        stickySectionHeadersEnabled
                    />
                </View>
            )
        }
        return undefined;
    }, [data, titles])

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header mode='small' theme={{ colors: { surface: colors.primary } }}>
                <Appbar.BackAction color={colors.background} onPress={() => {
                    navigation.goBack()
                }} />
                <Appbar.Content color={colors.background} title={report === 'ApCi' ? 'APERTURA Y CIERRE' : 'EVENTO DE ALARMA'} />
            </Appbar.Header>
            <View
                accessibilityState={{ busy: false, checked: false, disabled: false, expanded: false, selected: false }}
                accessible={false}
                style={{ flex: 1, marginBottom: 57 }}
                collapsable
                needsOffscreenAlphaCompositing={false}
                removeClippedSubviews={false}
            >
                {(isLoading || isFetching) && <Loading />}
                {_renderTable()}
            </View>
            <Appbar
                style={[
                    styles.bottom,
                    {
                        height: 56,
                        backgroundColor: colors.primary,
                        justifyContent: 'space-evenly'
                    },
                ]}

            >
                {(accounts.length === 1) && <>
                    <Appbar.Action style={{ backgroundColor: colors.primaryContainer }} color={colors.primary} icon="swap-horizontal" onPress={() => setVisible(true)} />
                    <Appbar.Action style={{ backgroundColor: colors.primaryContainer }} color={colors.primary} icon="file-download-outline" onPress={() => { }} />
                </>}
                <Appbar.Action style={{ backgroundColor: colors.primaryContainer }} color={colors.primary} icon="refresh" onPress={() => refetch()} />
            </Appbar>

            <Modal visible={visible} transparent animationType='slide'>
                <Pressable onPress={() => setVisible(!visible)} style={{ flex: 1 }} />
                <View style={{
                    backgroundColor: colors.background, width: screenWidth, height: 170, borderTopRightRadius: 15, borderTopLeftRadius: 15, position: 'absolute', bottom: 0,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                }}>
                    <List.Section style={{ paddingHorizontal: 30, width: screenWidth, }}>
                        <List.Subheader selectionColor={'red'}>Reportes</List.Subheader>
                        <List.Item cancelable title="Apertura y Cierre" left={() => <List.Icon color={colors.primary} icon="newspaper-variant" />}
                            onPress={
                                () => {
                                    setReport('ApCi');
                                    setVisible(false);
                                    setTitles(TitlesApCi);
                                    queryClient.removeQueries(['Events', key]);
                                }
                            } />
                        <List.Item title="Evento de Alarma" left={() => <List.Icon color={colors.primary} icon="newspaper-variant" />}
                            onPress={
                                () => {
                                    setReport('EA');
                                    setVisible(false);
                                    setTitles(TitlesEA);
                                    queryClient.removeQueries(['Events', key]);
                                }
                            } />
                    </List.Section>
                </View>
            </Modal>
        </View >
    );
};

const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
});

