import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, StyleSheet, KeyboardAvoidingView, Text } from 'react-native';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { getKeys, modDate } from '../../functions/functions';
import { formatDate, Account } from '../../interfaces/interfaces';
import { Select } from '../../components/select/Select';
import { useAppSelector } from '../../app/hooks';
import { Loading } from '../../components/Loading';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from '../../components/calendar/Calendar';
import { TypeReport } from '../../types/types';
import { useMyAccounts } from '../../hooks/useQuery';
import { OrientationContext } from '../../context/OrientationContext';
import { Button } from '../../components/Button';
import { Fab } from '../../components/Fab';
import Color from 'color';

type Stack = StackNavigationProp<rootPrivateScreens>;

interface Accout {
    name: string;
    report: string;
    start: string;
    end: string;
}

const calendars = [
    { label: 'Fecha inicio', date: modDate({ days: -30 }).DATE },
    { label: 'Fecha final', date: modDate({}).DATE },
];

const reports: Array<{ name: string, value: TypeReport, msg: string }> = [
    { name: 'APERTURA Y CIERRE', value: 'ap-ci', msg: 'Con este reporte podra consultar los horarios en los que se recibieron los eventos de apertura y cierre' },
    { name: 'EVENTO DE ALARMA', value: 'event-alarm', msg: 'Con este reporte podra ver los eventos de alarma, asi como los eventos generados por su sistema de alarma' },
];

export const AccountsScreen = () => {
    const { isLoading, data, refetch, isFetching } = useMyAccounts();
    const { navigate } = useNavigation<Stack>();

    const { theme: { colors, fonts } } = useAppSelector(state => state.app);
    const { vh } = useContext(OrientationContext);

    const { control, handleSubmit, reset, setValue: setValueForm, formState: { errors } } = useForm<Accout>({ defaultValues: { name: '', report: '' } });

    const [valueSelect, setValueSelect] = useState<Array<Account>>([]);
    const [report, setReport] = useState<typeof reports>();
    const [dates, setDates] = useState<Array<{ name: string, date?: formatDate }>>();

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        const accounts = data?.accounts.filter(f => valueSelect?.map(v => v.CodigoCte).includes(f.CodigoCte)) ?? [];
        if (dates && accounts.length > 0 && report) {
            const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
            if (missingDates?.length === 0) {
                const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({}).date.date;
                const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({}).date.date;
                navigate('ResultAccountScreen', { account: parseInt(accounts[0].CodigoCte), end, report: report[0].value, start, keys: getKeys(report[0].value), typeAccount: 1 });
            } else {
                Toast.show({ type: 'customError', text1: 'Error al asignar Fechas', text2: `Fechas faltantes:\n${missingDates}` })
            }
        }
    };

    const _renderSelectAccount = useCallback(() => {
        if (data) {
            return (
                <Controller
                    control={control}
                    rules={{ required: { message: 'Debe seleccionar una cuenta', value: true } }}
                    name='name'
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                        <>
                            <Select
                                valueField='CodigoCte'
                                labelField='Nombre'
                                animationType='fade'
                                value={value}
                                itemsSelected={valueSelect ?? []}
                                label={'Seleccione una cuenta'}
                                renderSearch={{ placeholder: 'Buscar cuenta' }}
                                colorSelected={colors.primaryContainer}
                                data={data.accounts}
                                onChange={(value) => {
                                    setValueSelect(value);
                                    if (value.length > 0) {
                                        onChange(value[0].Nombre);
                                    } else {
                                        onChange('')
                                    }
                                }}
                                error={error ? true : false}
                                renderCancelBtn
                            />
                            {error && <Text style={[fonts.titleSmall, { marginHorizontal: 15, color: colors.error }]}>{error.message}</Text>}
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
                                label='Seleccione reporte'
                                itemsSelected={report ?? []}
                                data={reports}
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
                            {error && <Text style={[fonts.titleSmall, { marginHorizontal: 15, color: colors.error }]}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [control, report, setReport, reports, vh, colors])


    return (
        <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
            <View>
                <ScrollView>
                    {
                        isLoading ? <Loading />
                            :
                            <KeyboardAvoidingView>
                                <Text style={[fonts.titleMedium, { color: colors.text, textAlign: 'center' }]}>Seleccione el inicio y fin de la consulta;</Text>
                                <Text style={[fonts.titleMedium, { color: colors.text, textAlign: 'center' }]}>Recuerde que solo se pueden consultar hasta 30 dias naturales</Text>
                                {_renderSelectAccount()}
                                <Calendar
                                    calendars={calendars}
                                    backgroundColor={colors.background}
                                    textColor={colors.text}
                                    colorOutline={colors.outline}
                                    limitDays={30}
                                    onChange={setDates}
                                    Textstyle={fonts.titleMedium}
                                />
                                {_renderSelectReport()}

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
                underlayColor={Color(colors.primary).fade(.8).toString()}
            />
        </View >
    )
}