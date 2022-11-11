import { TypeReport, typeAccount } from "../types/types";
import { useQuery } from '@tanstack/react-query';
import { ReportEvents } from "../api/Api";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { LogOut } from '../features/appSlice';



export function useEvents({ accounts, dateEnd, dateStart, key, type, typeAccount }: {
    type: TypeReport,
    accounts: Array<number>,
    dateStart: string,
    dateEnd: string,
    typeAccount: typeAccount,
    key: string;
}) {
    const dispatch = useAppDispatch();
    console.log(['Events', key, type]);
    return useQuery(['Events', key, type], () => ReportEvents({ type, body: { accounts, dateStart, dateEnd, typeAccount } }), {
        onError: err => {
            if (String(err).toLowerCase().includes('la sesión expiro')) {
                dispatch(LogOut())
            }
        }
    })
}