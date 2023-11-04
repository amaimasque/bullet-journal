import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Platform, Alert} from 'react-native';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {GoogleSignin} from 'react-native-google-signin';

const userRef = firestore().collection('users');
const notesRef = firestore().collection('notes');

export const facebookLogin = async (callback) => {
  try {
    let data, result;
    facebookLogout();
    if (Platform.OS === 'android') {
      try {
        LoginManager.setLoginBehavior('NATIVE_ONLY');
        result = await LoginManager.logInWithPermissions([
          'public_profile',
          'email',
        ]);
      } catch (error) {
        LoginManager.setLoginBehavior('WEB_ONLY');
        result = await LoginManager.logInWithPermissions([
          'public_profile',
          'email',
        ]);
      }
    }
    if (result.isCancelled) {
      throw new Error('User cancelled request');
    }
    data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error('Something went wrong obtaining the users access token');
    }
    const credential = auth.FacebookAuthProvider.credential(data.accessToken);
    const firebaseUserCredential = await auth().signInWithCredential(
      credential,
    );
    let user = firebaseUserCredential.user;
    console.warn('User', user);
    let isExists = await checkUserExist(user.email);
    callback(isExists, user.email);
  } catch (error) {
    console.warn('Error', error.message);
    Alert.alert(
      'Login failed',
      'There was an error logging in your account. Please try again later.',
    );
  }
};
export const facebookLogout = async () => {
  try {
    if (AccessToken.getCurrentAccessToken() != null) {
      LoginManager.logOut();
    }
  } catch (e) {
    console.warn(e.message);
  }
};
export const googleLogout = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (e) {
    console.warn(e.message);
  }
};
export const googleLogin = async (callback) => {
  try {
    googleLogout();
    GoogleSignin.configure({
      webClientId:
        '526141908336-u1lcqqfb2qud88on9qoif0hub99lcjne.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
    
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const data = await GoogleSignin.signIn();
    const credential = auth.GoogleAuthProvider.credential(
      data.idToken,
      data.accessToken,
    );
    const firebaseUserCredential = await auth().signInWithCredential(
      credential,
    );
    let user = firebaseUserCredential.user;
    console.warn('User', user);
    let isExists = await checkUserExist(user.email);
    callback(isExists, user.email);
  } catch (error) {
    console.warn('Error', error.message);
    Alert.alert(
      'Login failed',
      'There was an error logging in your account. Please try again later.',
    );
  }
};

export const logout = async () => {
  await auth().signOut();
  try {
    if (AccessToken.getCurrentAccessToken() != null) {
      LoginManager.logOut();
    }
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (err) {
    console.warn(err);
  }
};

export const loginSocialUser = async (credentials, callback) => {
  await auth()
    .signInWithCredential(credentials)
    .then(() => {
      console.log('Social account signed in', JSON.stringify(res, null, '\t'));
      callback();
    })
    .catch((error) => {
      Alert.alert('Error signing in', error.message);
      console.warn('Social login error', error.message);
    });
};
/***
 * login user in auth
 * ***/
export const loginUser = async (email, password, callback) => {
  await auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
      console.log('User account created', JSON.stringify(res, null, '\t'));
      // auth()
      //   .sendSignInLinkToEmail(email)
      //   .then(() => {
      //     console.warn('Verification email sent');
      //     callback();
      //   })
      //   .catch((e) => {
      //     console.warn('Error', e.message);
      //     Alert.alert(
      //       'Registration Error',
      //       'Unable to send verification email. Please try again later',
      //     );
      //   });
      callback();
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            console.log('User account signed in!');
            callback();
          })
          .catch((error) => {
            if (error.code === 'auth/invalid-email') {
              console.log('That email address is invalid!');
            }
            Alert.alert('Error signing in', error.message);
          });
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      console.error(error.message);
    });
};

