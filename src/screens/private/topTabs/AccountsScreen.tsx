import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, TextInput as NativeTextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { rootPrivateScreens } from '../../../navigation/PrivateScreens';
import { getDate, modDate } from '../../../functions/functions';
import { formatDate } from '../../../interfaces/interfaces';
import { useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { Select } from '../../../components/Select';
import _, { initial } from 'lodash';
import { Input } from '../../../components/Input';
import { Button, IconButton, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateInfo } from '../../../features/alertSlice';

moment.locale('es');

type Stack = StackNavigationProp<rootPrivateScreens>;
type Accout = {
    name: string;
    start: string;
    end: string;
}

type Data = {
    accounts: Array<{
        CodigoCte: string;
        CodigoAbonado: string;
        Nombre: string;
        Direccion: string;
        CodigoReceptora: number;
        DP: string;
    }>;
}

type dateSelected = { start: { open: boolean; date: formatDate; }, end: { open: boolean; date: formatDate; } }

const initialDateSelected: dateSelected = { start: { open: false, date: modDate({ days: -30 }) }, end: { open: false, date: getDate() } }

export const AccountsScreen = () => {
    const { navigate } = useNavigation<Stack>();
    const dispatch = useAppDispatch();
    const { theme: { colors } } = useAppSelector(state => state.app);

    const { control, handleSubmit, reset, setValue: setValueForm, formState } = useForm<Accout>({ defaultValues: { name: '', start: '', end: '' } });

    const [show, setShow] = useState<dateSelected>(initialDateSelected);
    const [valueSelect, setValueSelect] = useState<{ label: string, value: any }>({ label: '', value: '' });

    const startRef = useRef<NativeTextInput>(null);
    const endtRef = useRef<NativeTextInput>(null);

    const data: Data = require('../../../assets/accounts.json');

    const openInfo = ({ msg, title }: { msg: string, title: string }) => {
        dispatch(updateInfo({ open: true, title, msg, icon: true }));
    }

    const onSubmit: SubmitHandler<Accout> = async (data) => {
        console.log(data);
    };

    useEffect(() => {
        setValueForm('start', show.start.date.date.date);
        setValueForm('end', show.end.date.date.date);
    }, []);


    return (
        <View style={{ flex: 1, padding: 10, }}>
            <KeyboardAvoidingView>
                <Controller
                    control={control}
                    rules={{
                        required: { message: 'Debe seleccionar una cuenta', value: true }
                    }}
                    name='name'
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                        <>
                            <Select
                                labelField='label'
                                valueField='value'
                                valueSelect={valueSelect}
                                value={value}
                                label={'Seleccione una cuenta'}
                                data={data.accounts.map(a => { return { label: a.Nombre, value: a.CodigoCte } })}
                                onChange={(value: { label: string, value: any }) => {
                                    setValueSelect(value);
                                    onChange(value.label);
                                }}
                                error={error ? true : false}
                            />
                            {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
                        </>
                    }
                />
                <View style={{ display: 'flex', flexDirection: 'row', paddingVertical: 10 }}>
                    <Input
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
                        <Button style={{ marginVertical: 5, flex: 1 }} mode='contained' onPress={handleSubmit(onSubmit)}>APERTURA</Button>
                        <IconButton icon={'help'} onPress={() => openInfo({
                            title: 'APERTURA Y CIERRE',
                            msg: 'Con este reporte podra consultar los horarios en los que se recibieron los eventos de apertura y cierre'
                        })} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Button style={{ marginVertical: 5, flex: 1 }} mode='contained' onPress={handleSubmit(onSubmit)}>CIERRE</Button>
                        <IconButton icon={'help'} onPress={() => openInfo({
                            title: 'EVENTO DE ALARMA',
                            msg: 'Con este reporte podra ver los eventos de alarma, asi como los eventos generados por su sistema de alarma'
                        })} />
                    </View>
                </View>
            </KeyboardAvoidingView>
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
});