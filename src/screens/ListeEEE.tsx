import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

const ListeEEE = () => {
  const navigation = useNavigation();
  const [speciesData, setSpeciesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        const response = await fetch('https://points-air.ecolingui.ca/api/v1/especes');
        const data = await response.json();
        setSpeciesData(data);
      } catch (error) {
        console.error('Error fetching species data:', error);
      }
    };

    fetchSpeciesData();
  }, []);

  const navigateBack = () => {
    navigation.dispatch(CommonActions.goBack());
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {speciesData.map((species, index) => (
          <Card key={index} style={styles.speciesCard}>
            <Card.Content>
              <Text style={styles.speciesName}>{species.nom_francais}</Text>
              <Text style={styles.speciesLatinName}>{species.nom_latin}</Text>
              <Text style={styles.speciesEnglishName}>{species.nom_anglais}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.returnButton} onPress={navigateBack}>
        <Text style={styles.returnButtonText}>Return</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  speciesCard: {
    marginBottom: 16,
  },
  speciesName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  speciesLatinName: {
    fontStyle: 'italic',
  },
  speciesEnglishName: {
    color: 'gray',
  },
  returnButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  returnButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ListeEEE;
