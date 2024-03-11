// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';

const SplashScreen = ({ navigation }: { navigation: any }) => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    const navigateToLogin = () => {
      navigation.navigate('Login');
    };

    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(navigateToLogin);
  }, [spinValue, navigation]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/loading.png')}
        style={{ ...styles.logo, transform: [{ rotate: spin }] }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
