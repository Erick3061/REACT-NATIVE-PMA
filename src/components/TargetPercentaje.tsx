import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { stylesApp } from '../App';
import { useAppSelector } from '../app/hooks';
import Donut from './Donut';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from 'color';
import Text from './Text';

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
            <View style={{ flexDirection: 'row', alignItems: 'baseline', width: '100%' }}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    {icon &&
                        <View style={{ backgroundColor: icon.backgroundColor ?? colors.primary, borderRadius: 100, padding: 3, alignSelf: 'flex-start' }}>
                            <Icon
                                style={{ padding: 2 }}
                                name={icon.name}
                                color={icon.colorIcon ?? colors.onPrimary}
                                size={20}
                            />
                        </View>
                    }
                    <View style={{ marginHorizontal: 5, alignItems: 'center', flex: 1 }}>
                        <Text variant='titleMedium' style={[{ color: colors.text, fontWeight: 'bold' }]}>{text}</Text>
                        {amount && <Text variant='titleSmall' style={[{ color: colors.text, marginVertical: 2, fontWeight: '700' }]}>{amount}</Text>}
                    </View>
                </View>
                <Donut radius={35} color={colors.primary} max={max} percentage={percentage ?? 0} strokeWidth={9} />
            </View>
            {textLarge && <Text variant='titleSmall' style={[{ color: colors.text, marginVertical: 2, }]}>{textLarge}</Text>}
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
