import AsyncStorage from '@react-native-async-storage/async-storage';
import { responseError, User } from '../interfaces/interfaces';

// export const baseUrl = 'https://pem-sa.ddns.me:3007/api';
export const baseUrl = 'http://192.168.1.113:3000';

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