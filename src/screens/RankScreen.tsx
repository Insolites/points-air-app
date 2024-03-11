// src/screens/RankScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const windowWidth = Dimensions.get('window').width;

const RankScreen = ({ navigation }: { navigation: any }) => {
  const cityData = [
    { name: 'Quebec City', points: 300 },
    { name: 'Montreal', points: 600 },
    { name: 'Laval', points: 800 },
    { name: 'Gatineau', points: 400 },
    { name: 'Longueuil', points: 1000 },
  ];

  const sortedCityData = cityData.slice().sort((a, b) => b.points - a.points);

  const chartData = {
    labels: sortedCityData.map((city) => city.name),
    datasets: [
      {
        data: sortedCityData.map((city) => city.points),
      },
    ],
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <Text style={styles.title}>Points Ranking Par Ville</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={windowWidth - 32}
          height={200}
          yAxisSuffix=" pts"
          // @ts-ignore
           yAxisLabel=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
      </View>
      <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
        <Text style={styles.returnButtonText}>Retour</Text>
      </TouchableOpacity>
    </Animated.View>
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
    marginBottom: 16,
  },
  chartContainer: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 16,
  },
  returnButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RankScreen;
