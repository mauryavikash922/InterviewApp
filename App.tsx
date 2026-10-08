import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { RootTabs } from './src/navigation/RootTabs';
import { store } from './src/store/store';
import { loadBookings } from './src/store/slices/bookings.slice';

export default function App() {
  useEffect(() => {
    const request = store.dispatch(loadBookings());
    return () => request.abort();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootTabs />
          </NavigationContainer>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
