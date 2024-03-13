import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import * as Location from 'expo-location';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationPermission(false);
        return;
      }
      
      setLocationPermission(true);
      try {
        const locationData = await Location.getCurrentPositionAsync({});
        setLocation(`Latitude: ${locationData.coords.latitude}, Longitude: ${locationData.coords.longitude}`);
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Location error', 'An error occurred while fetching your location.');
      }
    };

    getLocation();
  }, []); // Empty dependency array ensures this effect runs only once

  const navigateToScreen = (screenName: string) => {
    navigation.dispatch(CommonActions.navigate({ name: screenName }));
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const mainContentActivities = [
    'Randonnée en Montagne',
    'Route 2 piste Cyclable - Laval',
  ];

  const drawerActivities = [
    'Expérience Immersive de Randonnée',
  ];

  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={() => <DrawerContent activityChoices={drawerActivities} navigate={navigateToScreen} />}>
      <Drawer.Screen name="Recommandations" options={{ drawerLabel: 'Accueil' }}>
        {() => (
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
              {mainContentActivities.map((activity, index) => (
                <TouchableOpacity key={index} onPress={() => navigateToScreen(activity)}>
                  <Card style={styles.activityCard}>
                    <Card.Title title={activity} />
                    <Card.Content>
                      <Text>{activity}</Text>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {locationPermission === false && (
              <View style={styles.locationContainer}>
                <Text>Location permission denied. Please enable location access.</Text>
              </View>
            )}
            {locationPermission === true && location && (
              <View style={styles.locationContainer}>
                <Text>Your Location:</Text>
                <Text>{location}</Text>
              </View>
            )}
          </View>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const DrawerContent = ({ activityChoices, navigate }: { activityChoices: string[], navigate: (screenName: string) => void }) => {
  return (
    <DrawerContentScrollView>
      <DrawerItem label="Notre projet" onPress={() => navigate('AboutScreen')} />
      <DrawerItem label="Sortir de sa Zone de Confort" onPress={() => navigate('ConfortScreen')} />
      <DrawerItem label="Toutes les randonnees" onPress={() => navigate('CompleteScreen')} />
      <DrawerItem label="Pointage Communautaire" onPress={() => navigate('RankScreen')} />
      {activityChoices.map((activity, index) => (
        <DrawerItem key={index} label={activity} onPress={() => navigate(activity)} />
      ))}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  activityCard: {
    marginBottom: 16,
  },
  locationContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
