import React, { useEffect } from 'react';
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { DrawerScreens } from './DrawerScreens';
import { TypeReport, typeAccount } from '../types/types';
import { Account, Events, Key } from '../interfaces/interfaces';
import { ResultAccountScreen } from '../screens/private/ResultAccountScreen';
import { ResultAccountsScreen } from '../screens/private/ResultAccountsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type rootPrivateScreens = {
    DrawerScreens: undefined;
    ResultAccountsScreen: { accounts: Array<number>, start?: string, end?: string, report: TypeReport, keys: Array<Key<Events>> | Array<Key<Account>>, typeAccount: typeAccount };
    ResultAccountScreen: { account: number, start: string, end: string, report: TypeReport, events?: Array<Events>, keys: Array<Key<Events>>, typeAccount: typeAccount };
}

export const PrivateScreens = () => {
    const Stack = createStackNavigator<rootPrivateScreens>();
    // useEffect(() => {
    //     AsyncStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2Mjk0YzA3LTgyYjctNGM3MC04NjBhLWQzMzZjOTE4MWNlMCIsImlhdCI6MTY3MTY0MjM5NCwiZXhwIjoxNjcxNjc4Mzk0fQ.R0A1_cQQSF4gBnBzGnaCDxOgQ85c_9yKKGqRwBCqr4c')
    // }, [])
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
