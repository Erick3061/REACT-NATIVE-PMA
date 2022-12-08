import { Events } from "../interfaces/interfaces";

export type TypeReport = 'ap-ci' | 'event-alarm' | 'batery' | 'state' | 'apci-week';
export type typeAccount = number;
export type HeaderTableValues = Array<{ title: string, keys?: Array<keyof Events>, size?: number, center?: boolean }>;