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

export interface responseError {
    status?: boolean;
    message?: Array<string>;
}