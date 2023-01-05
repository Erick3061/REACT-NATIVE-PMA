import { TypeReport, typeAccount } from "../types/types";
import { useQuery } from '@tanstack/react-query';
import { CheckAuth, GetGroups, GetMyAccount, ReportEvents } from "../api/Api";
import Toast from 'react-native-toast-message';

export function useReport({ accounts, dateEnd, dateStart, key, type, typeAccount }: {
    type: TypeReport,
    accounts: Array<number>,
    dateStart?: string,
    dateEnd?: string,
    typeAccount: typeAccount,
    key: string;
}) {
    console.log(['Events', key, type, dateStart, dateEnd]);
    return useQuery(['Events', key, type, dateStart, dateEnd], () => ReportEvents({ type, body: { accounts, dateStart, dateEnd, typeAccount } }), {
        onError: error => Toast.show({ type: 'error', text1: 'Error', text2: String(error) }),
    })
}

export function useMyAccounts() {
    return useQuery(['MyAccounts'], GetMyAccount, {
        onError: error => Toast.show({ type: 'error', text1: 'Error', text2: String(error) }),
        onSuccess: () => Toast.show({ type: 'success', text2: 'Cuentas Actualizadas correctamente...', autoHide: true })
    });
}

export function useGroups() {
    return useQuery(['MyGroups'], GetGroups, {
        onError: error => Toast.show({ type: 'error', text1: 'Error', text2: String(error) }),
        onSuccess: () => Toast.show({ type: 'success', text2: 'Grupos Actualizadas correctamente...', autoHide: true })
    });
}

export function useCheckAuth({ enabled, retry, }: { enabled?: boolean, retry?: number }) {
    return useQuery(['checkAuth'], () => CheckAuth({}), {
        enabled,
        retry,
        onError: error => Toast.show({ type: 'error', text1: 'Error', text2: String(error) }),
        onSuccess: () => Toast.show({ type: 'success', text2: 'Grupos Actualizadas correctamente...', autoHide: true })
    });
}

