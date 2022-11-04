import { StackScreenProps } from '@react-navigation/stack';
import React, { createRef, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Switch, ActivityIndicator, Pressable, SectionList, ScrollView } from 'react-native';
import { Appbar, Menu, Text, TextInput, } from 'react-native-paper';
import { useAppSelector } from '../../app/hooks';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Loading } from '../../components/Loading';
import Table from '../../components/table/Table';
import { Events } from '../../interfaces/interfaces';
import { useEvents } from '../../hooks/Events';
import { Row } from '../../components/table/Row';


interface Props extends StackScreenProps<rootPrivateScreens, 'ResultIndividualQueryScreen'> { };

const TitlesApCi: Array<string> = ['#', 'Fecha', 'Hora', 'Evento', 'Partición', '#Usuario', 'Nombre Usuario',];
const TitlesEA: Array<string> = ['#', 'Fecha', 'Hora', 'Evento', 'Partición', '#Usuario', 'Zona', 'Nombre',];
const KeysApci: Array<{ key: keyof Events, size: number, center?: boolean }> = [
    { key: 'FechaOriginal', size: 75, center: true },
    { key: 'Hora', size: 60, center: true },
    { key: 'DescripcionEvent', size: 100, center: true },
    { key: 'Particion', size: 60, center: true },
    { key: 'CodigoUsuario', size: 60, center: true },
    { key: 'NombreUsuario', size: 200, center: true },
    { key: 'DescripcionZona', size: 0 },
];
const KeysEA: Array<{ key: keyof Events, size: number, center?: boolean }> = [
    { key: 'FechaOriginal', size: 75, center: true },
    { key: 'Hora', size: 60, center: true },
    { key: 'DescripcionEvent', size: 100, center: true },
    { key: 'Particion', size: 60, center: true },
    { key: 'CodigoUsuario', size: 60, center: true },
    { key: 'CodigoZona', size: 60, center: true },
    { key: 'NombreUsuario', size: 200, center: true },
    { key: 'DescripcionZona', size: 0 },
];

