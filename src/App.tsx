// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import AboutScreen from './screens/AboutScreen';
import ConfortScreen from './screens/ConfortScreen';
import CompleteScreen from './screens/CompleteScreen';
import RankScreen from './screens/RankScreen'; 

const Stack = createNativeStackNavigator();

const App = () => {
  // Assume the user is already logged in for simplicity
  const isLoggedIn = false;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Splash'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="ConfortScreen" component={ConfortScreen} /> 
        <Stack.Screen name="CompleteScreen" component={CompleteScreen} />
        <Stack.Screen name="RankScreen" component={RankScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
