import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useAppSelector } from '../../app/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { rootPublicScreen } from '../../navigation/PublicScreens';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { HandleContext } from '../../context/HandleContext';
import { useCheckAuth } from '../../hooks/useQuery';
import { setUser } from '../../features/appSlice';

interface Props extends StackScreenProps<rootPublicScreen, 'SplashScreen'> { };

export const SplashScreen = ({ navigation }: Props) => {
    const anim = useRef(new Animated.Value(1)).current;
    const { theme: { dark, colors } } = useAppSelector(state => state.app);
    const { vh } = useContext(HandleContext);
    const [token, setToken] = useState<string>();
    const dispatch = useDispatch();

    const { data, error } = useCheckAuth({ enabled: token ? true : false });
    const toast = (error: string) => {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error,
            autoHide: true,
            visibilityTime: 4000,
            onHide: () => start({ time: 0 }),
        });
    }

    const start = ({ time }: { time?: number }) => setTimeout(async () => {
        try {
            const open = await AsyncStorage.getItem('isWellcomeOff');
            (open) ? navigation.replace('LogInScreen') : navigation.replace('IntroductionScreen');
        } catch (error) {
            try {
                AsyncStorage.removeItem('token');
                toast(String(error))
            } catch (error) {
                toast(String(error))
            }
        }
    }, time ?? 1500);

    Animated.loop(
        Animated.sequence([
            Animated.timing(anim, {
                toValue: 1.1,
                duration: 400,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(anim, {
                toValue: 1,
                duration: 400,
                easing: Easing.ease,
                useNativeDriver: true,
            })
        ])
    ).start();

    useEffect(() => {
        if (data) dispatch(setUser(data));
        if (error) {
            AsyncStorage.removeItem('token').then(() => start({})).catch(error => toast(String(error)));
        }
    }, [data, error]);

    useEffect(() => {
        AsyncStorage.getItem('token').then(async token => {
            if ((typeof token === 'string')) {
                setToken(token);
            } else { start({}); }
        }).catch(error => {
            toast(String(error))
        });
    }, []);


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.Image
                style={[
                    { width: vh * 25, height: vh * 25, transform: [{ scale: anim, }] },
                    dark && { tintColor: colors.onSurface }
                ]}
                source={require('../../assets/logo4.png')}
            />
        </View>
    )
}
