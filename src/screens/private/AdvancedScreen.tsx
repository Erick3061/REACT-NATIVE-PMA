import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { getKeys, getKeysAccount, modDate } from '../../functions/functions';
import { formatDate, Account } from '../../interfaces/interfaces';
import { useEffect } from 'react';
import { Select } from '../../components/select/Select';
import _ from 'lodash';
import { Button, Chip, FAB, IconButton, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateInfo } from '../../features/alertSlice';
import { Loading } from '../../components/Loading';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';
import { useMyAccounts } from '../../hooks/useQuery';
import { TypeReport } from '../../types/types';
import { Calendar } from '../../components/calendar/Calendar';
import { vh } from '../../config/Dimensions';

type Stack = StackNavigationProp<rootPrivateScreens>;

type Accout = {
    name: string;
    report: string;
    start: string;
    end: string;
}

const calendars = [
    { label: 'Fecha inicio', date: modDate({ days: -30 }).DATE },
    { label: 'Fecha final', date: modDate({}).DATE },
]

const reports: Array<{ name: string, value: TypeReport, msg: string, setDates: boolean }> = [
    { name: 'APERTURA Y CIERRE', value: 'ap-ci', msg: 'Con este reporte podra consultar los horarios en los que se recibieron los eventos de apertura y cierre', setDates: true },
    { name: 'EVENTO DE ALARMA', value: 'event-alarm', msg: 'Con este reporte podra ver los eventos de alarma, asi como los eventos generados por su sistema de alarma', setDates: true },
    { name: 'PROBLEMAS DE BATERIA', value: 'batery', msg: '', setDates: false },
    { name: 'ESTADO DE SUCURSALES', value: 'state', msg: '', setDates: false },
    { name: 'HORARIOS DE APERTURAS Y CIERRES', value: 'apci-week', msg: '', setDates: false },
]

