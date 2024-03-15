// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/components/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import AboutScreen from './src/screens/AboutScreen';
import ListeEEE from './src/screens/ListeEEE';
import ChooseActivityScreen from './src/screens/ChooseActivityScreen';
import RankScreen from './src/screens/RankScreen'; 

const Stack = createNativeStackNavigator();

const App = () => {
  const isLoggedIn = false;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Splash'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="ListeEEE" component={ListeEEE} /> 
        <Stack.Screen name="ChooseActivityScreen" component={ChooseActivityScreen} />
        <Stack.Screen name="RankScreen" component={RankScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