export const checkUserExist = async (email, password = null) => {
  let isExisting = false;
  await userRef
    .where('email', '==', email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docSnapshot) => {
        let data = docSnapshot.data();
        console.warn('User data,,,', data);
        if (password !== null && data.password === password) {
          console.warn('User found!', docSnapshot.id);
          setUserId(docSnapshot.id);
          isExisting = true;
        }
        if (password === null) {
          console.warn('User found, no password!', docSnapshot.id);
          setUserId(docSnapshot.id);
          isExisting = true;
        }
      });
    });
  return isExisting;
};

export const fetchUser = async (callback) => {
  let userID = await getUserId();
  if (userID) {
    await userRef
      .doc(userID)
      .get()
      .then((querySnapshot) => {
        let data = querySnapshot.data();
        callback(data);
      });
  }
};

export const updateUserInfo = async (data) => {
  let userID = await getUserId();
  if (userID) {
    await userRef
      .doc(userID)
      .update(data)
      .then(() => console.log('User info updated!'))
      .catch((e) => console.warn('Error', e.message));
  }
};

export const deleteUser = async () => {
  let userID = await getUserId();
  if (userID) {
    await userRef
      .doc(userID)
      .delete()
      .then(() => console.log('User deleted!'))
      .catch((e) => console.warn('Error', e.message));
  }
};

export const setUserId = async (id) => {
  await AsyncStorage.setItem('USER_ID', id);
};

export const getUserId = async () => {
  return await AsyncStorage.getItem('USER_ID');
};

export const registerUser = async (data, callback) => {
  if (await checkUserExist(data.email)) {
    callback('user_exists');
  } else {
    await userRef
      .doc()
      .set(data)
      .then(async () => {
        console.warn('Account registered!');
        await loginUser(data.email, data.password, () => callback('proceed'));
      })
      .catch((error) => {
        console.warn('Error', error.message);
        Alert.alert(
          'Registration Error',
          "There's a problem registering your account. Please try again later",
        );
      });
  }
};

export const registerSocialUser = async (data, callback) => {
  await userRef
    .doc()
    .set(data)
    .then((res) => {
      console.warn('Account registered!');
      callback();
    })
    .catch((error) => {
      console.warn('Error', error.message);
      Alert.alert(
        'Registration Error',
        "There's a problem registering your account. Please try again later",
      );
    });
};

export const uploadFile = async (filepath, filename, callback) => {
  filename =
    filename === undefined || filename === null
      ? Date.now().toString()
      : filename;
  const userID = await AsyncStorage.getItem('USER_ID');
  const reference = storage().ref(`${userID}/${filename}`);
  const task = reference.putFile(filepath);
  await task.then(async () => {
    console.warn('Uploaded to the bucket!');
    const url = await reference.getDownloadURL();
    callback(url);
  });
};

export const getDownloadUrl = async (filename, callback) => {
  const reference = storage().ref(filename);
  let url = await reference.getDownloadURL();
  callback(url);
};

export const fetchNotes = async (callback) => {
  let userID = await getUserId(),
    notes = [];
  return await notesRef
    .where('userid', '==', userID)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((docSnapshot) => {
        let data = docSnapshot.data();
        // console.warn('Note', data);
        notes.push({...data, id: docSnapshot.id});
      });
      callback(notes);
    });
    // .where('userid', '==', userID)
    // .onSnapshot((querySnapshot) => {
    //   querySnapshot.forEach((docSnapshot) => {
    //     let data = docSnapshot.data();
    //     // console.warn('Note', data);
    //     notes.push({...data, id: docSnapshot.id});
    //   });
    //   callback(notes);
    // });
};

export const saveNote = async (data, callback) => {
  let userID = await getUserId();
  if (userID) {
    await notesRef
      .doc()
      .set({...data, userid: userID})
      .then(() => {
        callback();
      });
  }
};

export const editNote = async (id, data, callback) => {
  let userID = await getUserId();
  if (userID) {
    await notesRef
      .doc(id)
      .update({...data})
      .then(() => {
        callback();
      });
  }
};

export const deleteNote = async (id) => {
  let userID = await getUserId();
  if (userID) {
    await notesRef
      .doc(id)
      .delete()
      .then(function () {
        console.log('Document successfully deleted!');
      })
      .catch(function (error) {
        console.error('Error removing document: ', error);
      });
  }
};
