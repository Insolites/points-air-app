// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const navigateToScreen = (screenName: string) => {
    navigation.dispatch(CommonActions.navigate({ name: screenName }));
    // Close the drawer after navigation
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
          </View>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  recommendationsCard: {
    marginBottom: 16,
  },
  activityCard: {
    marginBottom: 16,
  },
  participateButton: {
    marginTop: 16,
  },
});

export default HomeScreen;

// The DrawerContent component is defined separately
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
