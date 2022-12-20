import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { Theme } from "@react-navigation/native";
import { CombinedLightTheme } from "../config/theme/Theme";
import { User } from '../interfaces/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeBase } from "../types/types";

interface appSlice {
    status: boolean;
    versionApp: string;
    theme: ThemeBase & Theme;
    isShowWellcome: boolean;
    User?: User;
};

const initialState: appSlice = {
    status: false,
    versionApp: '1.0',
    theme: CombinedLightTheme,
    isShowWellcome: true,
    User: undefined,
};

export const test = createAsyncThunk('LogIn', async (User: User) => {
    try {
        await AsyncStorage.setItem('token', User.token);
        return User;
    } catch (error) { console.log('Error') }
});

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        LogOut: (state) => {
            state.User = undefined;
            state.status = false;
        },
        updateTheme: (state, action: PayloadAction<ThemeBase & Theme>) => {
            state.theme = action.payload;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.User = action.payload;
            state.status = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(test.fulfilled, (state, { payload }) => {
            state.User = payload;
        })
    }
});

export const { updateTheme, LogOut, setUser } = appSlice.actions;
export const app = (state: RootState) => state.app;
export default appSlice.reducer;