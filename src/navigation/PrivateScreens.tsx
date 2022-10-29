import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import React from 'react';
import { ResultGroupQueryScreen } from '../screens/private/ResultGroupQueryScreen';
import { ResultIndividualQueryScreen } from '../screens/private/ResultIndividualQueryScreen';
import { DrawerScreens } from './DrawerScreens';
import { Account } from '../interfaces/interfaces';

export type rootPrivateScreens = {
    DrawerScreens: undefined;
    ResultIndividualQueryScreen: { props: { accounts: Array<Account>, start: string, end: string, report: 'ApCi' | 'EA' } };
    ResultGroupQueryScreen: undefined;
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
            <Stack.Screen name='ResultIndividualQueryScreen' options={{ headerShown: false }} component={ResultIndividualQueryScreen} />
            <Stack.Screen name='ResultGroupQueryScreen' options={{ headerShown: false }} component={ResultGroupQueryScreen} />
        </Stack.Navigator>

    )
}
