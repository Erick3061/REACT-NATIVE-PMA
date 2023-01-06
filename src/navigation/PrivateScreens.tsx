import React, { useContext, useEffect } from 'react';
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { DrawerScreens } from './DrawerScreens';
import { TypeReport, typeAccount } from '../types/types';
import { Account, Events, Key } from '../interfaces/interfaces';
import { ResultAccountScreen } from '../screens/private/ResultAccountScreen';
import { ResultAccountsScreen } from '../screens/private/ResultAccountsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { CheckAuth } from '../api/Api';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { HandleContext } from '../context/HandleContext';
import { setUser } from '../features/appSlice';
import { AppState, AppStateStatus } from 'react-native';
export type rootPrivateScreens = {
    DrawerScreens: undefined;
    ResultAccountsScreen: { accounts: Array<{ name: string, code: number }>, nameGroup: string, start?: string, end?: string, report: TypeReport, keys: Array<Key<Events>> | Array<Key<Account>>, typeAccount: typeAccount };
    ResultAccountScreen: { account: { name: string, code: number }, start: string, end: string, report: TypeReport, events?: Array<Events>, keys: Array<Key<Events>>, typeAccount: typeAccount };
}

export const PrivateScreens = () => {
    const Stack = createStackNavigator<rootPrivateScreens>();
    const { User } = useAppSelector(state => state.app);
    const dispatch = useAppDispatch();
    const { handleError } = useContext(HandleContext);

    useQuery(['checkAuth'], () => CheckAuth({ token: User?.refreshToken }), {
        retry: 0,
        refetchInterval: 300000,
        onError: error => {
            handleError(String(error));
            Toast.show({ type: 'error', text1: 'Error', text2: String(error) })
        },
        onSuccess: (resp) => {
            console.log(AppState.currentState);
            dispatch(setUser(resp));
        }
    });

    return (
        <Stack.Navigator
            screenOptions={{
                transitionSpec: {
                    open: TransitionSpecs.TransitionIOSSpec,
                    close: TransitionSpecs.TransitionIOSSpec,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerStyleInterpolator: HeaderStyleInterpolators.forUIKit
            }}
        >
            <Stack.Screen name='DrawerScreens' options={{ headerShown: false }} component={DrawerScreens} />
            <Stack.Screen name='ResultAccountScreen' options={{ headerShown: false }} component={ResultAccountScreen} />
            <Stack.Screen name='ResultAccountsScreen' options={{ headerShown: false }} component={ResultAccountsScreen} />
        </Stack.Navigator>

    )
}
