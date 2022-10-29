import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, TextInput as NativeTextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { rootPrivateScreens } from '../../../navigation/PrivateScreens';
import { getDate, modDate } from '../../../functions/functions';
import { formatDate, Account } from '../../../interfaces/interfaces';
import { useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { Select } from '../../../components/Select';
import _ from 'lodash';
import { Input } from '../../../components/Input';
import { Button, FAB, IconButton, Switch, Text, TouchableRipple } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateInfo } from '../../../features/alertSlice';
import { useQuery } from '@tanstack/react-query';
import { GetMyAccount } from '../../../api/Api';
import { Loading } from '../../../components/Loading';
import Toast from 'react-native-toast-message';
import { is } from 'immer/dist/internal';
import { MultipleSelect } from '../../../components/MultipleSelect';

moment.locale('es');

type Stack = StackNavigationProp<rootPrivateScreens>;
type Accout = {
    name: string;
    start: string;
    end: string;
}

type dateSelected = { start: { open: boolean; date: formatDate; }, end: { open: boolean; date: formatDate; } }

const initialDateSelected: dateSelected = { start: { open: false, date: modDate({ days: -30 }) }, end: { open: false, date: getDate() } }

export const AccountsScreen = () => {
    const { isLoading, data, isSuccess, isError, refetch } = useQuery(['MyAccounts'], GetMyAccount, {
        onError: error => Toast.show({ type: 'error', text1: 'Error', text2: `${error}` }),
        onSuccess: data => Toast.show({ type: 'success', text2: 'Cuentas Actualizadas correctamente...' })
    });

    const { navigate } = useNavigation<Stack>();
    const dispatch = useAppDispatch();


    const { theme: { colors } } = useAppSelector(state => state.app);

    const { control, handleSubmit, reset, setValue: setValueForm } = useForm<Accout>({ defaultValues: { name: '', start: '', end: '' } });

    const [show, setShow] = useState<dateSelected>(initialDateSelected);
    const [valueSelect, setValueSelect] = useState<Array<{ label: string, value: any }>>();
    const [isMulSel, setIsMulSel] = useState<boolean>(false);

    const startRef = useRef<NativeTextInput>(null);
    const endtRef = useRef<NativeTextInput>(null);

    const openInfo = ({ msg, title }: { msg: string, title: string }) => dispatch(updateInfo({ open: true, title, msg, icon: true }));

    const onSubmitApCi: SubmitHandler<Accout> = async (props) => {
        // const account = data?.accounts.find(f => f.CodigoCte === valueSelect.map(f=>f.value));
        const accounts = data?.accounts.filter(f => valueSelect?.map(v => v.value).includes(f.CodigoCte)) ?? [];
        if (accounts) {
            const { end, name, start } = props;
            console.log(accounts);

            navigate('ResultIndividualQueryScreen', { props: { accounts, start, end, report: 'ApCi' } });
        } else {
            Toast.show({ type: 'error', text1: 'Error', text2: 'No existe la centa' })
        }
    };

    const onSubmitEA: SubmitHandler<Accout> = async (props) => {
        const accounts = data?.accounts.filter(f => valueSelect?.map(v => v.value).includes(f.CodigoCte)) ?? [];
        if (accounts) {
            const { end, name, start } = props;
            console.log(accounts);

            navigate('ResultIndividualQueryScreen', { props: { accounts, start, end, report: 'EA' } });
        } else {
            Toast.show({ type: 'error', text1: 'Error', text2: 'No existe la centa' })
        }
    };

    useEffect(() => {
        setValueForm('start', show.start.date.date.date);
        setValueForm('end', show.end.date.date.date);
    }, []);

    return (
        <View style={{ flex: 1, padding: 10, }}>
            {
                isLoading ? <Loading />
                    :
                    <KeyboardAvoidingView>
                        <Text style={{ textAlign: 'center' }} variant={'titleSmall'}>Seleccione el inicio y fin de la consulta;</Text>
                        <Text style={{ textAlign: 'center' }} variant={'titleSmall'}>Recuerde que solo se pueden consultar hasta 30 dias naturales</Text>

                        {
                            !isMulSel
                                ?
                                <Controller
                                    control={control}
                                    rules={{ required: { message: 'Debe seleccionar una cuenta', value: true } }}
                                    name='name'
                                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                                        <>
                                            <Select
                                                valueField='CodigoCte'
                                                labelField='Nombre'
                                                valuesSelected={valueSelect ?? []}
                                                value={value}
                                                label={'Seleccione una cuenta'}
                                                data={isSuccess ? data.accounts : data ? data.accounts : []}
                                                onChange={(value: Array<any>) => {
                                                    setValueSelect(value);
                                                    onChange(value[0].label);
                                                }}
                                                error={error ? true : false}
                                            />
                                            {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
                                        </>
                                    }
                                />
                                :
                                <MultipleSelect
                                    labelField='label'
                                    valueField='value'
                                    valuesSelected={valueSelect}
                                    data={isSuccess ? data.accounts.map(acc => { return { label: acc.Nombre, value: acc.CodigoCte } }) : data ? data.accounts.map(acc => { return { label: acc.Nombre, value: acc.CodigoCte } }) : []}
                                    onChange={(value?: { label: string, value: any }) => {
                                        if (value) {
                                            if (data?.accounts.find(f => _.isEqual(f.CodigoCte, value.value))?.Status !== 'A') {
                                                Toast.show({ type: 'error', text1: 'Error', text2: 'Cuenta inhabilitada' })
                                            } else {
                                                if (valueSelect?.find(f => f.value === value.value)) {
                                                    setValueSelect(valueSelect.filter(f => f.value !== value.value));
                                                } else {
                                                    setValueSelect(valueSelect ? [...valueSelect, value] : [value]);
                                                }
                                            }
                                        } else setValueSelect(undefined);
                                    }}
                                />
                        }

                        <TouchableOpacity onPress={() => setIsMulSel(!isMulSel)} style={{ marginVertical: 10, paddingHorizontal: 5, paddingVertical: 10 }}>
                            <View pointerEvents="none" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text variant='titleSmall' >Selector multiple</Text>
                                <Switch value={isMulSel} />
                            </View>
                        </TouchableOpacity>
                        <View style={{ display: 'flex', flexDirection: 'row', marginVertical: 10 }}>
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
                        }
                        <View style={{ paddingHorizontal: 40, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    loading={isLoading}
                                    style={{ marginVertical: 5, flex: 1 }}
                                    mode='contained'
                                    onPress={handleSubmit(onSubmitApCi)}>APERTURA</Button>
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
                                    style={{ marginVertical: 5, flex: 1 }}
                                    mode='contained'
                                    onPress={handleSubmit(onSubmitEA)}>CIERRE</Button>
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
        flex: 1, marginHorizontal: 10, fontWeight: '700'
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