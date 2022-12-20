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

type response = responseError & User;

export const LogIn = async (props: { email: string, password: string }) => {
    try {
        const response = await Api('auth', props, 'POST')
        const { status, message, ...data }: response = await response.json();
        if (status === false) throw (`${message}`);
        return data;
    } catch (error) { throw (`${error}`) }
}

export const CheckAuth = async (terms?: string) => {
    try {
        const response = await Api(`${terms ? 'user/accept-terms' : 'auth/check-auth'}`, {}, 'GET', terms ?? undefined);
        const { status, message, ...data }: response = await response.json();
        if (status === false) throw (`${message}`);
        return data;
    } catch (error) { throw (`${error}`); }
};

export const GetMyAccount = async () => {
    try {
        const response = await Api(`accounts/my-individual-accounts`, {}, 'GET');
        const { status, message, ...data }: responseError & { accounts: Array<Account> } = await response.json();
        if (status === false) throw (`${message}`);
        return data;
    } catch (error) { throw (`${error}`); }
};

export const GetGroups = async () => {
    try {
        const response = await Api(`accounts/my-groups`, {}, 'GET');
        const { status, message, ...data }: responseError & { groups: Array<Group> } = await response.json();
        if (status === false) throw (`${message}`);
        return data;
    } catch (error) { throw (`${error}`); }
};


