import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { PropsAlert, Question } from '../interfaces/interfaces';

interface alertState {
    error: PropsAlert;
    warning: boolean;
    success: boolean;
    info: PropsAlert;
    question: PropsAlert & Question;
    tcyap: { open: boolean, showTC?: Question };
    theme: boolean;
};

const initialState: alertState = {
    error: { open: false, msg: '' },
    warning: false,
    success: false,
    info: { open: false, msg: '' },
    question: { open: false, msg: '' },
    tcyap: { open: false },
    theme: false,
};

export const alertSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        updateError: (state, action: PayloadAction<PropsAlert>) => {
            state.error = action.payload;
        },
        updateQuestion: (state, action: PayloadAction<PropsAlert & Question>) => {
            state.question = action.payload;
        },
        updateInfo: (state, action: PayloadAction<PropsAlert>) => {
            state.info = action.payload;
        },
        updateTcyAp: (state, action: PayloadAction<{ open: boolean, showTC?: Question }>) => {
            state.tcyap = action.payload;
        },
        updateThemeView: (state, action: PayloadAction<boolean>) => {
            state.theme = action.payload;
        }
    }
});

export const { updateError, updateInfo, updateTcyAp, updateQuestion, updateThemeView } = alertSlice.actions;
export const selectAlert = (state: RootState) => state.alerts;
export default alertSlice.reducer;