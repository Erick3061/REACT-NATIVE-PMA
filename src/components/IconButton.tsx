import React from 'react'
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from 'color';

interface Props extends PressableProps {
    name: string;
    iconsize?: number;
    color?: string;
    active?: boolean;
    colorActive?: string;
    colorIconActive?: string;
}
export const IconButton = (props: Props) => {
    const { name, iconsize, style, active, colorActive, color } = props;
    const iconProps = { color, name };
    const size: number = 25;
    const stl = Array.isArray(style) ? style.reduce((accumulator, currentValue) => { return { ...accumulator as {}, ...currentValue as {} } }) : style;
    const st = ((typeof stl === 'object') ? Object.entries(stl as ViewStyle) : []);
    const padding: number = st.find(e => e[0] === 'padding')?.[1] ?? 0;
    const bc: string | undefined = st.find(e => e[0] === 'backgroundColor')?.[1] ?? undefined;

    return (
        <Pressable {...props}
            style={({ pressed }) => [
                (typeof style === 'object') && style,
                {
                    width: (iconsize ?? size) + 5 + (padding * 2),
                    height: (iconsize ?? size) + 5 + (padding * 2),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: (iconsize ?? size) * 2,
                    backgroundColor: pressed ? Color(colorActive ?? bc).fade(.9).toString() : active ? colorActive ?? bc : undefined,
                }
            ]}>
            <Icon {...iconProps} size={iconsize ?? size} />
        </Pressable >
    )
}
