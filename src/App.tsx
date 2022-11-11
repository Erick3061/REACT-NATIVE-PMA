import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { Provider as StoreProvider } from "react-redux";
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
