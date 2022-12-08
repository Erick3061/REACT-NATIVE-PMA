import AsyncStorage from '@react-native-async-storage/async-storage';
import { responseError, User, Account, GetReport, Group, BatteryStatus, Percentajes } from '../interfaces/interfaces';
import { TypeReport } from '../types/types';

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

export const GetGroups = async () => {
    try {
        const response = await Api(`accounts/my-groups`, {}, 'GET');
        const { status, message, ...data }: responseError & { groups: Array<Group> } = await response.json();
        if (status === false) throw new Error(`${message}`);
        return data;
    } catch (error) { throw new Error(`${error}`); }
};


export const ReportEvents = async ({ body, type }: { body: GetReport, type?: TypeReport }) => {
    try {
        const response = await Api(`reports/${type}`, body, 'POST');
        const { status, message, ...data }: responseError & { nombre: string, cuentas?: Array<Account>, fechas?: Array<string>, total?: number, percentajes?: Percentajes } = await response.json();

        if (status === false) throw new Error(`${message}`);

        if (data.cuentas?.length === 1 && data.cuentas[0].eventos) {
            const total: number = data.cuentas[0].eventos.length;
            if (type === 'ap-ci') {
                let Apertura = Math.round((data.cuentas[0].eventos.filter(f => f.DescripcionEvent.toLowerCase().includes('apertur')).length * 100) / total);
                let Cierre = Math.round((data.cuentas[0].eventos.filter(f => f.DescripcionEvent.toLowerCase().includes('cierr')).length * 100) / total);
                return { nombre: '', cuentas: [{ ...data.cuentas[0] }], percentajes: { Apertura, Cierre } }
            } else if (type === 'event-alarm') {
                let Apertura = Math.round((data.cuentas[0].eventos.filter(f => f.DescripcionEvent.toLowerCase().includes('apertur')).length * 100) / total);
                let Cierre = Math.round((data.cuentas[0].eventos.filter(f => f.DescripcionEvent.toLowerCase().includes('cierr')).length * 100) / total);
                let Alarma = Math.round((data.cuentas[0].eventos.filter(f => (
                    f.CodigoAlarma.includes('ACZ') ||
                    f.CodigoAlarma.includes('A') ||
                    f.CodigoAlarma.includes('FIRE') ||
                    f.CodigoAlarma.includes('ASA')
                )).length * 100) / total);
                let Pruebas = Math.round((data.cuentas[0].eventos.filter(f => (
                    f.CodigoAlarma.includes('ATF0') ||
                    f.CodigoAlarma.includes('ATF1') ||
                    f.CodigoAlarma.includes('ATF3') ||
                    f.CodigoAlarma.includes('ATN0') ||
                    f.CodigoAlarma.includes('ATN1') ||
                    f.CodigoAlarma.includes('ATN3') ||
                    f.CodigoAlarma.includes('ATP') ||
                    f.CodigoAlarma.includes('PR') ||
                    f.CodigoAlarma.includes('SUP') ||
                    f.CodigoAlarma.includes('TESE') ||
                    f.CodigoAlarma.includes('TESS') ||
                    f.CodigoAlarma.includes('TNVB') ||
                    f.CodigoAlarma.includes('TST') ||
                    f.CodigoAlarma.includes('TST0') ||
                    f.CodigoAlarma.includes('TST1') ||
                    f.CodigoAlarma.includes('TST3') ||
                    f.CodigoAlarma.includes('TSTR')
                )).length * 100) / total);
                let Bateria = Math.round((data.cuentas[0].eventos.filter(f => (
                    f.CodigoAlarma.includes('BB') ||
                    f.CodigoAlarma.includes('FCA')
                )).length * 100) / total);
                return {
                    nombre: '',
                    cuentas: [{ ...data.cuentas[0] }],
                    percentajes: { Apertura, Cierre, Alarma, Pruebas, Bateria, Otros: 100 - (Apertura + Cierre + Alarma + Pruebas + Bateria) }
                }
            }
        } else if (type === 'batery') {
            if (data && data.cuentas && data.total) {
                let conRestaure: number = 0, sinRestaure: number = 0, sinEventos: number = 0;
                sinRestaure = data.cuentas.filter(acc => acc.estado === BatteryStatus.ERROR).length / data.total * 100;
                conRestaure = data.cuentas.filter(acc => acc.estado === BatteryStatus.RESTORE).length / data.total * 100;
                sinEventos = data.cuentas.filter(acc => acc.estado === BatteryStatus.WITHOUT_EVENTS).length / data.total * 100;
                return {
                    nombre: data.nombre,
                    cuentas: [...data.cuentas],
                    total: data.total,
                    percentajes: { sinRestaure, conRestaure, sinEventos }
                }
            }
        } else if (type === 'state') {
            if (data && data.cuentas) {
                let abiertas: number = 0, cerradas: number = 0, sinEstado: number = 0;

                abiertas = Math.round((data.cuentas.filter(f => (f.eventos && f.eventos[0].DescripcionEvent.toLowerCase().includes('apert'))).length * 100) / data.cuentas.length);
                cerradas = Math.round((data.cuentas.filter(f => (f.eventos && f.eventos[0].DescripcionEvent.toLowerCase().includes('cierr'))).length * 100) / data.cuentas.length);
                sinEstado = Math.round((data.cuentas.filter(f => f.eventos === undefined).length * 100) / data.cuentas.length);
                console.log(sinEstado, cerradas, abiertas);
                return {
                    nombre: data.nombre,
                    cuentas: [...data.cuentas],
                    total: data.total,
                    percentajes: { abiertas, cerradas, sinEstado }
                }
            }
        }

        return data;
    } catch (error) { throw new Error(`${error}`); }
}