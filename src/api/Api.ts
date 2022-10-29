import AsyncStorage from '@react-native-async-storage/async-storage';
import { responseError, User, Account, GetReport, Dates, Events } from '../interfaces/interfaces';

// export const baseUrl = 'https://pem-sa.ddns.me:3007/api';
export const baseUrl = 'http://192.168.1.93:3000';

export const Api = async (endpoint: string, data: object = {}, method: 'GET' | 'POST' | 'PATCH' = 'GET', tokenTemp?: string) => {
    const url = `${baseUrl}/${endpoint}`;
    console.log(url);
    const token = tokenTemp ?? await AsyncStorage.getItem('token');
    const headers: HeadersInit_ | undefined = {};
    (token) ? Object.assign(headers, { 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }) : Object.assign(headers, { 'Content-type': 'application/json', });
    return (method === 'GET') ? fetch(url, { method, headers }) : fetch(url, { method, headers, body: JSON.stringify(data) });
}

export const LogIn = async (props: { email: string, password: string }) => {
    try {
        const response = await Api('auth', props, 'POST');
        const { status, message, ...data }: responseError & User = await response.json();
        if (status === false) throw new Error(`${message}`);
        return data;
    } catch (error) { throw new Error(`${error}`) }
}

export const CheckAuth = async (terms?: string) => {
    try {
        const response = await Api(`${terms ? 'user/accept-terms' : 'auth/check-auth'}`, {}, 'GET', terms ?? undefined);
        const { status, message, ...data }: responseError & User = await response.json();
        if (status === false) throw new Error(`${message}`);
        return data;
    } catch (error) { throw new Error(`${error}`); }
};

export const GetMyAccount = async () => {
    try {
        const response = await Api(`accounts/my-individual-accounts`, {}, 'GET');
        const { status, message, ...data }: responseError & { accounts: Array<Account> } = await response.json();
        if (status === false) throw new Error(`${message}`);
        return data;
    } catch (error) { throw new Error(`${error}`); }
};


export const ReportEvents = async ({ body, type }: { body: GetReport & Dates, type?: 'ApCi' | 'EA' }) => {
    try {
        const response = await Api(`reports/${type === 'ApCi' ? 'ap-ci' : 'event-alarm'}`, body, 'POST');
        const { status, message, ...data }: responseError & { nombre: string, cuentas?: Array<Account & { eventos?: Array<Events> }> } = await response.json();
        if (status === false) throw new Error(`${message}`);
        return data;
    } catch (error) { throw new Error(`${error}`); }
}