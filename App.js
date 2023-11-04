/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import firebase from '@react-native-firebase/app';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {navigationRef} from 'helpers/NavigationService';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation-locker';

import {AppContextProvider} from 'helpers/ThemeContextProvider';
 
//Screens
import Login from 'screens/Login';
import Entries from 'screens/Entries';
import ViewEntry from 'screens/Entries/ViewEntry';
import Personalization from 'screens/Personalization';
import AccountSettings from 'screens/AccountSettings';
import AddEntry from 'screens/Entries/AddEntry';

import SideNavigation from 'components/SideNavigation';

const theme = {
  // dark: boolean;
  // mode?: Mode;
  roundness: 50,
  colors: {
    primary: 'black',
    background: 'white',
    // surface: string;
    accent: '#FAE7DF',
    error: '#F02D3A',
    text: 'black',
    // onSurface: string;
    // onBackground: string;
    headerAccent: '#DECEC7',
    // placeholder: string;
    backdrop: 'rgba(0,0,0,0.5)',
    // notification: string;
    accent1: '#F9F9F9',
    accent2: '#CECECE',
    positive: '#8896D7',
  },
  fonts: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    light: 'Roboto-Light',
    thin: 'Roboto-Thin',
  },
  animation: {
    scale: 2,
  },
};

const Users = createDrawerNavigator();

function UserScreens() {
  return (
    <Users.Navigator
      initialRouteName="Entries"
      drawerContent={(props) => <SideNavigation {...props} />}>
      <Users.Screen name="Entries" component={Entries} />
      <Users.Screen name="Personalization" component={Personalization} />
      <Users.Screen name="AccountSettings" component={AccountSettings} />
      <Users.Screen name="AddEntry" component={AddEntry} />
      <Users.Screen name="ViewEntry" component={ViewEntry} />
    </Users.Navigator>
  );
}

function App() {
  const MainApp = createStackNavigator();
  const [initialRouteName, setInitialRouteName] = useState('Login');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Orientation.lockToPortrait();
    firebase.app() === null &&
      firebase.initializeApp({
        projectId: 'bujo-c3774',
        apiKey: 'AIzaSyD0U9pvInBB74h2_vYquPkftEEUNn2JU6M',
        storageBucket: 'gs://bujo-c3774.appspot.com',
      });
  }, []);

  useEffect(() => {
    async function getUser(callback) {
      let email = await AsyncStorage.getItem('EMAIL_ADDRESS');
      callback(email);
    }
    getUser((value) => {
      if (value) {
        setInitialRouteName('Home');
      }
      setLoaded(true);
      SplashScreen.hide();
    });
  }, []);

 
  return (
    <AppContextProvider>
      {loaded && (
        <NavigationContainer ref={navigationRef}>
          <MainApp.Navigator
            initialRouteName={initialRouteName}
            headerMode="none">
            <MainApp.Screen name="Login" component={Login} />
            <MainApp.Screen name="Home" component={UserScreens} />
          </MainApp.Navigator>
        </NavigationContainer>
      )}
    </AppContextProvider>
  );
}

export default App;
