import React from "react";
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, useDrawerStatus } from "@react-navigation/drawer";
import { Text, View } from "react-native";
import { Avatar, Drawer, IconButton } from "react-native-paper";
import { HomeScreen } from '../screens/private/HomeScreen';
import { ProfileScreen } from "../screens/private/ProfileScreen";
import { useAppSelector } from '../app/hooks';
import { useDispatch } from 'react-redux';
import { LogOut } from "../features/appSlice";
import { DetailsInfoScreen } from '../screens/private/DetailsInfoScreen';
import { updateError, updateThemeView } from "../features/alertSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupsScreen } from '../screens/private/GroupsScreen';
import { AccountsScreen } from '../screens/private/AccountsScreen';
import { AdvancedScreen } from '../screens/private/AdvancedScreen';
import Color from "color";
import { colors } from '../config/colors';
import { useNavigation } from "@react-navigation/native";


export type RootDrawerNavigator = {
    HomeScreen: undefined;
    ProfileScreen: undefined;
    AccountsScreen: undefined;
    GroupsScreen: undefined;
    DetailsInfoScreen: undefined;
    AdvancedScreen: undefined;
}

const menuDrawer = createDrawerNavigator<RootDrawerNavigator>();

export const DrawerScreens = () => {
    return (
        <menuDrawer.Navigator
            drawerContent={(Props) => <MenuContent {...Props} />}
        >
            <menuDrawer.Screen name="HomeScreen" options={{ title: 'INICIO' }} component={HomeScreen} />
            <menuDrawer.Screen name="ProfileScreen" options={{ title: 'CAMBIAR CONTRASEÑA' }} component={ProfileScreen} />
            <menuDrawer.Screen name="AccountsScreen" options={{ title: 'Individual' }} component={AccountsScreen} />
            <menuDrawer.Screen name="GroupsScreen" options={{ title: 'Grupal' }} component={GroupsScreen} />
            <menuDrawer.Screen name="AdvancedScreen" options={{ title: 'Avanzado' }} component={AdvancedScreen} />
            <menuDrawer.Screen name="DetailsInfoScreen" options={{ title: 'PEMSA monitoreo APP' }} component={DetailsInfoScreen} />
        </menuDrawer.Navigator>
    )
}

const MenuContent = ({ navigation, state }: DrawerContentComponentProps) => {
    const { index, routeNames } = state;
    const { theme: { colors, fonts }, User } = useAppSelector(state => state.app);
    const dispatch = useDispatch();

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                {
                    User &&
                    <>
                        <Text style={[fonts.titleMedium, { textAlign: 'left', color: colors.text }]}>PEMSA monitoreo APP © ®</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar.Text label={User.fullName.split(' ').map(el => el[0]).join('').slice(0, 2).toUpperCase()} />
                            <View style={{ padding: 5 }}>
                                <Text style={[fonts.bodyMedium, { color: colors.text }]}>{User.fullName}</Text>
                                <Text style={[fonts.bodyMedium, { color: colors.text }]}>{User.email}</Text>
                            </View>
                        </View>
                        {/* <Text style={{}} variant="titleMedium">PEMSA monitoreo APP © ®</Text>
                        <Avatar.Text label={User.fullName.split(' ').map(el => el[0]).join('').slice(0, 2).toUpperCase()} style={{ marginVertical: 5 }} />
                        <Text style={{}} variant="bodyMedium">{User.fullName}</Text>
                        <Text style={{}} variant="bodyMedium">{User.email}</Text> */}
                    </>
                }
            </View>
            <DrawerContentScrollView>
                <Drawer.Item
                    active={routeNames[index] === 'HomeScreen' && true}
                    icon="home"
                    label="INICIO"
                    onPress={() => navigation.navigate<keyof RootDrawerNavigator>("HomeScreen")}
                />

                <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: Color(colors.primary).alpha(.6).toString(), marginHorizontal: 10 }}>Consultas</Text>
                    <Drawer.Item active={routeNames[index] === 'AccountsScreen' && true} icon="home-variant" label="INDIVIDUAL" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('AccountsScreen')} />
                    <Drawer.Item active={routeNames[index] === 'GroupsScreen' && true} icon="home-group" label="GRUPAL" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('GroupsScreen')} />
                    <Drawer.Item active={routeNames[index] === 'AdvancedScreen' && true} icon="image-filter-center-focus-strong-outline" label="AVANZADO" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('AdvancedScreen')} />
                </View>

                <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: Color(colors.primary).alpha(.6).toString(), marginHorizontal: 10 }}>Usuarios</Text>
                    <Drawer.Item icon="account" label="ADMINISTRAR USUARIOS" />
                </View>

                <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: Color(colors.primary).alpha(.6).toString(), marginHorizontal: 10 }}>Configuración</Text>
                    <Drawer.Item active={routeNames[index] === 'ProfileScreen' && true} icon="lock" label="CAMBIAR CONTRASEÑA" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('ProfileScreen')} />
                    <Drawer.Item
                        active={routeNames[index] === 'ThemeScreen' && true}
                        icon="palette"
                        label="TEMA"
                        onPress={() => {
                            navigation.closeDrawer();
                            dispatch(updateThemeView(true));
                        }}
                    />
                    <Drawer.Item active={routeNames[index] === 'DetailsInfoScreen' && true} icon="help-circle" label="PEMSA monitoreo APP" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('DetailsInfoScreen')} />
                </View>

            </DrawerContentScrollView>
            <View >

                <Drawer.Item icon="power" label="Cerrar sesión" onPress={async () => {
                    try {
                        await AsyncStorage.removeItem('token');
                        dispatch(LogOut())
                    } catch (error) { dispatch(updateError({ open: true, icon: true, msg: JSON.stringify(error) })) }
                }} />
            </View>
        </View>
    )
}
