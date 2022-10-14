import React from 'react';
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, TransitionSpecs } from "@react-navigation/stack";
import { IntroductionScreen } from '../screens/public/IntroductionScreen';
import { LogInScreen } from '../screens/public/LogInScreen';
import { SplashScreen } from '../screens/public/SplashScreen';

export type rootPublicScreen = {
    SplashScreen: undefined;
    LogInScreen: undefined;
    ForgetPasswordScreen: undefined;
    IntroductionScreen: undefined;
}

export const PublicScreens = () => {
    const Stack = createStackNavigator<rootPublicScreen>();

    return (
        <Stack.Navigator
            initialRouteName='SplashScreen'
            screenOptions={{
                transitionSpec: {
                    open: TransitionSpecs.TransitionIOSSpec,
                    close: TransitionSpecs.TransitionIOSSpec,
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
            }}
        >
            <Stack.Screen name='SplashScreen' options={{ headerShown: false }} component={SplashScreen} />
            <Stack.Screen name='IntroductionScreen' options={{ headerShown: false }} component={IntroductionScreen} />
            <Stack.Screen name='LogInScreen' options={{ headerShown: false }} component={LogInScreen} />
            {/* <Stack.Screen name='ForgetPasswordScreen' options={{}} component={ForgetPasswordScreen} /> */}
        </Stack.Navigator>
    )
}
