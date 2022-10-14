import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AccountsScreen } from './topTabs/AccountsScreen';
import { GroupsScreen } from './topTabs/GroupsScreen';
import { useAppSelector } from '../../app/hooks';

export type ScreensTabs = {
    AccountsScreen: undefined;
    GroupsScreen: undefined;
}

const Tab = createMaterialTopTabNavigator<ScreensTabs>();

export const QueryTabsScreen = () => {
    const { colors, dark, fonts } = useAppSelector(state => state.app.theme);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.onPrimary,
                tabBarStyle: { backgroundColor: colors.primary },
                tabBarIndicatorStyle: { backgroundColor: colors.notification },
                tabBarLabelStyle: { ...fonts.labelLarge }
            }}
        >
            <Tab.Screen name="AccountsScreen" options={{ tabBarLabel: 'individual' }} component={AccountsScreen} />
            <Tab.Screen name="GroupsScreen" options={{ tabBarLabel: 'grupal' }} component={GroupsScreen} />
        </Tab.Navigator>
    )
}
