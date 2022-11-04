import React from 'react';
import { StyleProp, View, ViewStyle, TextStyle, StyleSheet, Text } from 'react-native';

type PropsRow = {
    data: Array<string>;
    fontSize: number;
    tamCol: Array<{ size: number, center?: boolean }>;
    style?: StyleProp<ViewStyle>;
    styleLabel?: StyleProp<TextStyle>;
}

export const Row = ({ data, fontSize, style, styleLabel, tamCol }: PropsRow) => {
    return (
        <View style={[styles.containerRow, style]}>
            {data.map((col, idx) => <Text style={[styles.textHeader, { fontSize, color: '#37474f', width: tamCol[idx].size, textAlign: tamCol[idx].center ? 'center' : 'justify' }, styleLabel]} key={`${col}-${idx}-${Math.random()}`}>{col}</Text>)}
        </View>
    )
}
const styles = StyleSheet.create({
    containerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        height: 20,
    },
    textHeader: {
        paddingVertical: 2
    },
    textTitlesHeader: {
        color: 'white',
        paddingHorizontal: 5,
    },
});