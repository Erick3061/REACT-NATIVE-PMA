import React from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { IconButton } from 'react-native-paper';
import { stylesApp } from '../App';
import { useAppSelector } from '../app/hooks';
import Donut from './Donut';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    style?: StyleProp<ViewStyle>;
    amount?: number | string;
}
export const TargetPercentaje = ({ max, percentage, icon, text, textLarge, style, amount }: Props) => {
    const { theme: { colors, roundness, fonts } } = useAppSelector(state => state.app);
    return (
        <View style={[styles.constainer, { backgroundColor: colors.background, borderRadius: roundness * 3, shadowColor: colors.primary, paddingTop: 20 }, style]}>
            {icon &&
                <View style={{ backgroundColor: icon.backgroundColor ?? colors.primary, position: 'absolute', left: 10, top: 10, borderRadius: 100, padding: 3 }}>
                    <Icon
                        name={icon.name}
                        color={icon.colorIcon ?? colors.onPrimary}
                        size={15}
                    />
                </View>
            }
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginHorizontal: 5, alignItems: 'center' }}>
                    <Text style={fonts.titleMedium}>{text}</Text>
                    {amount && <Text style={fonts.titleSmall}>{amount}</Text>}
                </View>
                <Donut radius={35} color='steelblue' max={max} percentage={percentage ?? 0} />
            </View>
            {textLarge && <Text style={fonts.titleSmall}>{textLarge}</Text>}
        </View>
    )
}


const styles = StyleSheet.create({
    constainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // width: '45%',
        marginVertical: 2,
        minWidth: 180,
        ...stylesApp.shadow
    }
});
