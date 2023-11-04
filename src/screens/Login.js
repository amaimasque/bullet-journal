import React, {useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
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
  ActivityIndicator,
} from 'react-native-paper';
import * as Firebase from 'helpers/Firebase';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';

const BG = require('images/bg.png');
const LOGO = require('images/logo.png');
const FB = require('images/facebook.png');
const GOOGLE = require('images/google.png');

export default function Login(props) {
  // const [email, setEmail] = useState('test@email.com');
  // const [password, setPassword] = useState('password@123');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const {colors, roundness, fonts} = useTheme();

  async function handleLogin(data = null) {
    if (email === '' || password === '') {
      return Alert.alert('Error', 'Please complete fields');
    }
    if (password.length < 8) {
      return Alert.alert('Error', 'Password should be greater than 8 characters!');
    }
    setLoading(true);
    console.warn('Data', data);
    if (await Firebase.checkUserExist(email, password)) {
      console.warn('Logging in...');
      Firebase.loginUser(email, password, async () => {
        await AsyncStorage.setItem('EMAIL_ADDRESS', email);
        RNRestart.Restart();
      });
    } else {
      setModalInfo('User account not found!');
      setModalVisibility(true);
      setLoading(false);
    }
  }

  async function handleSocialLogin(socialEmail) {
    setLoading(true);
    await AsyncStorage.setItem('EMAIL_ADDRESS', socialEmail);
    RNRestart.Restart();
  }

  async function handleRegister() {
    if (email === '' || password === '') {
      return Alert.alert('Error', 'Please complete fields');
    }
    setIsRegistering(true);
    await Firebase.registerUser(
      {
        email,
        password,
        facebook: '',
        google: '',
        profile_picture: '',
        username: '',
      },
      (value) => {
        switch (value) {
          case 'user_exists':
            setModalInfo('User account exists!');
            setModalVisibility(true);
            break;
          case 'proceed':
            // setModalInfo('Please check your email for verification.');
            // setModalVisibility(true);
            // break;
            setModalInfo('User account created, logging in...');
            setModalVisibility(true);
            setIsRegistering(false);
            return handleLogin();
          default:
            console.log('Test');
        }
        setIsRegistering(false);
      },
    );
  }

  async function handleSocialRegister(type, socialEmail) {
    setIsRegistering(true);
    await Firebase.registerSocialUser(
      {
        email: socialEmail,
        password: '',
        facebook: type === 'facebook' ? socialEmail : '',
        google: type === 'google' ? socialEmail : '',
        profile_picture: '',
        username: '',
      },
      async () => {
        let isExists = await Firebase.checkUserExist(email);
        if (isExists) {
          await AsyncStorage.setItem('EMAIL_ADDRESS', email);
          RNRestart.Restart();
        }
        setIsRegistering(false);
      },
    );
  }

  function onAuthStateChanged(user) {
    console.warn('User', JSON.stringify(auth().currentUser, null, '\t'));
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <ImageBackground source={BG} style={styles.mainContainer}>
      <Portal theme={useTheme}>
        <Dialog
          style={{backgroundColor: colors.background, borderRadius: 5}}
          visible={isModalVisible}>
          <Dialog.Title>Login</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{modalInfo}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setModalVisibility(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={styles.logoMainContainer}>
        <View style={styles.logoContainer}>
          <Image source={LOGO} style={styles.logo} />
        </View>
        <View style={{marginLeft: wp('3%')}}>
          <Text style={styles.logoText}>BuJo</Text>
          <Text style={styles.logoSubText}>Bullet Journal</Text>
        </View>
      </View>
      <View style={styles.loginContainer}>
        <TextInput
          placeholder="Email Address"
          style={[styles.inputStyle, styles.defaultTextStyle]}
          value={email}
          onChangeText={(value) => setEmail(value)}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          style={[styles.inputStyle, styles.defaultTextStyle]}
          secureTextEntry={true}
          value={password}
          onChangeText={(value) => setPassword(value)}
        />
        <View style={[styles.socialContainer, {width: wp('70%')}]}>
          <TouchableOpacity
            disabled={isRegistering || loading}
            onPress={handleLogin}
            style={[
              styles.buttonStyle,
              {backgroundColor: '#FBE0AB', flexDirection: 'row'},
            ]}>
            {loading && (
              <ActivityIndicator
                animating={true}
                color="black"
                size="small"
                style={{marginRight: 10}}
              />
            )}
            <Text style={styles.defaultTextStyle}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isRegistering || loading}
            onPress={handleRegister}
            style={[
              styles.buttonStyle,
              {backgroundColor: '#EDA9B7', flexDirection: 'row'},
            ]}>
            {isRegistering && (
              <ActivityIndicator
                animating={true}
                color="black"
                size="small"
                style={{marginRight: 10}}
              />
            )}
            <Text style={styles.defaultTextStyle}>REGISTER</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.socialContainer}>
          <Text style={{fontSize: 10, fontFamily: 'Roboto-Regular'}}>
            Or login through
          </Text>
          <TouchableOpacity
            disabled={isRegistering || loading}
            style={{marginLeft: wp('3%')}}
            onPress={() =>
              Firebase.facebookLogin((isExisting, socialEmail) => {
                if (isExisting) {
                  handleSocialLogin(socialEmail);
                } else {
                  handleSocialRegister('facebook', socialEmail);
                }
              })
            }>
            <Image source={FB} style={styles.socialLogo} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isRegistering || loading}
            style={{marginLeft: wp('3%')}}
            onPress={() =>
              Firebase.googleLogin((isExisting, socialEmail) => {
                if (isExisting) {
                  handleSocialLogin(socialEmail);
                } else {
                  handleSocialRegister('google', socialEmail);
                }
              })
            }>
            <Image source={GOOGLE} style={styles.socialLogo} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: hp('100%'),
    width: wp('100%'),
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('5%'),
  },
  logoContainer: {
    width: wp('25%'),
    height: wp('25%'),
    backgroundColor: 'black',
    borderRadius: wp('25%') / 2,
    padding: wp('5%'),
    paddingTop: wp('4%'),
  },
  logo: {
    width: wp('18%'),
    height: wp('18%'),
    resizeMode: 'contain',
    tintColor: '#FAE7DF',
  },
  logoText: {
    fontFamily: 'LoverBunny',
    fontSize: 50,
  },
  logoSubText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    lineHeight: 15,
    marginTop: -5,
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('30%'),
    width: wp('80%'),
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: wp('5%'),
  },
  inputStyle: {
    backgroundColor: '#F0F0F0',
    padding: 5,
    borderRadius: 50,
    width: wp('70%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
    height: hp('5%'),
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialLogo: {
    width: wp('5%'),
    height: hp('3%'),
    resizeMode: 'contain',
  },
  buttonStyle: {
    height: hp('5%'),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('33%'),
    marginBottom: hp('2%'),
  },
  defaultTextStyle: {
    fontFamily: 'Roboto-Light',
    fontSize: 12,
    color: 'black',
  },
});
