import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    checkSavedLogin();
  }, []);

  const checkSavedLogin = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
      }
    } catch (error) {
      console.error('Error retrieving saved login:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://points-air.ecolingui.ca/api/v1/user/${username}`);
      if (response.ok) {
        const userData = await response.json();
        await AsyncStorage.setItem('username', username);
        navigation.navigate('Home', { user: userData });
      } else if (response.status == 404) {
        /* Logic to create new user here, for the moment we will simply create one! */
        const putResponse = await fetch("https://points-air.ecolingui.ca/api/v1/user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom: username,
            nom_complet: "Test User",
            sports: ["Marche", "Vélo"],
          })
        });
        if (putResponse.ok) {
          const userData = await putResponse.json();
          await AsyncStorage.setItem('username', username);
          navigation.navigate('Home', { user: userData });
        }
        else {
          throw `Could not create user ${username}`;
        }
      } else {
        setLoginError('Login unsuccessful. Please check your username and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Points Air</Text> {/*PointsAir*/}
      <TextInput
        label="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 16,
    color: 'red',
    textAlign: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 32, 
    textAlign: 'center',
  }
});

export default LoginScreen;
