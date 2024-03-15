// src/screens/AboutScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

const AboutScreen = ({ navigation }: { navigation: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Animated.View style={{ ...styles.cardContainer, opacity: fadeAnim }}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.aboutText}>
                Notre projet est une application qui modifie la façon dont les gens interagissent avec leur environnement en fonction de la météo et de leurs préférences personnelles. L'application recommande des activités locales en fonction de la météo actuelle et des habitudes de l'utilisateur, en proposant à la fois des activités familières et des suggestions pour sortir de sa zone de confort. Les utilisateurs ont également accès à une liste complète d'activités à proximité. En participant à ces activités, les utilisateurs gagnent des points pour leur ville, qui est engagée dans une compétition amicale avec d'autres villes. De plus, les amateurs de randonnée ont la possibilité de vivre une expérience immersive grâce à un jeu similaire à Pokémon Go qui leur permettra de chercher et répertorier des espèces exotiques envahissantes. Cette fonctionnalité ajoute une dimension ludique à l'exploration de la nature. En résumé, notre application offre une expérience personnalisée, interactive et divertissante, tout en encourageant l'exploration locale et la participation communautaire.
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>
      <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
        <Text style={styles.returnButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
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
  cardContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  card: {
    width: '90%', // Adjust the width as needed
  },
  aboutText: {
    fontSize: 16,
  },
  returnButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 8,
    alignSelf: 'center', 
    marginTop: 16, 
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AboutScreen;
