import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import activityCoordinates from './HomeScreen';

const ChooseActivityScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { activity, coordinates, extractedData } = route.params;
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const getAddressFromCoordinates = async () => {
      try {
        const addressData = await Location.reverseGeocodeAsync({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
        const formattedAddress = `${addressData[0].name}, ${addressData[0].city}`;
        setAddress(formattedAddress);
      } catch (error) {
        console.error('Error fetching address:', error);
        setAddress('Address not available');
      }
    };

    getAddressFromCoordinates();
  }, [coordinates]);

  const openMapsApp = () => {
    if (Platform.OS === 'ios') {
      const url = `http://maps.apple.com/?ll=${coordinates.latitude},${coordinates.longitude}`;
      Linking.openURL(url);
    } else if (Platform.OS === 'android') {
      const url = `geo:${coordinates.latitude},${coordinates.longitude}`;
      Linking.openURL(url);
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleStartActivity = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{activity}</Text>
      <Text style={styles.address}>{address}</Text>
      <TouchableOpacity style={styles.mapButton} onPress={openMapsApp}>
        <Text style={styles.mapButtonText}>Ouvrir avec Maps</Text>
      </TouchableOpacity>
      {Platform.OS !== 'web' && coordinates && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
            title={activity}
          />
        </MapView>
      )}
      <TouchableOpacity style={styles.activityButton} onPress={handleStartActivity}>
        <Text style={styles.activityButtonText}>Commencer Activité</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
        <Text style={styles.returnButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  address: {
    marginBottom: 10,
  },
  mapButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    width: '90%',
    height: 200,
  },
  activityButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  activityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  returnButton: {
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChooseActivityScreen;

