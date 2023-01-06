import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, StyleSheet, KeyboardAvoidingView, Text, TouchableHighlight } from 'react-native';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { getKeys, getKeysAccount, modDate } from '../../functions/functions';
import { formatDate, Account, Orientation } from '../../interfaces/interfaces';
import { useEffect } from 'react';
import { Select } from '../../components/select/Select';
import { useAppSelector } from '../../app/hooks';
import { Loading } from '../../components/Loading';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';
import { useMyAccounts } from '../../hooks/useQuery';
import { TypeReport } from '../../types/types';
import { Calendar } from '../../components/calendar/Calendar';
import { HandleContext } from '../../context/HandleContext';
import { Button } from '../../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from 'color';
import { stylesApp } from '../../App';
import { Fab } from '../../components/Fab';

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
    const { isLoading, data, refetch, isFetching, error } = useMyAccounts();

    const { navigate } = useNavigation<Stack>();

    const { theme: { colors, fonts, roundness } } = useAppSelector(state => state.app);
    const { handleError, orientation } = useContext(HandleContext);

    const { control, handleSubmit, reset, setValue: setValueForm } = useForm<Accout>({ defaultValues: { name: '', start: '', end: '', report: '' } });

    const [valueSelect, setValueSelect] = useState<Array<Account>>();
    const [report, setReport] = useState<typeof reports>();
    const [dates, setDates] = useState<Array<{ name: string, date?: formatDate }>>();
    const [hideCalendars, setHideCalendars] = useState<boolean>(false);

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        const accounts = data?.accounts.filter(f => valueSelect?.map(v => v.CodigoCte).includes(f.CodigoCte)) ?? [];
        if (dates && accounts.length > 0 && report) {
            const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
            if (missingDates?.length === 0) {
                const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({}).date.date;
                const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({}).date.date;
                if (accounts.length === 1) {
                    navigate('ResultAccountScreen', { account: { name: accounts[0].Nombre, code: parseInt(accounts[0].CodigoCte) }, end, report: report[0].value, start, keys: getKeys(report[0].value), typeAccount: 1 })
                } else {
                    navigate('ResultAccountsScreen', {
                        accounts: valueSelect ? valueSelect.map(v => { return { name: v.Nombre, code: parseInt(v.CodigoCte) } }).sort() : [],
                        report: report[0].value,
                        keys: report[0].value === 'batery' ? getKeysAccount(report[0].value) : getKeys(report[0].value),
                        typeAccount: 1,
                        start: (report[0].value === 'ap-ci' || report[0].value === 'event-alarm') ? start : undefined,
                        end: (report[0].value === 'ap-ci' || report[0].value === 'event-alarm') ? end : undefined,
                        nameGroup: 'Custom Group'
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
                            {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.error }]}>{error.message}</Text>}
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
                                maxHeight={200}
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
                                renderCancelBtn
                            />
                            {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.error }]}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [control, report, setReport, reports, colors, valueSelect])

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
    }, [report]);

    useEffect(() => {
        if (error) handleError(String(error));
    }, [error]);


    return (
        <View style={{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Loading loading={isLoading} />
            <View style={[
                { width: '100%' },
                orientation === Orientation.landscape && {
                    width: '80%'
                }
            ]}>
                <ScrollView>
                    {
                        <KeyboardAvoidingView>
                            {_renderSelectAccounts()}
                            <View style={{ padding: 10, maxHeight: 100 }}>
                                {(valueSelect && valueSelect.length > 0) &&
                                    <ScrollView >
                                        {
                                            valueSelect?.map(acc =>
                                                <View
                                                    key={acc.CodigoCte}
                                                    style={[
                                                        stylesApp.shadow,
                                                        {
                                                            backgroundColor: colors.background,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            borderWidth: .2,
                                                            borderColor: colors.primary,
                                                            borderRadius: roundness,
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 5,
                                                            margin: 2,
                                                            elevation: 2
                                                        }
                                                    ]}
                                                >
                                                    <Text style={[fonts.titleMedium, { color: colors.text, textAlign: 'left' }]}>{acc.Nombre}</Text>
                                                    <TouchableHighlight
                                                        style={{ borderRadius: roundness * 2, padding: 1 }}
                                                        onPress={() => setValueSelect(valueSelect.filter(f => f.CodigoCte !== acc.CodigoCte))}
                                                        underlayColor={Color(colors.primary).fade(.8).toString()}
                                                    >
                                                        <Icon name='close' color={colors.error} size={25} />
                                                    </TouchableHighlight>
                                                </View>
                                            )
                                        }
                                    </ScrollView>
                                }
                            </View>
                            {_renderSelectReport()}
                            <View style={[
                                orientation === Orientation.landscape && {
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end'
                                }
                            ]}>
                                <Calendar
                                    calendars={calendars}
                                    backgroundColor={colors.background}
                                    textColor={colors.text}
                                    colorOutline={colors.primary}
                                    limitDays={30}
                                    onChange={setDates}
                                    Textstyle={fonts.titleMedium}
                                    hideInputs={hideCalendars}
                                />
                                <View style={{ padding: 10, alignItems: 'flex-end' }}>
                                    <Button
                                        text='CONSULTAR'
                                        loading={isLoading}
                                        style={{ marginVertical: 5 }}
                                        mode='contained'
                                        onPress={handleSubmit(onSubmit)}
                                        contentStyle={{ paddingVertical: 5 }}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    }
                </ScrollView>
            </View>
            <Fab
                loading={isLoading || isFetching}
                icon='refresh'
                iconColor={colors.primary}
                style={{
                    bottom: 15,
                    right: 15,
                    backgroundColor: colors.primaryContainer,
                }}
                onPress={() => refetch()}
                underlayColor={Color(colors.primaryContainer).fade(.2).toString()}
            />
        </View >
    )
}