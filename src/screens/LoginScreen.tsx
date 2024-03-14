import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Text } from 'react-native';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://points-air.ecolingui.ca/api/v1/user/${username}`);
      if (response.ok) {
        const userData = await response.json();
        navigation.navigate('Home', { user: userData });
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
      <TextInput
        label="Username (FOR NOW, ITS THE ID IN THE API)"
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
});

export default LoginScreen;
