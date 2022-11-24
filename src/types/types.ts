import { Events } from "../interfaces/interfaces";

export type TypeReport = 'ApCi' | 'EA' | 'Bat' | 'Status' | 'ApCiSem';
export type typeAccount = 1 | 2 | 3 | 4;
export type HeaderTableValues = Array<{ title: string, keys?: Array<keyof Events>, size?: number, center?: boolean }>;