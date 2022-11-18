import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as StoreProvider } from "react-redux";
import { SafeAreaView, StyleSheet } from 'react-native';
import { store } from './app/store';
import { Root } from './navigation/Root';

export const App = () => {
  const queryClient = new QueryClient();
  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={{ flex: 1, backgroundColor: store.getState().app.theme.colors.background }}>
          <Root />
        </SafeAreaView>
      </QueryClientProvider>
    </StoreProvider >
  )
}

export const stylesApp = StyleSheet.create({
  shadow: {
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});