import React from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { stylesApp } from '../App';
import { useAppSelector } from '../app/hooks';
import Donut from './Donut';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from 'color';

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
    const { theme: { colors, roundness, fonts, dark } } = useAppSelector(state => state.app);
    return (
        <View style={[
            styles.constainer,
            {
                backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background,
                borderRadius: roundness * 3,
                shadowColor: colors.primary,
                padding: 10,
            }
            , style
        ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <View style={{ flex: 1 }}>
                    {icon &&
                        <View style={{ backgroundColor: icon.backgroundColor ?? colors.primary, borderRadius: 100, padding: 3, alignSelf: 'flex-start' }}>
                            <Icon
                                name={icon.name}
                                color={icon.colorIcon ?? colors.onPrimary}
                                size={20}
                            />
                        </View>
                    }
                    <View style={{ marginHorizontal: 5, alignItems: 'center', flex: 1 }}>
                        <Text style={[fonts.titleMedium, { color: colors.text, fontWeight: 'bold' }]}>{text}</Text>
                        {amount && <Text style={[fonts.titleSmall, { color: colors.text }]}>{amount}</Text>}
                    </View>
                </View>
                <Donut radius={35} color={colors.text} max={max} percentage={percentage ?? 0} strokeWidth={9} />
            </View>
            {textLarge && <Text style={[fonts.titleSmall, { color: colors.text }]}>{textLarge}</Text>}
        </View>
    )
}


const styles = StyleSheet.create({
    constainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        minWidth: 180,
        ...stylesApp.shadow
    }
});
