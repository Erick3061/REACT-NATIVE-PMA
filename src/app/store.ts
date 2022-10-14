import { configureStore, combineReducers, MiddlewareArray } from "@reduxjs/toolkit";
import alertSlice from '../features/alertSlice';
import appSlice from "../features/appSlice";
export const store = configureStore({
    reducer: {
        app: appSlice,
        alerts: alertSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;