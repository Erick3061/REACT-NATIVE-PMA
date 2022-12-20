import React from "react";
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { Pressable, StyleSheet, View, PressableProps } from 'react-native';
import { HomeScreen } from '../screens/private/HomeScreen';
import { ProfileScreen } from "../screens/private/ProfileScreen";
import { useAppSelector } from '../app/hooks';
import { useDispatch } from 'react-redux';
import { LogOut, updateTheme } from "../features/appSlice";
import { DetailsInfoScreen } from '../screens/private/DetailsInfoScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupsScreen } from '../screens/private/GroupsScreen';
import { AccountsScreen } from '../screens/private/AccountsScreen';
import { AdvancedScreen } from '../screens/private/AdvancedScreen';
import Color from "color";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CombinedDarkTheme, CombinedLightTheme } from "../config/theme/Theme";
import { AppBar } from "../components/AppBar";
import Text from "../components/Text";

export type RootDrawerNavigator = {
    HomeScreen: undefined;
    ProfileScreen: undefined;
    AccountsScreen: undefined;
    GroupsScreen: undefined;
    DetailsInfoScreen: undefined;
    AdvancedScreen: undefined;
}

interface PropsItem extends PressableProps {
    icon?: string;
    label: string;
    active?: boolean;
}

const menuDrawer = createDrawerNavigator<RootDrawerNavigator>();

export const DrawerScreens = () => {
    const { theme: { colors, fonts, dark } } = useAppSelector(state => state.app);
    return (
        <menuDrawer.Navigator
            drawerContent={(Props) => <MenuContent {...Props} />}
            screenOptions={{
                header: (({ layout, navigation, options, route }) =>
                    <AppBar
                        left={<Icon style={{ paddingHorizontal: 12 }} name="menu" size={30} color={colors.text} onPress={() => navigation.openDrawer()} />}
                        label={options.title ?? ''}
                    />
                )
            }}
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



const RenderItem = (props: PropsItem) => {
    const { icon, label, active } = props;
    const { theme: { colors, roundness, fonts } } = useAppSelector(state => state.app);
    const borderRadius: number = roundness * 3;
    const style = StyleSheet.create({
        container: {
            padding: 6,
            alignItems: 'center',
            backgroundColor: !active ? colors.background : colors.primaryContainer,
            marginVertical: 5,
            marginRight: 15,
            borderTopRightRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            borderRightWidth: active ? 1 : undefined,
            borderTopWidth: active ? 1 : undefined,
            borderBottomWidth: active ? 1 : undefined,
            borderColor: Color(colors.primaryContainer).darken(.1).toString()
        },
        icon: {
            marginLeft: 20,
            marginRight: 10,
            transform: [{
                scale: active ? 1.5 : 1,
            }]
        },
        label: {
            fontWeight: !active ? 'normal' : 'bold',
            color: active ? colors.primary : colors.onSurface
        }
    });

    return (
        <Pressable {...props} style={[style.container, { flexDirection: 'row' }]}>
            {({ pressed }) => {
                return (
                    <>
                        {icon && <Icon style={style.icon} name={icon} size={25} color={active ? colors.primary : colors.onSurface} />}
                        <Text variant="labelMedium" style={[style.label]}>{label}</Text>
                    </>
                )
            }}
        </Pressable>
    )


}

const MenuContent = ({ navigation, state }: DrawerContentComponentProps) => {
    const { index, routeNames } = state;
    const { theme, User } = useAppSelector(state => state.app);
    const { colors, fonts, roundness, dark } = theme;
    const dispatch = useDispatch();
    const iconSize: number = 20;

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                {
                    User &&
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                        <View style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 100, height: 50, width: 50, justifyContent: 'center' }}>
                            <Text
                                variant="headlineSmall"
                                style={[
                                    {
                                        color: colors.background,
                                        textAlign: 'center'
                                    }]}
                            >{User.fullName.split(' ').map(el => el[0]).join('').slice(0, 2).toUpperCase()}</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text variant="titleLarge">{User.fullName}</Text>
                            <Text variant="titleSmall">{User.email}</Text>
                        </View>
                    </View>
                }
            </View>
            <DrawerContentScrollView>

                <RenderItem
                    active={routeNames[index] === 'HomeScreen' && true}
                    icon="home"
                    label="INICIO"
                    onPress={() => navigation.navigate<keyof RootDrawerNavigator>("HomeScreen")}
                />

                <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: colors.primary, fontWeight: '600', marginLeft: 30 }}>Consultas</Text>
                    <RenderItem active={routeNames[index] === 'AccountsScreen' && true} icon="home-variant" label="INDIVIDUAL" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('AccountsScreen')} />
                    <RenderItem active={routeNames[index] === 'GroupsScreen' && true} icon="home-group" label="GRUPAL" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('GroupsScreen')} />
                    <RenderItem active={routeNames[index] === 'AdvancedScreen' && true} icon="image-filter-center-focus-strong-outline" label="AVANZADO" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('AdvancedScreen')} />
                </View>

                <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: colors.primary, fontWeight: '600', marginLeft: 30 }}>Usuarios</Text>
                    <RenderItem icon="account" label="ADMINISTRAR USUARIOS" />
                </View>

                <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: colors.primary, fontWeight: '600', marginLeft: 30 }}>Configuración</Text>
                    <RenderItem active={routeNames[index] === 'ProfileScreen' && true} icon="lock" label="CAMBIAR CONTRASEÑA" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('ProfileScreen')} />
                    <RenderItem active={routeNames[index] === 'DetailsInfoScreen' && true} icon="help-circle" label="PEMSA monitoreo APP" onPress={() => navigation.navigate<keyof RootDrawerNavigator>('DetailsInfoScreen')} />
                </View>
            </DrawerContentScrollView>
            <View style={{ paddingBottom: 15 }}>
                <Text style={{ color: colors.primary, fontWeight: '600', marginLeft: 25 }}>Tema</Text>
                <View style={{ alignItems: 'center', marginVertical: 5, marginBottom: 10 }}>
                    <View style={[styles.containerST, { borderRadius: roundness * 3 }]}>
                        <Pressable
                            style={[styles.containerOpT, { borderRadius: roundness * 3, borderColor: colors.primaryContainer }, (dark === false) && { backgroundColor: colors.primaryContainer }]}
                            onPress={() => dispatch(updateTheme(CombinedLightTheme))}
                        >
                            <Icon style={[styles.icon]} name="white-balance-sunny" size={iconSize} color={colors.text} />
                            <Text style={[fonts.titleSmall, { color: colors.text }]}>Claro</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.containerOpT, { borderRadius: roundness * 3, borderColor: colors.primaryContainer }, (dark) && { backgroundColor: colors.primaryContainer }]}
                            onPress={() => dispatch(updateTheme(CombinedDarkTheme))}
                        >
                            <Icon style={[styles.icon]} name="weather-night" size={iconSize} color={colors.text} />
                            <Text style={[fonts.titleSmall, { color: colors.text }]}>Oscuro</Text>
                        </Pressable>
                    </View>
                </View>
                <RenderItem icon="logout" label="Cerrar sesión" onPress={async () => {
                    try {
                        await AsyncStorage.removeItem('token');
                        dispatch(LogOut())
                    } catch (error) { }
                }} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    containerST: {
        flexDirection: 'row',
        paddingVertical: 5,
        width: '85%',
    },
    containerOpT: {
        flexDirection: 'row',
        marginHorizontal: 5,
        paddingVertical: 4,
        paddingHorizontal: 5,
        flex: 1,
        justifyContent: 'center',
        borderWidth: 1
    },
    icon: {
        marginRight: 5
    }
});
