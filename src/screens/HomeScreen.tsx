import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import * as Location from 'expo-location';

// Define a variable to store the location value
export let userLocation: any;

const HomeScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [city, setCity] = useState<string | null>(null); // State variable to store the city name
  const [apiData, setApiData] = useState<any[]>([]); // State variable to store the API data

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
        // Update the userLocation variable
        userLocation = locationData.coords;

        // Check if the user is inside a city
        checkCity();
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Location error', 'An error occurred while fetching your location.');
      }
    };

    getLocation();
  }, []); // Empty dependency array ensures this effect runs only once

  // Function to check if the user is inside a city
  const checkCity = async () => {
    try {
      const response = await fetch(`https://points-air.ecolingui.ca/api/v1/ville/${48.39655282994837},${-68.60286798011532}?geometrie=False`);
      const data = await response.json();
      // If the API returns data, set the city state variable to the name of the city
      if (data) {
        setCity(data.nom);
        // Fetch activities near the user's location
        fetchActivities(48.39655282994837, -68.60286798011532);
      }
    } catch (error) {
      console.error('Error checking city:', error);
    }
  };

  // Function to fetch activities near the user's location
// Function to fetch activities near the user's location
const fetchActivities = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(`https://points-air.ecolingui.ca/api/v1/plateaux/${latitude},${longitude}?proximite=10&limit=10&geometrie=false`);
    const data = await response.json();
    // If the API returns data and it's an array, update the state with the fetched activities
    if (Array.isArray(data)) {
      const extractedData = data.map(([_, activity]: [number, any]) => ({
        nom: activity.nom,
        saison: activity.saison,
        sports: activity.sports,
      }));
      setApiData(extractedData);
    }
  } catch (error) {
    console.error('Error fetching activities:', error);
  }
};


  const navigateToScreen = (screenName: string) => {
    navigation.dispatch(CommonActions.navigate({ name: screenName }));
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const drawerActivities = [
    'Expérience Immersive de Randonnée',
  ];

  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={() => <DrawerContent activityChoices={drawerActivities} navigate={navigateToScreen} />}>
      <Drawer.Screen name="Recommandations" options={{ drawerLabel: 'Accueil' }}>
        {() => (
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
              {apiData.map((activity: any, index: number) => (
                <TouchableOpacity key={index} onPress={() => navigateToScreen(activity.nom)}>
                  <Card style={styles.activityCard}>
                    <Card.Title title={activity.nom} />
                    <Card.Content>
                    <Text>Sports: {Array.isArray(activity.sports) ? activity.sports.join(', ') : 'No sports available'}</Text> {/* Modified line */}
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
                {city && <Text>You are in {city}</Text>} {/* Display the city name if available */}
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
