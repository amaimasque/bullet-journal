import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  useTheme,
  Avatar,
  Button,
  Dialog,
  Portal,
  IconButton,
} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

import Header from 'components/Header';
import LoadingModal from 'components/LoadingModal';

import * as Firebase from 'helpers/Firebase';
import * as Navigation from 'helpers/NavigationService';

export default function AccountSettings(props) {
  const {colors, roundness, fonts} = useTheme();
  const [isEdit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRetypedPassword, setNewRetypedPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [props]);

  const fetchUser = () => {
    Firebase.fetchUser((data) => {
      setUsername(data.username);
      setEmail(data.email);
      setPassword(data.password);
      setProfilePicture(data.profile_picture)
      // data.profile_picture !== '' &&
      //   Firebase.getDownloadUrl(data.profile_picture, (url) =>
      //     setProfilePicture(url),
      //   );
    });
  };

  const handleProfilePicture = async () => {
    try {
      const options = {
        title: 'Select Avatar',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        permissionDenied: {
          title: `Access denied`,
          text: `To grant access to your camera and pictures.`,
          reTryTitle: `try again`,
          okTitle: `I'm sure`,
        },
      };
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          // console.warn('Response', JSON.stringify(response, null, '\t'));
          setProfilePicture(response);
        }
      });
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  const handleSavePassword = async () => {
    if (oldPassword !== password) {
      return alert('Old password do not match!');
    }
    if (newPassword !== newRetypedPassword) {
      return alert('Passwords do not match!');
    }
    setIsPasswordModalVisible(false);
    setIsLoading(true);
    await Firebase.updateUserInfo({
      password: newPassword.trim(),
    }).then(() => {
      setIsLoading(false);
      fetchUser();
    });
  };

  const handleEdit = async () => {
    setEdit(!isEdit);
    if (isEdit) {
      setIsLoading(true);
      handleUpload(async (value) => {
        await Firebase.updateUserInfo({
          username,
          profile_picture: value,
          email,
        }).then(() => {
          fetchUser();
          setIsLoading(false);
        });
      });
    }
  };

  const handleUpload = async (callback) => {
    if (profilePicture.uri !== undefined) {
      await Firebase.uploadFile(
        profilePicture.path,
        profilePicture.fileName,
        (value) => {
          console.log('Url', value)
          callback(value);
        },
      );
    } else callback('');
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await Firebase.deleteUser().then(async () => {
      setIsLoading(false);
      await AsyncStorage.clear();
      await Firebase.logout();
      Navigation.reset('Login');
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainerStyle}
      style={{backgroundColor: colors.background}}>
      {isLoading && <LoadingModal visible={isLoading} />}
      <Portal theme={useTheme} style={{backgroundColor: 'rgba(0,0,0,0.5'}}>
        <Dialog
          style={{backgroundColor: colors.background, borderRadius: 5}}
          visible={isPasswordModalVisible}
          onDismiss={() => setIsPasswordModalVisible(false)}>
          <Dialog.Title style={{fontFamily: fonts.light, fontSize: 17}}>
            CHANGE PASSWORD
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              secureTextEntry={true}
              placeholder="New password"
              value={newPassword}
              onChangeText={(value) => setNewPassword(value)}
              style={[
                styles.passwordInputStyle,
                {
                  borderBottomColor: colors.text,
                  fontFamily: fonts.light,
                  borderRadius: roundness,
                },
              ]}
            />
            <TextInput
              secureTextEntry={true}
              placeholder="Retype new password"
              value={newRetypedPassword}
              onChangeText={(value) => setNewRetypedPassword(value)}
              style={[
                styles.passwordInputStyle,
                {
                  borderBottomColor: colors.text,
                  fontFamily: fonts.light,
                  borderRadius: roundness,
                },
              ]}
            />
            <TextInput
              secureTextEntry={true}
              editable={!password === ''}
              placeholder="Old password"
              value={oldPassword}
              onChangeText={(value) => setOldPassword(value)}
              style={[
                styles.passwordInputStyle,
                {
                  borderBottomColor: colors.text,
                  fontFamily: fonts.light,
                  borderRadius: roundness,
                },
              ]}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsPasswordModalVisible(false)}>
              Cancel
            </Button>
            <Button onPress={handleSavePassword}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Header
        {...props}
        headerStyle={{position: 'absolute', top: 0}}
        title="Account Settings"
        centerMainContainerStyle={{width: isEdit ? wp('55%') : wp('72%')}}
        rightComponent={() => {
          return (
            <View style={{flexDirection: 'row'}}>
              <IconButton
                icon={'window-close'}
                color={colors.text}
                size={hp('4%')}
                onPress={() => {
                  setEdit(false);
                  fetchUser();
                }}
                style={{display: isEdit ? 'flex' : 'none'}}
              />
              <IconButton
                icon={isEdit ? 'check' : 'pencil-outline'}
                color={colors.text}
                size={hp('4%')}
                onPress={handleEdit}
              />
            </View>
          );
        }}
      />
      <TouchableOpacity disabled={!isEdit} onPress={handleProfilePicture}>
        <Image
          style={{
            marginBottom: hp('3%'),
            borderColor: colors.text,
            borderWidth: 1,
            borderRadius: wp('30%'),
            height: wp('60%'),
            width: wp('60%'),
          }}
          source={{
            uri: 
              profilePicture.uri !== undefined
                ? profilePicture.uri
                : profilePicture,
          }}
        />
      </TouchableOpacity>
      <View style={styles.subcontainer}>
        <Text style={[styles.labelStyle, {fontFamily: fonts.thin, color: colors.text}]}>
          Username
        </Text>
        <TextInput
          editable={isEdit}
          value={username === '' ? 'Not set' : username}
          onChangeText={(value) => setUsername(value)}
          style={[
            styles.inputStyle,
            {borderBottomColor: colors.text, fontFamily: fonts.light, color: colors.text},
          ]}
          placeholderTextColor={colors.text}
        />
      </View>
      <View style={styles.subcontainer}>
        <Text style={[styles.labelStyle, {fontFamily: fonts.thin, color: colors.text}]}>
          Email address
        </Text>
        <TextInput
          editable={isEdit}
          value={email}
          onChangeText={(value) => setEmail(value)}
          style={[
            styles.inputStyle,
            {borderBottomColor: colors.text, fontFamily: fonts.light, color: colors.text},
          ]}
          placeholderTextColor={colors.text}
        />
      </View>
      <Button
        onPress={() => setIsPasswordModalVisible(true)}
        color={colors.positive}
        style={[styles.changePasswordButton, {color: colors.text}]}
        contentStyle={styles.buttonSize}
        icon="lock"
        mode="contained">
        CHANGE PASSWORD
      </Button>
      <Button
        onPress={() =>
          Alert.alert(
            'Confirm',
            'Are you sure you want to delete your account?',
            [{text: 'No', style: 'cancel'}, {onPress: handleDelete}],
          )
        }
        color={'#EA4335'}
        style={styles.changePasswordButton}
        contentStyle={styles.buttonSize}
        icon="trash-can-outline"
        mode="contained">
        DELETE ACCOUNT
      </Button>
      {/* <Button
        onPress={() => alert('This feature is under development!')}
        color={'#4267B2'}
        contentStyle={styles.buttonSize}
        style={styles.changePasswordButton}
        icon="facebook"
        mode="contained">
        CONNECT TO FACEBOOK
      </Button>
      <Button
        onPress={() => alert('This feature is under development!')}
        color={'#EA4335'}
        contentStyle={styles.buttonSize}
        style={styles.changePasswordButton}
        icon="google"
        mode="contained">
        CONNECT TO GOOGLE
      </Button> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    height: hp('100%') - StatusBar.currentHeight,
    paddingHorizontal: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('8%'),
  },
  subcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('80%'),
  },
  labelStyle: {
    textAlignVertical: 'center',
    width: wp('25%'),
    marginVertical: hp('2%'),
    paddingRight: wp('2%'),
  },
  inputStyle: {
    borderBottomWidth: 1,
    width: wp('55%'),
    paddingVertical: 5,
  },
  changePasswordButton: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginTop: hp('3%'),
  },
  buttonSize: {
    width: wp('80%'),
    height: hp('6%'),
  },
  passwordInputStyle: {
    borderWidth: 1,
    width: '100%',
    paddingVertical: 5,
    marginVertical: hp('1%'),
    textAlign: 'center',
  },
});