export const AdvancedScreen = () => {
    const { isLoading, data, refetch } = useMyAccounts();

    const { navigate } = useNavigation<Stack>();
    const dispatch = useAppDispatch();

    const { theme: { colors, fonts } } = useAppSelector(state => state.app);

    const { control, handleSubmit, reset, setValue: setValueForm } = useForm<Accout>({ defaultValues: { name: '', start: '', end: '', report: '' } });

    const [valueSelect, setValueSelect] = useState<Array<Account>>();
    const [report, setReport] = useState<typeof reports>();
    const [dates, setDates] = useState<Array<{ name: string, date?: formatDate }>>();
    const [hideCalendars, setHideCalendars] = useState<boolean>(false);

    const openInfo = ({ msg, title }: { msg: string, title: string }) => dispatch(updateInfo({ open: true, title, msg, icon: true }));

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        const accounts = data?.accounts.filter(f => valueSelect?.map(v => v.CodigoCte).includes(f.CodigoCte)) ?? [];
        if (dates && accounts.length > 0 && report) {
            const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
            if (missingDates?.length === 0) {
                const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({}).date.date;
                const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({}).date.date;
                if (accounts.length === 1) {
                    navigate('ResultAccountScreen', { account: parseInt(accounts[0].CodigoCte), end, report: report[0].value, start, keys: getKeys(report[0].value), typeAccount: 1 })
                } else {
                    navigate('ResultAccountsScreen', {
                        accounts: valueSelect ? valueSelect.map(v => parseInt(v.CodigoCte)).sort() : [],
                        report: report[0].value,
                        keys: report[0].value === 'batery' ? getKeysAccount(report[0].value) : getKeys(report[0].value),
                        typeAccount: 1,
                        start: (report[0].value === 'ap-ci' || report[0].value === 'event-alarm') ? start : undefined,
                        end: (report[0].value === 'ap-ci' || report[0].value === 'event-alarm') ? end : undefined,
                    });
                }
            } else {
                Toast.show({ type: 'customError', text1: 'Error al asignar Fechas', text2: `Fechas faltantes:\n${missingDates}` })
            }
        }
    };

    const _renderSelectAccounts = useCallback(() => {
        if (data) {
            return (
                <Controller
                    control={control}
                    rules={{ required: { message: 'Debe seleccionar al menos una cuenta', value: true } }}
                    name='name'
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                        <>
                            <Select
                                valueField='CodigoCte'
                                labelField='Nombre'
                                animationType='fade'
                                value={value}
                                itemsSelected={valueSelect ?? []}
                                label={'Seleccionar cuentas'}
                                renderSearch={{ placeholder: 'Buscar cuenta' }}
                                colorSelected={colors.primaryContainer}
                                data={data.accounts}
                                multiSelect={{ maxSelect: data.accounts.length }}
                                onChange={(value) => {
                                    setValueSelect(value);
                                    if (value.length > 0) {
                                        onChange('Eliminar Cuentas Seleccionadas');
                                    } else {
                                        onChange('')
                                    }
                                }}
                                error={error ? true : false}
                                renderCancelBtn
                            />
                            {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [data, control, valueSelect, colors])

    const _renderSelectReport = useCallback(() => {
        if (reports) {
            return (
                <Controller
                    control={control}
                    rules={{ required: { message: 'Debe seleccionar un reporte', value: true } }}
                    name='report'
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                        <>
                            <Select
                                maxHeight={vh * 30}
                                animationType='fade'
                                valueField='value'
                                labelField='name'
                                colorSelected={colors.primaryContainer}
                                value={value}
                                label='Seleccionar reporte'
                                itemsSelected={report ?? []}
                                data={valueSelect?.length === 1 ? reports.slice(0, 2) : reports}
                                onChange={(value) => {
                                    setReport(value);
                                    if (value.length > 0) {
                                        onChange(value[0].name);
                                    } else {
                                        onChange('')
                                    }
                                }}
                                error={error ? true : false}
                            />
                            {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [control, report, setReport, reports, vh, colors, valueSelect])

    useEffect(() => {
        if (valueSelect?.length === 0) setValueForm('name', '');
        if (valueSelect?.length === 1) {
            setReport([reports[0]]);
            setValueForm('report', reports[0].name);
        }
    }, [valueSelect]);

    useEffect(() => {
        if (report && report.length > 0 && report[0].setDates) setHideCalendars(false);
        else setHideCalendars(true);
    }, [report])


    return (
        <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
            <View>
                <ScrollView>
                    {
                        isLoading ? <Loading />
                            :
                            <KeyboardAvoidingView>
                                {_renderSelectAccounts()}
                                <View style={{ padding: 10, maxHeight: vh * 25 }}>
                                    {(valueSelect && valueSelect.length > 0) &&
                                        <ScrollView >
                                            {valueSelect?.map(acc => <Chip
                                                key={acc.CodigoCte}
                                                mode={'outlined'}
                                                elevated={true}
                                                elevation={1}
                                                style={{ margin: 4 }}
                                                icon="account"
                                                closeIcon={'close'}
                                                onClose={() => setValueSelect(valueSelect.filter(f => f.CodigoCte !== acc.CodigoCte))}
                                            >{acc.Nombre}
                                            </Chip>)}
                                        </ScrollView>
                                    }
                                </View>

                                <Calendar
                                    calendars={calendars}
                                    backgroundColor={colors.background}
                                    textColor={colors.text}
                                    colorOutline={colors.outline}
                                    limitDays={30}
                                    onChange={setDates}
                                    Textstyle={fonts.titleMedium}
                                    hideInputs={hideCalendars}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                                    <View style={{ flex: 1 }}>
                                        {_renderSelectReport()}
                                    </View>
                                    <IconButton
                                        icon={'information-outline'}
                                        onPress={() => openInfo({
                                            title: (report && report.length !== 0) ? _.get(report[0], 'name') : 'Seleccione un reporte',
                                            msg: (report && report.length !== 0) ? _.get(report[0], 'msg') : '',
                                        })} />
                                </View>
                                <View style={{ padding: 10, alignItems: 'center' }}>
                                    <Button
                                        loading={isLoading}
                                        style={{ marginVertical: 5 }}
                                        mode='elevated'
                                        onPress={handleSubmit(onSubmit)}>CONSULTAR</Button>
                                </View>
                            </KeyboardAvoidingView>
                    }
                </ScrollView>
            </View>
            <FAB
                icon="refresh"
                label='Actualizar'
                animated
                loading={isLoading}
                style={styles.fab}
                onPress={() => refetch()}
            />
        </View >
    )
}
const styles = StyleSheet.create({
    input: {
        flex: 1, marginHorizontal: 5, fontWeight: '600', textAlign: 'center'
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});