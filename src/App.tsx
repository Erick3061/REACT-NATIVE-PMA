import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as StoreProvider } from "react-redux";
import { StyleSheet } from 'react-native';
import { store } from './app/store';
import { Root } from './navigation/Root';
import { OrientationProvider } from './context/OrientationContext';

export const App = () => {
  const queryClient = new QueryClient();
  const OrientationState = ({ children }: any) => {
    return (
      <OrientationProvider>
        {children}
      </OrientationProvider>
    )
  }

  return (
    <OrientationState>
      <StoreProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <Root />
        </QueryClientProvider>
      </StoreProvider >
    </OrientationState>
  );
}

export const stylesApp = StyleSheet.create({
  shadow: {
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.20,
    shadowRadius: 100,
    elevation: 4,
  }
});