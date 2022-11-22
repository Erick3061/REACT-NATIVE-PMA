import { StackScreenProps } from '@react-navigation/stack';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, SectionList, ScrollView, Modal, Platform } from 'react-native';
import { Appbar, List, Surface, Text, } from 'react-native-paper';
import { useAppSelector } from '../../app/hooks';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Loading } from '../../components/Loading';
import Table from '../../components/table/Table';
import { useEvents } from '../../hooks/Events';
import { Row } from '../../components/table/Row';
import { screenWidth } from '../../config/Dimensions';
import { HeaderTableValues, TypeReport } from '../../types/types';
import { TarjetPercentaje } from '../../components/TarjetPercentaje';
import Color from 'color';
import { Menu } from '../../components/Menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
                    {(data.cuentas[0].porcentajes) && <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
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
            <Appbar.Header mode='small' theme={{ colors: { surface: colors.background } }}
                style={{ borderBottomWidth: 1, borderColor: Color(colors.primary).alpha(.1).toString(), height: Platform.OS === 'ios' ? 44 : 56 }}>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content titleStyle={[fonts.bodyLarge, { fontWeight: 'bold' }]} title={report === 'ApCi' ? 'APERTURA Y CIERRE' : 'EVENTO DE ALARMA'} />
                <Menu
                    options={[

                        {
                            label: 'Cambiar reporte',
                            icon: 'swap-horizontal',
                            onPress: () => setVisible(true),
                        },
                        {
                            label: 'Descargar reporte',
                            icon: 'file-download-outline',

                            onPress: () => { },
                        },
                        {
                            label: 'Actualizar',
                            icon: 'refresh',
                            onPress: () => refetch(),
                        },
                    ]}
                />
            </Appbar.Header>

            <View style={{ flex: 1 }}>
                {(isLoading || isFetching) && <Loading />}
                {_renderTable()}
            </View>

            <Modal visible={visible} transparent animationType='slide'>
                <Pressable onPress={() => setVisible(!visible)} style={{ flex: 1 }} />
                <View style={{
                    backgroundColor: colors.background, width: screenWidth, height: 170, borderTopRightRadius: 15, borderTopLeftRadius: 15, position: 'absolute', bottom: 0
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

