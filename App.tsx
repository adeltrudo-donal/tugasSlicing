/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { CafesProvider } from './src/context/CafesContext';

const App = () => {
  return (
    <CafesProvider>
      <AppNavigator />
    </CafesProvider>
  );
};

export default App;
