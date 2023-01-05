import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as StoreProvider } from "react-redux";
import { StyleSheet } from 'react-native';
import { store } from './app/store';
import { Root } from './navigation/Root';
import { HandleProvider } from './context/HandleContext';

export const App = () => {
  const queryClient = new QueryClient();
  const HandleState = ({ children }: any) => {
    return (
      <HandleProvider>
        {children}
      </HandleProvider>
    )
  }

  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <HandleState>
          <Root />
        </HandleState>
      </QueryClientProvider>
    </StoreProvider >
  );
}

export const stylesApp = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  }
});