export const ReportEvents = async ({ body, type }: { body: GetReport, type?: TypeReport }) => {
    try {
        const response = await Api(`reports/${type}`, body, 'POST');
        const { status, message, ...data }: responseError & { nombre: string, cuentas?: Array<Account>, fechas?: Array<string>, total?: number, percentajes?: Percentajes } = await response.json();

        if (status === false) throw (`${message}`);

        if (data.cuentas?.length === 1 && data.cuentas[0].eventos) {
            const AP = ["O", "OS", "US11"];
            const CI = ["C", "CS", "UR11"];
            const APCI = ["C", "CS", "O", "OS", "UR11", "US11"];
            const Alarm = ["A", "ACZ", "ASA", "ATR", "CPA", "FIRE", "GA", "P", "SAS", "SMOKE", "VE"];
            const Prue = ["AGT", "AT", "ATP", "AUT", "TST", "TST0", "TST1", "TST3", "TSTR", "TX0"];
            const Bat = ["BB"];
            const otros = ['1381', "24H", "ACR", "BPS", "CAS", "CN", "CTB", "ET*", "FC*", "FCA", "FT", "FT*", "IA*", "MED", "PA", "PAF", "PR", "PRB", "RAS", "REB", "RES", "RFC", "RON", "S99", "STL", "SUP", "TAM", "TB", "TEL", "TESE", "TESS", "TPL", "TRB"];


            const total: number = data.cuentas[0].eventos.length;
            if (type === 'ap-ci') {
                let Aperturas = data.cuentas[0].eventos.filter(f => AP.find(ff => ff === f.CodigoAlarma)).length;
                let Cierres = data.cuentas[0].eventos.filter(f => CI.find(ff => ff === f.CodigoAlarma)).length;
                const percentajes: Percentajes = {
                    Aperturas: {
                        total,
                        percentaje: Aperturas * 100 / total,
                        events: Aperturas,
                        text: 'Aperturas recibidas'
                    },
                    Cierres: {
                        total,
                        percentaje: Cierres * 100 / total,
                        events: Cierres,
                        text: 'Cierres recibidos'
                    }
                }
                return { nombre: '', cuentas: [{ ...data.cuentas[0] }], percentajes }
            } else if (type === 'event-alarm') {
                let ApCi = data.cuentas[0].eventos.filter(f => APCI.find(ff => ff === f.CodigoAlarma)).length;
                let Alarma = data.cuentas[0].eventos.filter(f => Alarm.find(ff => ff === f.CodigoAlarma)).length;
                let Pruebas = data.cuentas[0].eventos.filter(f => Prue.find(ff => ff === f.CodigoAlarma)).length;
                let Bate = data.cuentas[0].eventos.filter(f => Bat.find(ff => ff === f.CodigoAlarma)).length;
                let Otros = data.cuentas[0].eventos.filter(f => otros.find(ff => ff === f.CodigoAlarma)).length;

                const percentajes: Percentajes = {
                    APCI: {
                        total,
                        events: ApCi,
                        percentaje: ApCi * 100 / total,
                        label: 'Ap/Ci',
                        text: 'Aperturas y Cierres \nrecibidos'
                    },
                    Alarma: {
                        total,
                        events: Alarma,
                        percentaje: Alarma * 100 / total,
                        label: 'Alarma',
                        text: 'Alarmas recibidas'
                    },
                    Pruebas: {
                        total,
                        events: Pruebas,
                        percentaje: Pruebas * 100 / total,
                        label: 'Pruebas',
                        text: 'Pruebas recibidas'
                    },
                    Battery: {
                        total,
                        events: Bate,
                        percentaje: Bate * 100 / total,
                        label: 'Bateria',
                        text: 'Eventos de batería \nrecibidos'
                    },
                    Otros: {
                        total,
                        events: Otros,
                        percentaje: Otros * 100 / total,
                        label: 'Otros',
                        text: 'Otros eventos \nrecibidos'
                    }
                }

                return {
                    nombre: '',
                    cuentas: [{ ...data.cuentas[0] }],
                    percentajes
                }
            }
        } else if (type === 'batery') {
            if (data && data.cuentas && data.total) {
                let conRestaure: number = 0, sinRestaure: number = 0, sinEventos: number = 0;
                sinRestaure = data.cuentas.filter(acc => acc.estado === BatteryStatus.ERROR).length;
                conRestaure = data.cuentas.filter(acc => acc.estado === BatteryStatus.RESTORE).length;
                sinEventos = data.cuentas.filter(acc => acc.estado === BatteryStatus.WITHOUT_EVENTS).length;

                const percentajes: Percentajes = {
                    sinRestaure: {
                        percentaje: sinRestaure / data.total * 100,
                        total: data.total,
                        events: sinRestaure,
                        label: 'Sin restaure',
                    },
                    conRestaure: {
                        percentaje: conRestaure / data.total * 100,
                        total: data.total,
                        events: conRestaure,
                        label: 'Con restaure',
                    },
                    sinEventos: {
                        percentaje: sinEventos / data.total * 100,
                        total: data.total,
                        events: sinEventos,
                        label: 'Sin eventos'
                    }
                }

                return {
                    nombre: data.nombre,
                    cuentas: [...data.cuentas],
                    total: data.total,
                    percentajes
                }
            }
        } else if (type === 'state') {
            if (data && data.cuentas) {
                let abiertas: number = 0, cerradas: number = 0, sinEstado: number = 0;
                abiertas = Math.round((data.cuentas.filter(f => (f.eventos && f.eventos[0].DescripcionEvent.toLowerCase().includes('apert'))).length * 100) / data.cuentas.length);
                cerradas = Math.round((data.cuentas.filter(f => (f.eventos && f.eventos[0].DescripcionEvent.toLowerCase().includes('cierr'))).length * 100) / data.cuentas.length);
                sinEstado = Math.round((data.cuentas.filter(f => f.eventos === undefined).length * 100) / data.cuentas.length);
                const percentajes: Percentajes = {
                    abiertas: {
                        percentaje: abiertas,
                        total: data.cuentas.length,
                        events: abiertas,
                        label: 'Abiertas',
                        text: 'Sucursales abiertas'
                    },
                    cerradas: {
                        percentaje: cerradas,
                        total: data.cuentas.length,
                        events: cerradas,
                        label: 'Cerradas',
                        text: 'Sucursales cerradas'
                    },
                    sinEstado: {
                        percentaje: sinEstado,
                        total: data.cuentas.length,
                        events: sinEstado,
                        label: 'Sin estadoa',
                        text: 'Sucursales sin estado'
                    }
                }
                return {
                    nombre: data.nombre,
                    cuentas: [...data.cuentas],
                    total: data.total,
                    percentajes
                }
            }
        }

        return data;
    } catch (error) { throw (`${error}`); }
}