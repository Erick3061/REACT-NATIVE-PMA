import React, { useReducer } from 'react';
import { createContext } from 'react';
import { Percentajes } from '../interfaces/interfaces';
import { HeaderTableValues } from '../types/types';
type State = {
    data?: Array<any>;
    titles?: HeaderTableValues;
    usePagination?: boolean;
    percentajes?: Percentajes;
}

const initialState: State = {
    titles: undefined,
    data: undefined,
    usePagination: undefined,
    percentajes: undefined
}

type Action =
    | { type: 'updateData', payload?: Array<any> }
    | { type: 'updateTitles', payload?: HeaderTableValues }
    | { type: 'updatePagination', payload?: boolean }
    ;

const Reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'updateData':
            return {
                ...state,
                data: action.payload
            }

        case 'updateTitles':
            return {
                ...state
            }

        case 'updatePagination':
            return {
                ...state
            }

        default: return state;
    }
}

interface ContextProps extends State {

}

export const TableContext = createContext({} as ContextProps);

export const TableProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    const updateData = () => {

    }

    return (
        <TableContext.Provider
            value={{
                ...state
            }}
        >
            {children}
        </TableContext.Provider>
    )
}