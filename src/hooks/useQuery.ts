import { TypeReport, typeAccount } from "../types/types";
import { useQuery } from '@tanstack/react-query';
import { GetMyAccount, ReportEvents } from "../api/Api";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { LogOut } from '../features/appSlice';
import Toast from 'react-native-toast-message';

const validError = (err: string) => {
    const dispatch = useAppDispatch();
    if (err.toLowerCase().includes('la sesión expiro')) {
        dispatch(LogOut());
    }
    Toast.show({ type: 'error', text1: 'Error', text2: err });
}

export function useEvents({ accounts, dateEnd, dateStart, key, type, typeAccount }: {
    type: TypeReport,
    accounts: Array<number>,
    dateStart: string,
    dateEnd: string,
    typeAccount: typeAccount,
    key: string;
}) {
    console.log(['Events', key, type]);
    return useQuery(['Events', key, type], () => ReportEvents({ type, body: { accounts, dateStart, dateEnd, typeAccount } }), {
        onError: error => validError(String(error))
    })
}

export function useMyAccounts() {
    return useQuery(['MyAccounts'], GetMyAccount, {
        onError: error => validError(String(error)),
        onSuccess: () => Toast.show({ type: 'success', text2: 'Cuentas Actualizadas correctamente...' })
    });
}