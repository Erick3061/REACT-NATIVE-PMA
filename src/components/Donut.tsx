import * as React from 'react';
import {
    Easing,
    TextInput,
    Animated,
    Text,
    View,
    StyleSheet,
} from 'react-native';
import Svg, { G, Circle, Rect } from 'react-native-svg';
import useEffect from 'react';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function Donut({ percentage, radius = 35, strokeWidth = 5, duration = 100, color, delay = 500, textColor, max = 100 }
    : { percentage: number, radius?: number, strokeWidth?: number, duration?: number, color: string, delay?: number, textColor?: string, max: number }) {
    const animated = React.useRef(new Animated.Value(0)).current;
    const circleRef = React.useRef<any>(null);
    const inputRef = React.useRef<TextInput>(null);
    const circumference = 2 * Math.PI * radius;
    const halfCircle = radius + strokeWidth;

    const animation = (toValue: any) => {
        animated.setValue(0);
        return Animated.timing(animated, {
            delay,
            toValue,
            duration,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    const changeValues = React.useCallback(() => {
        return animated.addListener(({ value }) => {
            const maxPerc = 100 * value / max;
            const strokeDashoffset = circumference - (circumference * maxPerc) / 100;
            if (inputRef.current) {
                inputRef.current.setNativeProps({
                    text: `${Math.round(value)}.0${value < 100 ? '0' : ''}%`
                });
            }
            if (circleRef.current) {
                circleRef.current.setNativeProps({
                    strokeDashoffset
                })
                circleRef.current.setState({ ...circleRef.current.state, strokeDashoffset })
            }

        })
    }, [animated, circleRef, inputRef]);
    const Animate = () => {
        animation(percentage);
        changeValues();
        return () => {
            animated.removeAllListeners();
        };
    }

    React.useEffect(() => {
        Animate();
    }, [percentage])



    return (
        <View style={{ width: radius * 2, height: radius * 2 }}>
            <Svg
                height={radius * 2}
                width={radius * 2}
                viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                <G
                    rotation="-90"
                    origin={`${halfCircle}, ${halfCircle}`}>
                    <AnimatedCircle
                        ref={circleRef}
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDashoffset={circumference}
                        strokeDasharray={circumference}
                    />
                    <Circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinejoin="round"
                        strokeOpacity={.2}
                    />
                </G>
            </Svg>
            <AnimatedTextInput
                ref={inputRef}
                underlineColorAndroid="transparent"
                editable={false}
                style={[
                    StyleSheet.absoluteFillObject,
                    { fontSize: radius / 3, color: textColor ?? color, opacity: 1 },
                    styles.text,
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    text: { fontWeight: '900', textAlign: 'center' },
});
