import { createContext, useEffect, useReducer } from "react";
import { Dimensions } from "react-native";
import { Orientation } from "../interfaces/interfaces";

type State = {
    orientation: Orientation;
    screenHeight: number;
    screenWidth: number;
    vw: number;
    vh: number;
}

type Action =
    | { type: 'changeOrientation', payload: Orientation }
    ;

const initialState: State = {
    orientation: Orientation.portrait,
    screenHeight: Dimensions.get('window').height,
    screenWidth: Dimensions.get('window').width,
    vh: Dimensions.get('window').height / 100,
    vw: Dimensions.get('window').width / 100
}

interface ContextProps extends State {
    changeOrientation: (props: Orientation) => void;
}

export const OrientationContext = createContext({} as ContextProps);

const Reducer = (state: State, action: Action): State => {
    switch (action.type) {

        case 'changeOrientation':
            return {
                ...state,
                orientation: action.payload
            }

        default: return state;
    }

}

export const OrientationProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    Dimensions.addEventListener('change', ({ screen, window }) => {
        if (screen.height >= screen.width) {//portrait
            dispatch({ type: 'changeOrientation', payload: Orientation.portrait });
        } else {//landscape
            dispatch({ type: 'changeOrientation', payload: Orientation.landscape });
        }
    });

    const changeOrientation = (props: Orientation) => {
        dispatch({ type: 'changeOrientation', payload: props });
    }

    return (
        <OrientationContext.Provider
            value={{
                ...state,
                changeOrientation
            }}
        >
            {children}
        </OrientationContext.Provider>
    )
}