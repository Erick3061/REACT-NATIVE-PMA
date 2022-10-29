import { report, typeAccount } from "../../types/types";
import { useQuery } from '@tanstack/react-query';
import { ReportEvents } from "../api/Api";


export function useEvents({ accounts, dateEnd, dateStart, key, type, typeAccount }: {
    type: report,
    accounts: Array<number>,
    dateStart: string,
    dateEnd: string,
    typeAccount: typeAccount,
    key: string;
}) { return useQuery(['Events', key], () => ReportEvents({ type, body: { accounts, dateStart, dateEnd, typeAccount } })) }