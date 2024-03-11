// src/screens/SortirDeSaZoneDeConfortScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';

interface DrawerContentProps extends DrawerContentComponentProps {
    activityChoices: string[];
    navigate: (screenName: string) => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({ activityChoices, navigate }) => {
  return (
    <DrawerContentScrollView>
      {activityChoices.map((activity, index) => (
        <DrawerItem key={index} label={activity} onPress={() => navigate(activity)} />
      ))}
    </DrawerContentScrollView>
  );
};

const ConfortScreen = () => {
  const navigation = useNavigation();

  const navigateToScreen = (screenName: string) => {
    navigation.dispatch(CommonActions.navigate({ name: screenName }));
    // Close the drawer after navigation
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const activities = [
    'Activity 1',
    'Activity 2',
    'Activity 3',
    // Add more activities as needed
  ];

  return (
    <Drawer.Navigator initialRouteName="ConfortScreen" drawerContent={(props) => <DrawerContent {...props} activityChoices={activities} navigate={navigateToScreen} />}>
      <Drawer.Screen name="ConfortScreen" options={{ drawerLabel: 'Sortir de sa Zone de Confort' }}>
        {() => (
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
              {activities.map((activity, index) => (
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
  activityCard: {
    marginBottom: 16,
  },
});

export default ConfortScreen;
