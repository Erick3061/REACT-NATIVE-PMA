import React from 'react';
import { Text, View } from 'react-native';
import { stylesApp } from '../App';
import { useAppSelector } from '../app/hooks';
import { IconButton } from './IconButton';
import Color from 'color';

interface Props {
    label: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
}

export const AppBar = ({ label, left, right }: Props) => {
    const { theme: { colors, fonts, dark } } = useAppSelector(state => state.app);
    return (
        <View style={[stylesApp.shadow, { backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background, flexDirection: 'row', alignItems: 'center', shadowColor: colors.text, height: 45 }]}>
            {left}
            <Text style={[fonts.titleMedium, { marginHorizontal: 10, color: colors.text, flex: 1 }]}>{label}</Text>
            {right}
        </View>
    )
}
