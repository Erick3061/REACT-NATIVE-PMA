import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { IconButton } from 'react-native-paper';
import { stylesApp } from '../App';
import { useAppSelector } from '../app/hooks';
import Donut from './Donut';

interface Props {
    percentage?: number;
    max: number;
    icon?: {
        name: string;
        backgroundColor?: string;
        colorIcon?: string;
    }
    text: string;
    textLarge?: string;
}
export const TarjetPercentaje = ({ max, percentage, icon, text, textLarge }: Props) => {
    const { theme: { colors, roundness, fonts } } = useAppSelector(state => state.app);
    return (
        <View style={[styles.constainer, { backgroundColor: colors.background, borderRadius: roundness * 3, shadowColor: colors.primary }]}>
            {icon && <IconButton style={{ alignSelf: 'flex-start', marginBottom: -10 }} icon={icon.name} containerColor={icon.backgroundColor ?? colors.primary} iconColor={icon.colorIcon ?? colors.onPrimary} />}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginHorizontal: 5, alignItems: 'center' }}>
                    <Text style={fonts.titleMedium}>{text}</Text>
                    <Text style={fonts.titleSmall}>{100}</Text>
                </View>
                <Donut radius={35} color='steelblue' max={max} percentage={percentage ?? 0} />
            </View>
            {text && <Text style={fonts.titleSmall}>{textLarge}</Text>}
        </View>
    )
}


const styles = StyleSheet.create({
    constainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // width: '45%',
        marginVertical: 3,
        width: 170,
        ...stylesApp.shadow
    }
});