export const ResultIndividualQueryScreen = ({ navigation, route }: Props) => {
    const { params: { props: { accounts, start, end } } } = route;
    const { theme: { colors, roundness } } = useAppSelector(state => state.app);
    const [visible, setVisible] = React.useState<boolean>(false);
    const [viewChar, setViewChar] = React.useState<boolean>(false);
    const [report, setReport] = useState<'ApCi' | 'EA'>(route.params.props.report);
    const [keys, setKeys] = useState<Array<{ key: keyof Events, size: number, center?: boolean }>>([]);
    const [titles, setTitles] = useState<Array<string>>([]);
    const [key, setkey] = useState(accounts.length === 1 ? accounts[0].CodigoCte : 'Accounts');
    const queryClient = useQueryClient();

    const logError = (text: string) => Toast.show({ text1: 'Error', text2: text, type: 'error' });

    const { isLoading, isFetching, data, refetch, error } = useEvents({
        key,
        accounts: accounts.map(acc => parseInt(acc.CodigoCte)),
        dateStart: start,
        dateEnd: end,
        type: report,
        typeAccount: 1
    });
    const exit = () => {
        logError(`Cuenta inhabilitada`);
        navigation.pop();
    };

    useEffect(() => {
        setVisible(false);
        if (report === 'ApCi') {
            setTitles(TitlesApCi);
            setKeys(KeysApci)
        } else {
            setTitles(TitlesEA);
            setKeys(KeysEA)
        }
    }, [report]);

    useEffect(() => {
        if (error) logError(`${error}`);
    }, [error])



    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header mode='small' theme={{ colors: { surface: colors.primary } }}>
                <Appbar.BackAction color={colors.background} onPress={() => navigation.goBack()} />
                <Appbar.Content color={colors.background} title={report === 'ApCi' ? 'APERTURA Y CIERRE' : 'EVENTO DE ALARMA'} />
            </Appbar.Header>
            {(accounts.length === 1) && <View style={{ alignItems: 'center' }} >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={{ flex: 1, marginHorizontal: 5, textAlign: 'center' }}
                        mode='outlined'
                        right={<TextInput.Icon icon={'calendar'} />}
                        showSoftInputOnFocus={false}
                        value={start}
                        dense
                        editable={false}
                        label='INICIO'
                    />
                    <TextInput
                        style={{ flex: 1, marginHorizontal: 5, textAlign: 'center' }}
                        mode='outlined'
                        right={<TextInput.Icon icon={'calendar'} />}
                        showSoftInputOnFocus={false}
                        value={end}
                        dense
                        editable={false}
                        label='FINAL'
                    />
                </View>
            </View>}
            <View style={{ flex: 1, marginBottom: 57 }}>
                {
                    accounts.length === 1 &&
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { setViewChar(!viewChar); }}>
                        <Text style={{ color: colors.primary, paddingHorizontal: 5 }}>{viewChar ? 'ocultar gráfica' : 'ver gráfica'}</Text>
                        <Appbar.Action
                            animated
                            style={{ backgroundColor: colors.primaryContainer }}
                            color={colors.primary}
                            icon={viewChar ? 'toggle-switch' : "toggle-switch-off-outline"}
                        />
                    </TouchableOpacity>
                }
                <>
                    {
                        (isLoading || isFetching) ? <Loading /> :
                            data ?
                                data.cuentas
                                    ?
                                    data.cuentas.length === 1
                                        ?
                                        data?.cuentas?.map((acc, idx) =>
                                            !visible ?
                                                <Table
                                                    key={acc.CodigoCte + (idx * .33)}
                                                    Header={{ title: acc.Nombre.trim(), subtitle: acc.Direccion.trim(), tableHead: titles }}
                                                    Data={acc.eventos}
                                                    keys={keys}
                                                    fontSize={11}
                                                />
                                                : <ActivityIndicator color={colors.primary} key={acc.CodigoCte + (idx * .33)} />
                                        )
                                        :
                                        <View style={{ paddingVertical: 5 }}>
                                            <SectionList
                                                sections={data.cuentas.map(acc => { return { title: { name: acc.Nombre, address: acc.Direccion, ref: createRef<ScrollView>() }, data: [{ events: acc.eventos ?? [] }] } })}
                                                renderItem={({ item, section }) => {
                                                    const ref = section.title.ref;
                                                    return (
                                                        <Table
                                                            scrollRefHeader={ref}
                                                            Data={item.events}
                                                            keys={keys}
                                                            fontSize={11}
                                                        />
                                                    )
                                                }}
                                                renderSectionHeader={({ section }) => (
                                                    <View style={{ backgroundColor: 'steelblue', marginHorizontal: 5 }}>
                                                        <Text style={{ color: 'white', paddingHorizontal: 5 }}>{section.title.name}</Text>
                                                        <Text style={{ color: 'white', paddingHorizontal: 5 }}>{section.title.address}</Text>
                                                        <ScrollView ref={section.title.ref} horizontal showsHorizontalScrollIndicator={false}>
                                                            <Row data={titles} fontSize={13} tamCol={[{ size: 35, center: true }, ...keys]} styleLabel={{ padding: 0, margin: 0, color: 'white' }} />
                                                        </ScrollView>
                                                    </View>
                                                )}
                                                keyExtractor={(item, idx) => `${idx * .333}`}
                                                stickySectionHeadersEnabled
                                            />
                                        </View>
                                    : exit()
                                : <Text>Error</Text>
                    }
                </>
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
                    <Menu
                        contentStyle={{ backgroundColor: colors.background }}
                        visible={visible}
                        onDismiss={() => setVisible(false)}
                        anchor={
                            <Appbar.Action style={{ backgroundColor: colors.primaryContainer }} color={colors.primary} icon="file-download-outline" onPress={() => { }} />
                        }
                    >
                        <Menu.Item onPress={() => {
                            setReport('ApCi');
                            setVisible(false);
                            setTitles(TitlesApCi);
                            queryClient.removeQueries(['Events', key]);
                        }} title="Apertura y Cierre" />
                        <Menu.Item onPress={async () => {
                            setReport('EA');
                            setVisible(false);
                            setTitles(TitlesEA);
                            queryClient.removeQueries(['Events', key]);
                        }} title="Evento de Alarma" />
                    </Menu>
                </>}
                <Appbar.Action style={{ backgroundColor: colors.primaryContainer }} color={colors.primary} icon="refresh" onPress={() => refetch()} />
            </Appbar>
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

