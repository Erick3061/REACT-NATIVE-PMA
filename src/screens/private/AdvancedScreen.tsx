import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { modDate } from '../../functions/functions';
import { formatDate, Account } from '../../interfaces/interfaces';
import { useEffect } from 'react';
import { Select } from '../../components/select/Select';
import _ from 'lodash';
import { Button, Chip, FAB, IconButton, Text, Surface } from 'react-native-paper';
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

const reports: Array<{ name: string, value: TypeReport, msg: string }> = [
    { name: 'APERTURA Y CIERRE', value: 'ApCi', msg: 'Con este reporte podra consultar los horarios en los que se recibieron los eventos de apertura y cierre' },
    { name: 'EVENTO DE ALARMA', value: 'EA', msg: 'Con este reporte podra ver los eventos de alarma, asi como los eventos generados por su sistema de alarma' },
    { name: 'PROBLEMAS DE BATERIA', value: 'Bat', msg: '' },
    { name: 'ESTADO DE SUCURSALES', value: 'Status', msg: '' },
    { name: 'HORARIOS DE APERTURAS Y CIERRES', value: 'ApCiSem', msg: '' },
]

export const AdvancedScreen = () => {
    const { isLoading, data, refetch } = useMyAccounts();

    const { navigate } = useNavigation<Stack>();
    const dispatch = useAppDispatch();

    const { theme: { colors, roundness, fonts } } = useAppSelector(state => state.app);

    const { control, handleSubmit, reset, setValue: setValueForm } = useForm<Accout>({ defaultValues: { name: '', start: '', end: '' } });

    const [valueSelect, setValueSelect] = useState<Array<Account>>();
    const [report, setReport] = useState<typeof reports>();
    const [dates, setDates] = useState<Array<{ name: string, date?: formatDate }>>();

    const openInfo = ({ msg, title }: { msg: string, title: string }) => dispatch(updateInfo({ open: true, title, msg, icon: true }));

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        const accounts = data?.accounts.filter(f => valueSelect?.map(v => v.CodigoCte).includes(f.CodigoCte)) ?? [];
        if (dates && accounts.length > 0 && report) {
            const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
            if (missingDates?.length === 0) {
                const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({}).date.date;
                const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({}).date.date;
                navigate('ResultQueryScreen', { props: { accounts, start, end, report: report[0].value } });
            } else {
                Toast.show({ type: 'customError', text1: 'Error al asignar Fechas', text2: `Fechas faltantes:\n${missingDates}` })
            }
        }
    };

    useEffect(() => {
        if (valueSelect?.length === 0) setValueForm('name', '')
    }, [valueSelect]);

    return (
        <View style={{ flex: 1, padding: 10, }}>
            <ScrollView>
                {
                    isLoading ? <Loading />
                        :
                        <KeyboardAvoidingView>
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
                                            label={'Seleccione sus cuentas'}
                                            colorSelected={colors.primaryContainer}
                                            data={data ? data.accounts.filter(f => f.Status !== 'I') : []}
                                            onChange={(value: Array<any>) => {
                                                setValueSelect(value);
                                                onChange((value.length <= 1) ? _.get(value[0], 'Nombre') : 'Eliminar Cuentas Seleccionadas');
                                            }}
                                            renderSearch={{ placeholder: 'Buscar cuenta' }}
                                            error={error ? true : false}
                                            multiSelect={{ maxSelect: data?.accounts.length ?? 50 }}
                                        />
                                        {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
                                    </>
                                }
                            />
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
                                            closeIconAccessibilityLabel={'k'}
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
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                                <View style={{ flex: 1 }}>
                                    <Controller
                                        control={control}
                                        rules={{ required: { message: 'Debe seleccionar una cuenta', value: true } }}
                                        name='report'
                                        render={({ field: { value, onChange }, fieldState: { error } }) =>
                                            <>
                                                <Select
                                                    maxHeight={vh * 30}
                                                    animationType='slide'
                                                    valueField='value'
                                                    labelField='name'
                                                    colorSelected={colors.primaryContainer}
                                                    value={value}
                                                    label='Seleccione reporte'
                                                    itemsSelected={report ?? []}
                                                    data={reports}
                                                    onChange={(value) => {
                                                        setReport(value);
                                                        onChange(_.get(value[0], 'name'))
                                                        console.log(value);
                                                    }}
                                                    error={error ? true : false}
                                                />
                                                {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
                                            </>
                                        }
                                    />
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