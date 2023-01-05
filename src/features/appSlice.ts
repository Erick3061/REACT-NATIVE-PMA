import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { Theme } from "@react-navigation/native";
import { CombinedLightTheme } from "../config/theme/Theme";
import { User } from '../interfaces/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeBase } from "../types/types";
import Toast from 'react-native-toast-message';

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

export const setUser = createAsyncThunk('LogIn', async (User: User) => {
    try {
        return await AsyncStorage.setItem('token', User.token)
            .then(() => User)
            .catch(error => {
                Toast.show({ text1: 'Error', text2: String(error), type: 'error' });
                AsyncStorage.removeItem('token');
                return undefined;
            });
    } catch (error) { console.log('Error') }
});

// export const 

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
        // setUser: (state, action: PayloadAction<User>) => {
        //     state.User = action.payload;
        //     state.status = true;
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(setUser.fulfilled, (state, { payload }) => {
                state.User = payload;
                if (!payload) {
                    state.status = false
                    state.User = payload;
                }
                state.User = payload;
                state.status = true;
            })
    }
});

export const { updateTheme, LogOut } = appSlice.actions;
export const app = (state: RootState) => state.app;
export default appSlice.reducer;