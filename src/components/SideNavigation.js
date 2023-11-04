import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Avatar,
  List,
  Portal,
  Dialog,
  Paragraph,
  Button,
  useTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

import * as Firebase from 'helpers/Firebase';
import * as Navigation from 'helpers/NavigationService';

export default function SideNavigation(props) {
  const {colors, roundness, fonts} = useTheme();
  const [showLogout, setShowLogout] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [userInfo, setuserInfo] = useState({
    username: '',
    email: '',
    profile_picture: '',
  });

  const handleLogout = async () => {
    setShowLogout(false);
    await AsyncStorage.clear();
    await Firebase.logout();
    await Firebase.googleLogout();
    await Firebase.facebookLogout();
    Navigation.reset('Login');
  };

  useEffect(() => {
    fetchUser();
    return () => fetchUser();
  }, [props]);

  const fetchUser = async () => {
    await Firebase.fetchUser((data) => {
      setuserInfo(data);
      setProfilePicture(data.profile_picture);
      // data.profile_picture !== '' &&
      //   Firebase.getDownloadUrl(data.profile_picture, (url) =>
      //     setProfilePicture(url),
      //   );
    });
  }

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{
        backgroundColor: colors.background,
        // minHeight: useWindowDimensions().height,
      }}>
      <Portal theme={useTheme}>
        <Dialog
          style={{backgroundColor: colors.background, borderRadius: 5}}
          visible={showLogout}>
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to logout?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogout(false)} color={colors.text}>NO</Button>
            <Button onPress={handleLogout} color={colors.text}>YES</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={styles.infoContainer}>
        <Image
          source={{
            uri: profilePicture,
          }}
          style={{borderColor: colors.text, borderWidth: 1, width: wp('25%'), height: wp('25%'), borderRadius: wp('25%')}}
        />
        <View style={{width: wp('35%'), paddingLeft: wp('3%')}}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            style={{
              fontSize: 15,
              color: colors.text,
              fontFamily: fonts.medium,
            }}>
            {userInfo !== null && userInfo.username == ''
              ? 'No username'
              : userInfo.username}
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            style={{
              fontSize: 10,
              color: colors.text,
              fontFamily: fonts.regular,
            }}>
            {userInfo !== null && userInfo.email}
          </Text>
          <TouchableOpacity
            onPress={() => setShowLogout(true)}
            style={[styles.logoutButton, {borderRadius: roundness, backgroundColor: colors.positive}]}>
            <Text style={[styles.logoutText, {color: colors.text, fontFamily: fonts.regular}]}>
              LOGOUT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          height: hp('50%'),
        }}>
        <List.Accordion
          title="Entries"
          expanded={true}
          titleStyle={{fontFamily: fonts.light, color: colors.text}}>
          <List.Item
            title="Daily"
            style={{backgroundColor: colors.accent1}}
            titleStyle={[styles.subItemsTextStyle, {fontFamily: fonts.light}]}
            onPress={() =>
              props.navigation.navigate('Entries', {selected: 'Daily'})
            }
          />
          <List.Item
            title="Weekly"
            style={{backgroundColor: colors.accent1}}
            titleStyle={[styles.subItemsTextStyle, {fontFamily: fonts.light}]}
            onPress={() =>
              props.navigation.navigate('Entries', {selected: 'Weekly'})
            }
          />
          <List.Item
            title="Monthly"
            style={{backgroundColor: colors.accent1}}
            titleStyle={[styles.subItemsTextStyle, {fontFamily: fonts.light}]}
            onPress={() =>
              props.navigation.navigate('Entries', {selected: 'Monthly'})
            }
          />
          <List.Item
            title="Yearly"
            style={{backgroundColor: colors.accent1}}
            titleStyle={[styles.subItemsTextStyle, {fontFamily: fonts.light}]}
            onPress={() =>
              props.navigation.navigate('Entries', {selected: 'Yearly'})
            }
          />
        </List.Accordion>
        <List.Item
          title="Personalization"
          titleStyle={{fontFamily: fonts.light}}
          onPress={() => props.navigation.navigate('Personalization')}
        />
        <List.Item
          title="Account Settings"
          titleStyle={{fontFamily: fonts.light}}
          onPress={() => props.navigation.navigate('AccountSettings')}
        />
      </View>
      <Text
        style={{
          // backgroundColor: 'red',
          width: wp('75%'),
          textAlign: 'center',
          fontFamily: fonts.light,
          fontSize: 9,
          position: 'absolute',
          // bottom: useWindowDimensions().height * 0.05,
          bottom: 0,
        }}>
        Copyright 2020
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    paddingHorizontal: wp('3%'),
    flexDirection: 'row',
    marginVertical: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    marginTop: hp('2%'),
    backgroundColor: '#444242',
    height: hp('4%'),
    width: wp('32%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: 'white',
  },
  subItemsTextStyle: {
    fontSize: 12,
    marginLeft: wp('5%'),
  },
});
