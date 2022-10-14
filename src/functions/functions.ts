import { formatDate } from "../interfaces/interfaces";

export const hextToRgb = (hex: string) => {
    const con: RegExpMatchArray | null = hex.replace('#', '').match(/.{1,2}/g);
    if (!con) return '0,0,0';

    return `${parseInt(con[0], 16)},${parseInt(con[1], 16)},${parseInt(con[2], 16)}`
}

export const LightenDarkenColor = (col: string, amt: number) => {

    let usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    const num = parseInt(col, 16);

    let r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    const color = (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    if (color.length < 7) {
        const c = color.slice(1);
        return ((usePound ? "#" : "") + c.padStart(7 - c.length + 1, '0'));
    }
    return (color);
}

export const getDate = (): formatDate => {
    const newDate: Date = new Date();
    const [day, month, year]: Array<string> = newDate.toLocaleDateString("es-MX", {
        year: 'numeric', month: 'numeric', day: 'numeric'
    }).split('/');
    const date: string = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const time: string = `${newDate.toTimeString().slice(0, 8)}`;
    const [hour, minute, second]: Array<number> = time.split(':').map(m => parseInt(m));
    const json: string = `${date}T${time}.000Z`;
    const dateGenerated: Date = new Date(json);
    const weekday = dateGenerated.getDay();
    return {
        DATE: dateGenerated,
        date: { date, day: parseInt(day), month: parseInt(month), year: parseInt(year) },
        time: { time, hour, minute, second },
        weekday
    };
}

export const modDate = ({ hours, minutes, seconds, dateI, days, months }: { dateI?: Date, seconds?: number, minutes?: number, hours?: number, days?: number, months?: number }): formatDate => {
    const newDate = (dateI) ? new Date(dateI.toJSON()) : getDate().DATE;
    (hours) && newDate.setHours(newDate.getHours() + hours);
    (minutes) && newDate.setMinutes(newDate.getMinutes() + minutes);
    (seconds) && newDate.setSeconds(newDate.getSeconds() + seconds);
    (days) && newDate.setDate(newDate.getDate() + days);
    (months) && newDate.setMonth(newDate.getMonth() + months);
    const [date, time] = newDate.toJSON().split('.')[0].split('T');
    const [year, month, day]: Array<number> = date.split('-').map(m => parseInt(m));
    const [hour, minute, second]: Array<number> = time.split(':').map(m => parseInt(m));
    const weekday = newDate.getDay();
    return {
        DATE: newDate,
        date: { date, day, month, year },
        time: { time, hour, minute, second },
        weekday
    };
}
