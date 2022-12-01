import React from 'react';
import { StyleProp, View, ViewStyle, TextStyle, StyleSheet, Text } from 'react-native';

type PropsRow = {
    data: Array<string>;
    fontSize: number;
    tamCol?: Array<{ size: number, center?: boolean }>;
    style?: StyleProp<ViewStyle>;
    styleLabel?: StyleProp<TextStyle>;
}

export const Row = ({ data, fontSize, style, styleLabel, tamCol }: PropsRow) => {
    console.log(data);

    return (
        <View style={[styles.containerRow, style]}>
            {data.map((col, idx) => {
                const width: number | undefined = tamCol ? tamCol[idx].size : undefined;
                const center: boolean | undefined = tamCol ? tamCol[idx].center : undefined;
                return (<Text style={[styles.textHeader, { fontSize, color: '#37474f', width, textAlign: center ? 'center' : 'left' }, styleLabel]} key={`${col}-${idx}-${Math.random()}`}>{col}</Text>)
            })}
        </View>
    )
}
const styles = StyleSheet.create({
    containerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    textHeader: {
        marginVertical: 2,
        marginHorizontal: 1,
    },
    textTitlesHeader: {
        color: 'white',
        paddingHorizontal: 5,
    },
});