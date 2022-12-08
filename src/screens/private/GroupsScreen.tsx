import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { Group } from '../../interfaces/interfaces';
import { Select } from '../../components/select/Select';
import { Button, FAB, IconButton, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateInfo } from '../../features/alertSlice';
import { Loading } from '../../components/Loading';
import { ScrollView } from 'react-native-gesture-handler';
import { vh } from '../../config/Dimensions';
import { TypeReport } from '../../types/types';
import { useGroups } from '../../hooks/useQuery';
import { getKeys, getKeysAccount } from '../../functions/functions';

type Stack = StackNavigationProp<rootPrivateScreens>;

type Accout = {
    name: string;
    report: string;
}

const reports: Array<{ name: string, value: TypeReport, msg: string }> = [
    { name: 'PROBLEMAS DE BATERIA', value: 'batery', msg: '' },
    { name: 'ESTADO DE SUCURSALES', value: 'state', msg: '' },
    { name: 'HORARIO DE APERTURAS Y CIERRES', value: 'apci-week', msg: '' },
];

export const GroupsScreen = () => {
    const { isLoading, data, refetch } = useGroups();
    const { navigate } = useNavigation<Stack>();
    const dispatch = useAppDispatch();


    const { theme: { colors, fonts } } = useAppSelector(state => state.app);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<Accout>({ defaultValues: { name: '', report: '' } });

    const [valueSelect, setValueSelect] = useState<Array<Group>>();
    const [report, setReport] = useState<typeof reports>();

    const openInfo = ({ msg, title }: { msg: string, title: string }) => dispatch(updateInfo({ open: true, title, msg, icon: true }));

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        if (valueSelect && valueSelect.length > 0 && report && report?.length > 0) {
            if (report[0].value === 'batery') {
                navigate('ResultAccountsScreen', { accounts: [valueSelect[0].Codigo], report: report[0].value, keys: getKeysAccount(report[0].value), typeAccount: valueSelect[0].Tipo });
            }
            if (report[0].value === 'state') {
                navigate('ResultAccountsScreen', { accounts: [valueSelect[0].Codigo], report: report[0].value, keys: getKeys(report[0].value), typeAccount: valueSelect[0].Tipo });
            }
            if (report[0].value === 'apci-week') {
                navigate('ResultAccountsScreen', { accounts: [valueSelect[0].Codigo], report: report[0].value, keys: getKeys(report[0].value), typeAccount: valueSelect[0].Tipo });
            }
        }

    };

    const _renderSelectGroup = useCallback(() => {
        if (data) {
            return (
                <Controller
                    control={control}
                    rules={{ required: { message: 'Debe seleccionar un grupo', value: true } }}
                    name='name'
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                        <>
                            <Select
                                valueField='Nombre'
                                labelField='Nombre'
                                animationType='fade'
                                value={value}
                                itemsSelected={valueSelect ?? []}
                                label={'Seleccionar grupo'}
                                renderSearch={{ placeholder: 'Buscar cuenta' }}
                                colorSelected={colors.primaryContainer}
                                data={data.groups}
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
                            {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
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
                                {_renderSelectGroup()}
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                                    <View style={{ flex: 1 }}>
                                        {_renderSelectReport()}
                                    </View>
                                    <IconButton
                                        icon={'information-outline'}
                                        onPress={() => openInfo({
                                            title: (report && report.length !== 0) ? report[0].name : 'Seleccione un reporte',
                                            msg: (report && report.length !== 0) ? report[0].msg : '',
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