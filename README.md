# Bullet Journal

Mobile app for journalling and notes taking. With notes and app personalization.

Made with React Native & Firebase Firestore, Auth & Storage.

[![My Skills](https://skillicons.dev/icons?i=react,firebase)](https://skillicons.dev)

Integrated with **third-party libraries** like:
- [React Native Paper](https://reactnativepaper.com/)
- [FB SDK](https://github.com/facebookarchive/react-native-fbsdk)
- [Google Signin](https://www.npmjs.com/package/react-native-google-signin)

This project was made on 2020-2021.

## TODO
- [ ]   Update to latest version
- [ ]   Remove deprecated packages
- [ ]   External host for assets


## Run Locally

Clone the project

```bash
  git clone https://github.com/amaimasque/bullet-journal.git
```

Go to the project directory

```bash
  cd bullet-journal
```

Install dependencies

```bash
  yarn install
```

### Firebase

On `App.js` file, specify Firebase credentials
```bash
firebase.initializeApp({
    projectId: '',
    apiKey: '',
    storageBucket: '',
});
```

### Android

Go to `android` folder and add `local.properties` file.
Specify the SDK location.

```bash
  sdk.dir = <SDK location>
```

Start the server

```bash
  yarn start
```

Run app on device

```bash
  yarn android
```
