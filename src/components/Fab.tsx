import React, { useCallback } from 'react'
import { ActivityIndicator, TouchableHighlight, TouchableHighlightProps, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props extends TouchableHighlightProps {
    icon: string;
    iconColor: string;
    loading?: boolean;
    iconSize?: number;
}

export const Fab = (props: Props) => {
    const { icon, iconColor, loading, iconSize } = props;

    const _renderIcon = useCallback(() => {
        if (loading)
            return (
                <ActivityIndicator size={iconSize ?? 25} color={iconColor} />
            )
        return (
            <Icon name={icon} size={iconSize ?? 25} color={iconColor} />
        )
    }, [icon, iconColor, loading, iconSize]);

    return (
        <TouchableWithoutFeedback style={{ backgroundColor: 'red' }}>
            <TouchableHighlight
                {...props}
                style={[
                    props.style,
                    {
                        width: 60,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                        position: 'absolute',
                    },
                ]}
                onPress={(e) => {
                    if (!loading) {
                        props.onPress && props.onPress(e);
                    }
                }}
            >
                {_renderIcon()}
            </TouchableHighlight>
        </TouchableWithoutFeedback>
    )
}
