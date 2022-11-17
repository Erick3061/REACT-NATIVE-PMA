import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, TextInput as NativeTextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { getDate, modDate } from '../../functions/functions';
import { formatDate, Account, date } from '../../interfaces/interfaces';
import { useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { Select } from '../../components/Select';
import _ from 'lodash';
import { Input } from '../../components/Input';
import { Button, FAB, IconButton, Switch, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateInfo } from '../../features/alertSlice';
import { useQuery } from '@tanstack/react-query';
import { GetMyAccount } from '../../api/Api';
import { Loading } from '../../components/Loading';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from '../../components/Calendar';

moment.locale('es');

type Stack = StackNavigationProp<rootPrivateScreens>;
type Accout = {
    name: string;
    start: string;
    end: string;
}

type dateSelected = { start: { open: boolean; date: formatDate; }, end: { open: boolean; date: formatDate; } }

const initialDateSelected: dateSelected = { start: { open: false, date: modDate({ days: -30 }) }, end: { open: false, date: getDate() } }

const calendars = [
    { label: 'Fecha inicio', date: modDate({ days: -30 }).DATE },
    { label: 'Fecha final', date: modDate({}).DATE },
]

export const AccountsScreen = () => {
    const { isLoading, data, isSuccess, isError, refetch } = useQuery(['MyAccounts'], GetMyAccount, {
        onError: error => Toast.show({ type: 'error', text1: 'Error', text2: `${error}` }),
        onSuccess: data => Toast.show({ type: 'success', text2: 'Cuentas Actualizadas correctamente...' })
    });

    const { navigate } = useNavigation<Stack>();
    const dispatch = useAppDispatch();

    const { theme: { colors } } = useAppSelector(state => state.app);

    const { control, handleSubmit, reset, setValue: setValueForm, formState: { errors } } = useForm<Accout>({ defaultValues: { name: '' } });

    const [valueSelect, setValueSelect] = useState<Array<Account>>();

    const openInfo = ({ msg, title }: { msg: string, title: string }) => dispatch(updateInfo({ open: true, title, msg, icon: true }));

    const [dates, setDates] = useState<Array<{ name: string, date?: formatDate }>>();

    const onSubmitApCi: SubmitHandler<Accout> = async (props) => {
        const accounts = data?.accounts.filter(f => valueSelect?.map(v => v.CodigoCte).includes(f.CodigoCte)) ?? [];
        if (dates && accounts.length > 0) {
            const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
            if (missingDates?.length === 0) {
                const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({}).date.date;
                const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({}).date.date;
                navigate('ResultQueryScreen', { props: { accounts, start, end, report: 'ApCi' } });
            } else {
                Toast.show({ type: 'customError', text1: 'Error al asignar Fechas', text2: `Fechas faltantes:\n${missingDates}` })
            }
        }
    };

    const onSubmitEA: SubmitHandler<Accout> = async (props) => {
        // const accounts = data?.accounts.filter(f => valueSelect?.map(v => v.CodigoCte).includes(f.CodigoCte)) ?? [];
        // if (accounts.length > 0) {
        //     const { end, name, start } = props;
        //     navigate('ResultQueryScreen', { props: { accounts, start, end, report: 'EA' } });
        // } else {
        //     Toast.show({ type: 'error', text1: 'Error', text2: 'No existe la centa' })
        // }
    };

    return (
        <View style={{ flex: 1, padding: 10, }}>
            <ScrollView>
                {
                    isLoading ? <Loading />
                        :
                        <KeyboardAvoidingView>
                            <Text style={{ textAlign: 'center' }} variant={'titleSmall'}>Seleccione el inicio y fin de la consulta;</Text>
                            <Text style={{ textAlign: 'center' }} variant={'titleSmall'}>Recuerde que solo se pueden consultar hasta 30 dias naturales</Text>
                            <Controller
                                control={control}
                                rules={{ required: { message: 'Debe seleccionar una cuenta', value: true } }}
                                name='name'
                                render={({ field: { value, onChange }, fieldState: { error } }) =>
                                    <>
                                        <Select
                                            valueField='CodigoCte'
                                            labelField='Nombre'
                                            value={value}
                                            itemsSelected={valueSelect ?? []}
                                            label={'Seleccione una cuenta'}
                                            data={data ? data.accounts.filter(f => f.Status !== 'I') : []}
                                            onChange={(value: Array<any>) => {
                                                setValueSelect(value);
                                                onChange((value.length <= 1) ? _.get(value[0], 'Nombre') : 'Eliminar Cuentas Seleccionadas');
                                            }}
                                            error={error ? true : false}
                                        />
                                        {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
                                    </>
                                }
                            />
                            <Calendar
                                calendars={calendars}
                                backgroundColor={colors.background}
                                textColor={colors.text}
                                colorOutline={colors.outline}
                                limitDays={30}
                                onChange={setDates}
                            />
                            {/* <View style={{ display: 'flex', flexDirection: 'row', marginVertical: 10 }}>
                                <Input
                                    disabled={isLoading}
                                    refp={startRef}
                                    control={control}
                                    formInputs={control._defaultValues}
                                    label='Fecha inicio'
                                    name='start'
                                    placeholder=''
                                    style={styles.input}
                                    mode='outlined'
                                    onFocus={() => { setShow({ ...show, start: { date: show.start.date, open: true } }) }}
                                    showSoftInputOnFocus={false}
                                    renderRightIcon='calendar'
                                    rules={{ required: { message: 'Debe seleccionar una fecha', value: true } }}
                                />
                                <Input
                                    disabled={isLoading}
                                    refp={endtRef}
                                    control={control}
                                    formInputs={control._defaultValues}
                                    label='Fecha final'
                                    name='end'
                                    placeholder=''
                                    style={styles.input}
                                    mode='outlined'
                                    onFocus={() => { setShow({ ...show, end: { date: show.end.date, open: true } }) }}
                                    showSoftInputOnFocus={false}
                                    renderRightIcon='calendar'
                                    rules={{ required: { message: 'Debe seleccionar una fecha', value: true } }}
                                />
                            </View>
                            {
                                (show.start.open || show.end.open) &&
                                <DateTimePicker
                                    display={'default'}
                                    locale={moment.locale('es')}
                                    value={show.start.open ? show.start.date.DATE : show.end.date.DATE}
                                    mode={'date'}
                                    minimumDate={modDate({ days: -30 }).DATE}
                                    maximumDate={getDate().DATE}
                                    onChange={({ nativeEvent, type }) => {
                                        const date: formatDate = modDate({ dateI: nativeEvent.timestamp ? new Date(nativeEvent.timestamp) : show.start.open ? show.start.date.DATE : show.end.date.DATE })
                                        if (show.start.open) {
                                            startRef.current?.blur();
                                            setShow({ ...show, start: { date, open: false } });
                                            setValueForm('start', date.date.date);
                                        }
                                        if (show.end.open) {
                                            endtRef.current?.blur();
                                            setShow({ ...show, end: { date, open: false } });
                                            setValueForm('end', date.date.date);
                                        }
                                    }}
                                    onTouchCancel={() => {
                                        console.log('cancel');
                                    }}
                                />
                            } */}
                            <View style={{ paddingHorizontal: 40, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Button
                                        loading={isLoading}
                                        style={{ marginVertical: 5 }}
                                        mode='contained'
                                        onPress={handleSubmit(onSubmitApCi)}>APERTURA Y CIERRE</Button>
                                    <IconButton
                                        icon={'information-outline'}
                                        onPress={() => openInfo({
                                            title: 'APERTURA Y CIERRE',
                                            msg: 'Con este reporte podra consultar los horarios en los que se recibieron los eventos de apertura y cierre'
                                        })} />
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Button
                                        loading={isLoading}
                                        style={{ marginVertical: 5 }}
                                        mode='contained'
                                        onPress={handleSubmit(onSubmitEA)}>EVENTO DE ALARMA</Button>
                                    <IconButton
                                        icon={'information-outline'}
                                        onPress={() => openInfo({
                                            title: 'EVENTO DE ALARMA',
                                            msg: 'Con este reporte podra ver los eventos de alarma, asi como los eventos generados por su sistema de alarma'
                                        })} />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                }
            </ScrollView>
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