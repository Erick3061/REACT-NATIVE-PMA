import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { rootPublicScreen } from '../../navigation/PublicScreens';
import Toast from 'react-native-toast-message';
import { setUser } from '../../features/appSlice';
import { useQuery } from '@tanstack/react-query';
import { CheckAuth } from '../../api/Api';

interface Props extends StackScreenProps<rootPublicScreen, 'SplashScreen'> { };

export const SplashScreen = ({ navigation }: Props) => {
    const anim = useRef(new Animated.Value(1)).current;
    const { theme: { dark, colors } } = useAppSelector(state => state.app);
    const [token, setToken] = useState<string>();
    const dispatch = useAppDispatch();

    useQuery(['checkAuth'], () => CheckAuth({}), {
        enabled: token ? true : false,
        retry: 0,
        onError: error => AsyncStorage.removeItem('token').then(() => start({})).catch(error => toast(String(error))),
        onSuccess: (resp) => dispatch(setUser(resp))
    });

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
                    { width: 150, height: 150, transform: [{ scale: anim, }] },
                    dark && { tintColor: colors.onSurface }
                ]}
                source={require('../../assets/logo4.png')}
            />
        </View>
    )
}
