import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeComponent from './component/home.compoent';
import DashboardComponent from './component/dashboard.component';
import MapComponent from './component/map.compoent';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function Naigation() {
  return (
    <NavigationContainer>
       <Tab.Navigator >
        <Tab.Screen name="HOME" component={HomeComponent} />
        <Tab.Screen name="DASHBOARD" component={DashboardComponent} />
        <Tab.Screen name="MAP" component={MapComponent} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Naigation;