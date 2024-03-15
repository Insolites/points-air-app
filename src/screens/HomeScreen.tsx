import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";
import { Platform } from 'react-native';


export let userLocation: any;
const Drawer = createDrawerNavigator();
const testLat = 48.39655282994837; //simulated location for testing, set with rimouski(none of the devs live near), if you want to test with your location, you can change the value
const testLng = -68.60286798011532; // to userLocation.latitude and userLocation.longitude

const HomeScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any[]>([]);
  const [mapRegion, setMapRegion] = useState<any>(null);

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
        userLocation = locationData.coords;

        checkCity();
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Location error', 'An error occurred while fetching your location.');
      }
    };

    getLocation();
  }, []);

  const checkCity = async () => {
    try {
      const response = await fetch(`https://points-air.ecolingui.ca/api/v1/ville/${testLat},${testLng}?geometrie=False`);
      const data = await response.json();
      if (data) {
        setCity(data.nom);
        fetchActivities(testLat, testLng);
      }
    } catch (error) {
      console.error('Error checking city:', error);
    }
  };

  const fetchActivities = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`https://points-air.ecolingui.ca/api/v1/plateaux/${latitude},${longitude}?proximite=10&limit=10&geometrie=false`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const extractedData = data.map(([_, activity]: [number, any]) => ({
          nom: activity.nom,
          saison: activity.saison,
          sports: activity.sports,
          coordinates: activity.centroide.coordinates
        }));
        setApiData(extractedData);

        const activityCoordinates = extractedData.map(activity => ({
          latitude: activity.coordinates[1],
          longitude: activity.coordinates[0]
        }));
        const cityCoordinates = {
          latitude: latitude,
          longitude: longitude
        };
        const allCoordinates = [cityCoordinates, ...activityCoordinates];
        const mapRegion = calculateMapRegion(allCoordinates);
        setMapRegion(mapRegion);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const calculateMapRegion = (coordinates: any[]) => {
    const latitudes = coordinates.map(coord => coord.latitude);
    const longitudes = coordinates.map(coord => coord.longitude);

    const maxLat = Math.max(...latitudes);
    const minLat = Math.min(...latitudes);
    const maxLng = Math.max(...longitudes);
    const minLng = Math.min(...longitudes);

    const latitudeDelta = maxLat - minLat;
    const longitudeDelta = maxLng - minLng;

    return {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLng + minLng) / 2,
      latitudeDelta,
      longitudeDelta,
    };
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
                      <Text>Sports: {Array.isArray(activity.sports) ? activity.sports.join(', ') : 'No sports available'}</Text>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {Platform.OS === 'web' ? null : (
              mapRegion && (
                <View style={styles.mapContainer}>
                  <MapView style={styles.map} region={mapRegion}>
                    {apiData.map((activity: any, index: number) => (
                      <Marker
                        key={index}
                        coordinate={{
                          latitude: activity.coordinates[1],
                          longitude: activity.coordinates[0]
                        }}
                        title={activity.nom}
                      />
                    ))}
                  </MapView>
                </View>
              )
            )}
            {locationPermission === false && (
              <View style={styles.locationContainer}>
                <Text>Location permission denied. Please enable location access.</Text>
              </View>
            )}
            {locationPermission === true && location && (
              <View style={styles.locationContainer}>
                <Text>Your Location:</Text>
                <Text>{location}</Text>
                {city && <Text>You are in {city}</Text>}
              </View>
            )}
          </View>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

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
  mapContainer: {
    alignItems: 'center',
    marginTop: 20,
    height: 200, // Increase the height to make the map larger
    marginHorizontal: 16, // Add margin horizontally for better spacing
  },
  map: {
    width: '100%',
    flex: 1, // Make the map fill the available space
    borderRadius: 10, // Optional: Add border radius for a nicer appearance
  },
});

export default HomeScreen;
