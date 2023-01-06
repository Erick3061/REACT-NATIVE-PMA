import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, KeyboardAvoidingView, Text } from 'react-native';
import { rootPrivateScreens } from '../../navigation/PrivateScreens';
import { Group, Orientation } from '../../interfaces/interfaces';
import { Select } from '../../components/select/Select';
import { useAppSelector } from '../../app/hooks';
import { Loading } from '../../components/Loading';
import { ScrollView } from 'react-native-gesture-handler';
import { TypeReport } from '../../types/types';
import { useGroups } from '../../hooks/useQuery';
import { getKeys, getKeysAccount } from '../../functions/functions';
import { HandleContext } from '../../context/HandleContext';
import { Button } from '../../components/Button';
import { Fab } from '../../components/Fab';
import Color from 'color';

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
    const { isLoading, data, refetch, isFetching, error } = useGroups();
    const { navigate } = useNavigation<Stack>();


    const { theme: { colors, fonts } } = useAppSelector(state => state.app);
    const { handleError, orientation } = useContext(HandleContext);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<Accout>({ defaultValues: { name: '', report: '' } });

    const [valueSelect, setValueSelect] = useState<Array<Group>>();
    const [report, setReport] = useState<typeof reports>();

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        if (valueSelect && valueSelect.length > 0 && report && report?.length > 0) {
            if (report[0].value === 'batery') {
                navigate('ResultAccountsScreen', {
                    accounts: [{ name: valueSelect[0].Nombre, code: valueSelect[0].Codigo }],
                    report: report[0].value,
                    keys: getKeysAccount(report[0].value),
                    typeAccount: valueSelect[0].Tipo,
                    nameGroup: valueSelect[0].Nombre,
                });
            }
            if (report[0].value === 'state') {
                navigate('ResultAccountsScreen', {
                    accounts: [{ name: valueSelect[0].Nombre, code: valueSelect[0].Codigo }],
                    report: report[0].value,
                    keys: getKeys(report[0].value),
                    typeAccount: valueSelect[0].Tipo,
                    nameGroup: valueSelect[0].Nombre,
                });
            }
            if (report[0].value === 'apci-week') {
                navigate('ResultAccountsScreen', {
                    accounts: [{ name: valueSelect[0].Nombre, code: valueSelect[0].Codigo }],
                    report: report[0].value,
                    keys: getKeys(report[0].value),
                    typeAccount: valueSelect[0].Tipo,
                    nameGroup: valueSelect[0].Nombre,
                });
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
                            {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.error }]}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [data, control, valueSelect, colors]);

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
                                renderCancelBtn
                            />
                            {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.error }]}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [control, report, setReport, reports, colors]);

    useEffect(() => {
        if (error) handleError(String(error));
    }, [error]);

    return (
        <View style={{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <View style={[
                { width: '100%' },
                orientation === Orientation.landscape && {
                    width: '80%'
                }
            ]}>
                <Loading loading={isLoading} />
                <ScrollView>
                    {
                        <KeyboardAvoidingView>
                            <Text style={[fonts.headlineSmall, { textAlign: 'center', color: colors.text, marginVertical: 10 }]}>Consulta por grupos</Text>
                            {_renderSelectGroup()}
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
                underlayColor={Color(colors.primaryContainer).fade(.2).toString()}
            />
        </View >
    )
}