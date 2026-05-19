import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import MainPage from '../pages/Main';
import ListPage from '../pages/List';
import FavoritePage from '../pages/Favorite';
import DetailPage from '../pages/Detail';

import { COLORS } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'star' : 'star-o'; 
          } else if (route.name === 'All Cafes') {
            iconName = 'list';
          } else if (route.name === 'Favorite') {
            iconName = focused ? 'heart' : 'heart-o';
          }

          return (
            <View style={{
              backgroundColor: focused ? COLORS.primaryContainer : 'transparent',
              paddingHorizontal: 16,
              paddingVertical: 4,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon name={iconName} size={24} color={focused ? COLORS.textPrimary : COLORS.textSecondary} />
            </View>
          );
        },
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        }
      })}
    >
      <Tab.Screen name="Home" component={MainPage} />
      <Tab.Screen name="All Cafes" component={ListPage} />
      <Tab.Screen name="Favorite" component={FavoritePage} /> 
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        
        <Stack.Screen name="Detail" component={DetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;