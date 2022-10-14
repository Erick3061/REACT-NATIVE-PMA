import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import React from 'react';
import { ResultGroupQueryScreen } from '../screens/private/ResultGroupQueryScreen';
import { ResultIndividualQueryScreen } from '../screens/private/ResultIndividualQueryScreen';
import { DrawerScreens } from './DrawerScreens';

export type rootPrivateScreens = {
    DrawerScreens: undefined;
    ResultIndividualQueryScreen: undefined;
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
                headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
            }}
        >
            <Stack.Screen name='DrawerScreens' options={{ headerShown: false }} component={DrawerScreens} />
            <Stack.Screen name='ResultIndividualQueryScreen' component={ResultIndividualQueryScreen} />
            <Stack.Screen name='ResultGroupQueryScreen' component={ResultGroupQueryScreen} />
        </Stack.Navigator>
    )
}
