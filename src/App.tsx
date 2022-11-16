import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as StoreProvider } from "react-redux";
import { SafeAreaView } from 'react-native';
import { store } from './app/store';
import { Root } from './navigation/Root';

export const App = () => {
  const queryClient = new QueryClient();
  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={{ flex: 1 }}>
          <Root />
        </SafeAreaView>
      </QueryClientProvider>
    </StoreProvider >
  )
}
