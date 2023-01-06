import React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { stylesApp } from '../App';
import { useAppSelector } from '../app/hooks';
import Color from 'color';
import Text from './Text';
interface Props {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>
}

export const renderContent = ({ children }: { children: React.ReactNode }) => {
    return (
        React.Children.toArray(children as React.ReactNode | Array<React.ReactNode>)
            .filter((child) => child != null && typeof (child) !== 'boolean')//aseguramos que es un Elemento
            .map((child, i) => {
                //@ts-ignore
                if (!React.isValidElement(child) || ![Text].includes(child.type)) return child;

                const props: { style?: StyleProp<TextStyle>; } = {};
                //@ts-ignore
                if (child.type === Text) {
                    props.style = [{ flex: 1, marginHorizontal: 10 }]
                }

                return React.cloneElement(child, props);
            })
    )
}


export const AppBar = ({ children, style }: Props) => {
    const { theme: { colors, dark } } = useAppSelector(state => state.app);
    return (
        <View style={[
            stylesApp.shadow,
            { backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background, flexDirection: 'row', alignItems: 'center', shadowColor: colors.text, height: 45 },
            style
        ]}>
            {renderContent({ children })}
        </View>
    )
}