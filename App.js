/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Naigation from './src/index.naviagtion';
import HomeComponent from './src/component/home.compoent';


const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <HomeComponent/>
    </>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
