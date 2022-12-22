import { createContext, useEffect, useReducer } from "react";
import { Dimensions, LayoutRectangle } from "react-native";
import { Orientation } from "../interfaces/interfaces";
import { useAppDispatch } from '../app/hooks';
import { LogOut } from "../features/appSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import { useQueryClient } from "@tanstack/react-query";

type State = {
    orientation: Orientation;
    screenHeight: number;
    screenWidth: number;
    vw: number;
    vh: number;
    top: number;
    bottom: number;
}

type Action =
    | { type: 'changeOrientation', payload: Orientation }
    | { type: 'changeToBo', payload: { top: number; bottom: number; } }
    ;

const initialState: State = {
    orientation: Orientation.portrait,
    screenHeight: Dimensions.get('window').height,
    screenWidth: Dimensions.get('window').width,
    vh: Dimensions.get('window').height / 100,
    vw: Dimensions.get('window').width / 100,
    top: 0,
    bottom: 0,
}

interface ContextProps extends State {
    changeOrientation: (props: Orientation) => void;
    handleError: (error: string) => void;
    setToBo: (props: LayoutRectangle) => void;
}

export const HandleContext = createContext({} as ContextProps);

const Reducer = (state: State, action: Action): State => {
    switch (action.type) {

        case 'changeOrientation':
            return {
                ...state,
                orientation: action.payload
            }

        case 'changeToBo':
            return {
                ...state,
                top: action.payload.top,
                bottom: action.payload.bottom
            }

        default: return state;
    }

}

export const HandleProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const appDispatch = useAppDispatch();

    const queryClient = useQueryClient();

    Dimensions.addEventListener('change', ({ screen, window }) => {
        if (screen.height >= screen.width) {//portrait
            dispatch({ type: 'changeOrientation', payload: Orientation.portrait });
        } else {//landscape
            dispatch({ type: 'changeOrientation', payload: Orientation.landscape });
        }
    });

    const handleError = (error: string) => {
        if (error === 'La sesión expiro, inicie sesión nuevamente') {
            queryClient.clear();
            AsyncStorage.removeItem('token').then(() => appDispatch(LogOut())).catch(error => {
                Toast.show({ type: 'error', text1: 'Error', text2: String(error) });
            });
        }
    }

    const changeOrientation = (props: Orientation) => {
        dispatch({ type: 'changeOrientation', payload: props });
    }

    const setToBo = ({ height, width, x, y: top }: LayoutRectangle) => {
        dispatch({ type: 'changeToBo', payload: { top, bottom: (state.screenHeight - height) - top } });
    }

    return (
        <HandleContext.Provider
            value={{
                ...state,
                changeOrientation,
                handleError,
                setToBo
            }}
        >
            {children}
        </HandleContext.Provider>
    )
}