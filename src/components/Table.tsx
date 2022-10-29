import React, { useEffect, useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import _ from 'lodash';

type Props = {
    Header: {
        title?: string;
        subtitle?: string;
        tableHead: Array<string>;
    }
    Data: any;
    keys: Array<{ key: string, size: number, center?: boolean }>
    fontSize: number;
}

type PropsRow = {
    data: Array<string>;
    fontSize: number;
    tamCol: Array<{ size: number, center?: boolean }>;
    style?: StyleProp<ViewStyle>;
    styleLabel?: StyleProp<TextStyle>;
}

const Table = ({ Header, Data, keys, fontSize, }: Props) => {
    const [events, setEvents] = useState<Array<any>>();
    const [tams, setTams] = useState<Array<{ size: number, center?: boolean }>>([]);

    const Row = ({ data, fontSize, style, styleLabel, tamCol }: PropsRow) => {
        return (
            <View style={[styles.containerRow, style]}>
                {data.map((col, idx) => <Text style={[styles.textHeader, { fontSize, color: '#37474f', width: tamCol[idx].size, textAlign: tamCol[idx].center ? 'center' : 'justify' }, styleLabel]} key={`${col}-${idx}-${Math.random()}`}>{col}</Text>)}
            </View>
        )
    }


    useEffect(() => {
        if (Array.isArray(Data)) {
            const data = Data.map((events, idx) => {
                let arr = keys.map(el => String(_.get(events, el.key)));
                const name = arr.slice(arr.length - 2, arr.length).join('');
                arr = [String(idx + 1), ...arr.slice(0, arr.length - 2), name];
                return arr;
            });
            setTams([{ size: 35, center: true }, ...keys.map(k => { return { size: k.size, center: k.center } })]);
            setEvents(data);
        }
    }, []);


    return (
        <View style={styles.containerTable}>
            {
                (Header.title || Header.subtitle) &&
                <View style={{ paddingVertical: 5, backgroundColor: 'steelblue' }}>
                    {Header.title && <Text style={styles.textTitlesHeader}>{Header.title}</Text>}
                    {Header.subtitle && <Text style={styles.textTitlesHeader}>{Header.subtitle}</Text>}
                </View>
            }
            <ScrollView horizontal={true}>
                <View>
                    {events && <Row tamCol={tams} styleLabel={{ color: 'white' }} style={{ backgroundColor: 'steelblue' }} fontSize={fontSize + 2} data={Header.tableHead} />}
                    <ScrollView>
                        {
                            events ? events.map((ev, idx) => <Row tamCol={tams} style={(idx % 2) ? { backgroundColor: '#7dcff4' } : undefined} fontSize={fontSize} key={idx * .333} data={ev} />)
                                : <Text style={{ textAlign: 'center', color: '#37474f' }}>Sin Eventos</Text>
                        }
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    )
}

export default Table;

const styles = StyleSheet.create({
    containerTable: {
        flex: 1,
        backgroundColor: 'aliceblue',
        marginVertical: 5,
        marginHorizontal: 5
    },
    containerRow: {
        flexDirection: 'row',
        paddingHorizontal: 5
    },
    textHeader: {
        // backgroundColor: 'pink',
        paddingVertical: 2
    },
    textTitlesHeader: {
        color: 'white',
        paddingHorizontal: 5,
    },
});