import React from 'react';
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { ResultQueryScreen } from '../screens/private/ResultQueryScreen';
import { DrawerScreens } from './DrawerScreens';
import { TypeReport } from '../types/types';
import { Account } from '../interfaces/interfaces';

export type rootPrivateScreens = {
    DrawerScreens: undefined;
    ResultQueryScreen: { props: { accounts: Array<Account>, start: string, end: string, report: TypeReport } };
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
            <Stack.Screen name='ResultQueryScreen' options={{ headerShown: false }} component={ResultQueryScreen} />
        </Stack.Navigator>

    )
}
