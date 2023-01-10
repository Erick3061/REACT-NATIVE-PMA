import { createContext, useEffect, useReducer } from "react";
import { Alert, Dimensions, LayoutRectangle, Platform } from "react-native";
import { Orientation } from '../interfaces/interfaces';
import { useAppDispatch } from '../app/hooks';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import { useQueryClient } from "@tanstack/react-query";
import { PERMISSIONS, requestMultiple, checkMultiple } from 'react-native-permissions';
import RNFetchBlob, { FetchBlobResponse } from 'rn-fetch-blob';
import { baseUrl } from "../api/Api";
import { logOut } from '../features/appSlice';

type State = {
    orientation: Orientation;
    screenHeight: number,
    screenWidth: number,
    top: number;
    bottom: number;
    isDownload: boolean;
}

type Action =
    | { type: 'changeOrientation', payload: Orientation }
    | { type: 'changeToBo', payload: { top: number; bottom: number; } }
    | { type: 'Screen', payload: { width: number, height: number } }
    | { type: 'updateIsDownload', payload: boolean }
    ;

const initialState: State = {
    orientation: Orientation.portrait,
    screenWidth: 0,
    screenHeight: 0,
    top: 0,
    bottom: 0,
    isDownload: false,
}
interface funcDownload {
    endpoint: string;
    tokenTemp?: string;
    data: {
        accounts: Array<number>,
        typeAccount: number,
        dateStart?: string,
        dateEnd?: string,
        showGraphs: boolean
    }
    fileName: string,
}

interface ContextProps extends State {
    changeOrientation: (props: Orientation) => void;
    handleError: (error: string) => void;
    setToBo: (props: LayoutRectangle) => void;
    downloadReport: (props: funcDownload) => void;
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

        case 'Screen':
            return {
                ...state,
                screenHeight: action.payload.height,
                screenWidth: action.payload.width
            }
        case 'updateIsDownload':
            return {
                ...state,
                isDownload: action.payload
            }

        default: return state;
    }

}

export const HandleProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const appDispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const androidPermissions = [
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ];

    useEffect(() => {
        Platform.OS === 'android' &&
            checkMultiple(androidPermissions)
                .then(result => {
                    requestMultiple(androidPermissions)
                        .then(response => {
                            // console.log(response);
                        })
                        .catch(error => {
                            // console.log(error);
                        });
                })
                .catch(error => Alert.alert('Error', String(error)));

        const { width, height } = Dimensions.get('screen');
        if (height >= width) {//portrait
            dispatch({ type: 'changeOrientation', payload: Orientation.portrait });
            dispatch({ type: 'Screen', payload: { height, width } });
        } else {//landscape
            dispatch({ type: 'changeOrientation', payload: Orientation.landscape });
            dispatch({ type: 'Screen', payload: { height: width, width: height } });
        }
    }, []);

    const handleError = (error: string) => {
        if (error === 'La sesión expiro, inicie sesión nuevamente') {
            queryClient.clear();
            AsyncStorage.removeItem('token').then(() => appDispatch(logOut())).catch(error => {
                Toast.show({ type: 'error', text1: 'Error', text2: String(error) });
            });
        }
        if (error.includes('Unauthorized') || error.includes('unauthorized')) {
            AsyncStorage.removeItem('token').then(() => appDispatch(logOut())).catch(error => {
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

    const downloadReport = async ({ endpoint, tokenTemp, data, fileName }: funcDownload) => {
        const url = `${baseUrl}/reports/${endpoint}`;
        const token = tokenTemp ?? await AsyncStorage.getItem('token');
        const headers: HeadersInit_ | undefined = {};
        (token) ? Object.assign(headers, { 'Content-type': 'application/json', 'Authorization': `Bearer ${token}` }) : Object.assign(headers, { 'Content-type': 'application/json', });
        dispatch({ type: 'updateIsDownload', payload: true });
        const path = (Platform.OS === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir)
        const directory = path + '/' + fileName;

        RNFetchBlob
            .fetch('POST', url, headers, JSON.stringify(data))
            .then(async (resp: FetchBlobResponse) => {
                if (resp.type === 'base64') {
                    try {
                        const exist = await RNFetchBlob.fs.exists(directory);
                        if (exist) {
                            const files = await RNFetchBlob.fs.ls(path);
                            const numFiles = files.filter(a => a.includes(fileName.replace('.pdf', ''))).length;
                            const newFileName = fileName.replace('.pdf', ` ${numFiles}.pdf`);
                            const newDirectory = path + '/' + newFileName;
                            await RNFetchBlob.fs.createFile(newDirectory, resp.data, 'base64');
                            Toast.show({ text1: `${newFileName}`, text2: 'Creado existosamente', autoHide: true, visibilityTime: 2000 });
                        } else {
                            await RNFetchBlob.fs.createFile(directory, resp.data, 'base64');
                            Toast.show({ text1: `${fileName}`, text2: 'Creado existosamente', autoHide: true, visibilityTime: 2000 });
                        }
                    } catch (error) {
                        throw (String(error))
                    }
                }
                else {
                    if (resp.type === 'utf8') throw (JSON.stringify(resp.data, null, 3));
                    else { throw (JSON.stringify(resp, null, 3)); }
                }
            })
            .catch(error => {
                handleError(String(error));
                Toast.show({ text1: 'Error', text2: String(error), type: 'error' });
            })
            .finally(() => dispatch({ type: 'updateIsDownload', payload: false }))
    }

    return (
        <HandleContext.Provider
            value={{
                ...state,
                changeOrientation,
                handleError,
                setToBo,
                downloadReport
            }}
        >
            {children}
        </HandleContext.Provider>
    )
}