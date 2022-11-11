import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Surface, Text } from 'react-native-paper';
import { useAppSelector } from '../app/hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { vw, screenWidth } from '../config/Dimensions';
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
    updated?: boolean;
}
export const TarjetPercentaje = ({ max, percentage, icon, text, updated, textLarge }: Props) => {
    const { theme: { colors, roundness } } = useAppSelector(state => state.app);
    return (
        <Surface elevation={2} style={{ borderRadius: roundness * 2, margin: 5, width: '45%' }}>
            <View style={[styles.constainer, { backgroundColor: colors.background, borderRadius: roundness * 2 }]}>
                {icon && <View style={[styles.containerIcon, { paddingHorizontal: 10 }]} >
                    <Icon size={vw * 6} name={icon.name} color={icon.colorIcon ?? colors.onPrimary} style={[styles.icon, { backgroundColor: icon.backgroundColor ?? colors.primary }]} />
                </View>}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
                        <Text variant='titleMedium'>{text}</Text>
                        <Text variant='titleSmall'>{100}</Text>
                    </View>
                    <Donut radius={30} color='steelblue' max={max} percentage={percentage ?? 0} updated />
                </View>
                {text && <Text variant='titleSmall'>{textLarge}</Text>}
            </View>
        </Surface>
    )
}


const styles = StyleSheet.create({
    constainer: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerIcon: {
        padding: 1,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    icon: {
        borderRadius: 100,
        padding: 4
    }
});
