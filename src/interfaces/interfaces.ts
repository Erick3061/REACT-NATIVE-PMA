import { typeAccount } from "../types/types";

export interface appSlice {
    status: 'authenticated' | 'not-authenticated';
    versionApp: string;
    token?: string;
};

export interface PropsAlert {
    open: boolean;
    icon?: boolean;
    title?: string;
    subtitle?: string;
    msg?: string;
    timeClose?: number;
}

export interface Question {
    confirm?: true;
    dismissable?: boolean;
}

export interface date {
    date: string;
    day: number;
    month: number;
    year: number;
};

export interface time {
    time: string;
    hour: number;
    minute: number;
    second: number;
};
export interface formatDate {
    DATE: Date;
    date: date;
    time: time;
    weekday: number;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    termsAndConditions: boolean;
    roles: Array<string>;
    token: string;
}

export interface Account {
    CodigoCte: string;
    CodigoAbonado: string;
    Nombre: string;
    Direccion: string;
    Status?: string;
}

export interface responseError {
    status?: boolean;
    message?: Array<string>;
}

export interface GetReport {
    accounts: Array<number>;
    typeAccount: typeAccount;
}

export interface Dates {
    dateStart: string;
    dateEnd: string;
}

export interface Events {
    FechaOriginal: string;
    Hora: string;
    CodigoEvento: string;
    CodigoAlarma: string;
    DescripcionAlarm: string;
    CodigoZona: string;
    DescripcionZona: string;
    CodigoUsuario: string;
    NombreUsuario: string;
    DescripcionEvent: string;
    Particion: number;
    ClaveMonitorista: string;
    NomCalifEvento: string;
    FechaPrimeraToma: string;
    HoraPrimeraToma: string;
    FechaFinalizo: string;
    HoraFinalizo: string;
}
