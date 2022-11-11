import { typeAccount } from "../types/types";
import { useQuery } from '@tanstack/react-query';
import { ReportEvents } from "../api/Api";


export function useUsers({ key }: { key: string; }) {
    return useQuery(['Events', key], () => { });
}