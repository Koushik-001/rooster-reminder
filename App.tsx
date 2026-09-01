import { HomePage } from 'components/HomePage';
import { StatusBar } from 'expo-status-bar';

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <HomePage title="Home" path="App.tsx"></HomePage>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
