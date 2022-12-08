import React from 'react';
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { DrawerScreens } from './DrawerScreens';
import { TypeReport, typeAccount } from '../types/types';
import { Account, Events, Key } from '../interfaces/interfaces';
import { ResultAccountScreen } from '../screens/private/ResultAccountScreen';
import { ResultAccountsScreen } from '../screens/private/ResultAccountsScreen';

export type rootPrivateScreens = {
    DrawerScreens: undefined;
    ResultAccountsScreen: { accounts: Array<number>, start?: string, end?: string, report: TypeReport, keys: Array<Key<Events>> | Array<Key<Account>>, typeAccount: typeAccount };
    ResultAccountScreen: { account: number, start: string, end: string, report: TypeReport, events?: Array<Events>, keys: Array<Key<Events>>, typeAccount: typeAccount };
}

export const PrivateScreens = () => {
    const Stack = createStackNavigator<rootPrivateScreens>();
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
