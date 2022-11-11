import { useEffect, useState } from "react";
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { StatusBar, View } from "react-native";
import { Avatar, Drawer, Text } from "react-native-paper";
import { HomeScreen } from '../screens/private/HomeScreen';
import { ProfileScreen } from "../screens/private/ProfileScreen";
import { screenHeight } from '../config/Dimensions';
import { useAppSelector } from '../app/hooks';
import { useDispatch } from 'react-redux';
import { LogOut } from "../features/appSlice";
import { DetailsInfoScreen } from '../screens/private/DetailsInfoScreen';
import { updateError, updateThemeView } from "../features/alertSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupsScreen } from '../screens/private/GroupsScreen';
import { AccountsScreen } from '../screens/private/AccountsScreen';


export type RootDrawerNavigator = {
    HomeScreen: undefined;
    ProfileScreen: undefined;
    AccountsScreen: undefined;
    GroupsScreen: undefined;
    DetailsInfoScreen: undefined;
    AvanzadoScreen: undefined;
}

const menuDrawer = createDrawerNavigator<RootDrawerNavigator>();

export const DrawerScreens = () => {
    const { colors } = useAppSelector(state => state.app.theme);
    return (
        <menuDrawer.Navigator
            screenOptions={{
                // headerStyle: { backgroundColor: colors.primary },
                // headerTintColor: colors.onPrimary,
            }}
            drawerContent={(Props) => <MenuContent {...Props} />}
        >
            <menuDrawer.Screen name="HomeScreen" options={{ title: 'INICIO' }} component={HomeScreen} />
            <menuDrawer.Screen name="ProfileScreen" options={{ title: 'CAMBIAR CONTRASEÑA' }} component={ProfileScreen} />
            <menuDrawer.Screen name="AccountsScreen" options={{ title: 'Individual' }} component={AccountsScreen} />
            <menuDrawer.Screen name="GroupsScreen" options={{ title: 'Grupal' }} component={GroupsScreen} />
            <menuDrawer.Screen name="AvanzadoScreen" options={{ title: 'Avanzado' }} component={AccountsScreen} />
            <menuDrawer.Screen name="DetailsInfoScreen" options={{ title: 'PEMSA monitoreo APP' }} component={DetailsInfoScreen} />
            {/* <menuDrawer.Screen name="ThemeScreen" options={{ title: 'TEMA' }} component={ThemeScreen} /> */}
        </menuDrawer.Navigator>
    )
}

const MenuContent = ({ navigation, state }: DrawerContentComponentProps) => {
    const { index, routeNames } = state;
    const [nameRote, setNameRote] = useState<string>(routeNames[0]);
    const { theme: { colors }, User } = useAppSelector(state => state.app);
    const dispatch = useDispatch();
    useEffect(() => {
        setNameRote(routeNames[index]);
    }, [index])

    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 2, borderColor: colors.primaryContainer, borderWidth: 1 }}>
                {
                    User &&
                    <>
                        <Avatar.Text label={User.fullName.split(' ').map(el => el[0]).join('').slice(0, 2).toUpperCase()} style={{ marginVertical: 5 }} />
                        <Text style={{}} variant="titleMedium">PEMSA monitoreo APP © ®</Text>
                        <Text style={{}} variant="bodyMedium">{User.fullName}</Text>
                        <Text style={{}} variant="bodyMedium">{User.email}</Text>
                    </>
                }
            </View>
            <DrawerContentScrollView style={{ flex: 1, maxHeight: screenHeight, paddingVertical: 10 }}>
                <Drawer.Item active={nameRote === 'HomeScreen' && true} icon="home" label="INICIO" onPress={() => navigation.navigate<keyof RootDrawerNavigator>("HomeScreen")} />
                <Drawer.Section title="Consultas">
                    <Drawer.Item active={nameRote === 'AccountsScreen' && true} icon="database-search" label="INDIVIDUAL" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('AccountsScreen')} />
                    <Drawer.Item active={nameRote === 'GroupsScreen' && true} icon="database-search" label="GRUPAL" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('GroupsScreen')} />
                    <Drawer.Item active={nameRote === 'AvanzadoScreen' && true} icon="database-search" label="AVANZADO" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('AccountsScreen')} />
                </Drawer.Section>
                <Drawer.Item active={nameRote === 'ProfileScreen' && true} icon="lock" label="CAMBIAR CONTRASEÑA" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('ProfileScreen')} />
                <Drawer.Item icon="account" label="ADMINISTRAR USUARIOS" />
            </DrawerContentScrollView>
            <View >
                <Drawer.Item active={nameRote === 'DetailsInfoScreen' && true} icon="help-circle" label="PEMSA monitoreo APP" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('DetailsInfoScreen')} />
                <Drawer.Item
                    active={nameRote === 'ThemeScreen' && true}
                    icon="palette"
                    label="TEMA"
                    onPress={() => {
                        navigation.closeDrawer();
                        dispatch(updateThemeView(true));
                    }}
                />
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
