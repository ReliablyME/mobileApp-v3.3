
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider as StoreProvider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import AppNavigator from './src/route/AppNavigator';
import reducer from './src/store/reducer';
import {ToastProvider} from 'react-native-toast-notifications';
import {Fonts} from './src/components/fonts';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import VersionCheck from 'react-native-version-check';
import LoginScreen from './src/screens/LoginScreen';

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  const store = createStore(reducer, applyMiddleware(ReduxThunk));

  useEffect(() => {
    const checkCredentials = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const storedPhone = await AsyncStorage.getItem('mobile');
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      console.log(isLoggedIn, storedPhone)
      if (isLoggedIn === 'true' && storedPhone) {
        setInitialRoute('Dashboard');
      } else {
        setInitialRoute('LoginScreen');
      }
    };

    checkCredentials();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  const createChannels = async () => {
    PushNotification.createChannel(
      {
        channelId: 'channel-id-519807585511', // (required)
        channelName: 'Event', // (required)
        channelDescription: 'Event', // (optional) default: undefined.
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  if (requestUserPermission()) {
    createChannels();
    messaging()
      .getToken()
      .then(fcmToken => {
        console.log('FCM Token -> ', fcmToken);
        AsyncStorage.setItem('deviceToken', fcmToken);
      })
      .catch(error => console.log(error, 'unable to get '));
  } else {
    console.log('notification permission not found');
  }
  
  PushNotification.removeAllDeliveredNotifications();
  messaging()
    .getInitialNotification()
    .then(async remoteMessage => {
      if (remoteMessage) {
        var userID = await AsyncStorage.getItem('userID');
        if (userID) {
          navigation?.current?.navigate('Notification');
        }
      }
    });

  messaging().onNotificationOpenedApp(async remoteMessage => {
    if (remoteMessage && userId) {
      navigation?.current?.navigate('Notification');
    }
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
    const {body, title, data} = remoteMessage.notification;
    PushNotification.localNotification({
      channelId: 'channel-id-519807585511',
      title: title,
      message: body, // (required)
      data: data,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    });
  });

  useEffect(() => {
    CheckAppUpdate();
  }, []);

//  const CheckAppUpdate = () => {
//    VersionCheck.needUpdate().then(res => {
//        try {
//          if (res.isNeeded) {
//            Alert.alert(
//              'Hold on!',
//              'There is an updated version on the app store. Do you want to update?',
//              [
//                {
//                  text: 'YES',
//                  onPress: () => {
//                    Linking.openURL(res.storeUrl);
//                  },
//                },
//              ],
//            );
//          }
//        } catch (error) {
//
//        }
//    });
//  };

    const CheckAppUpdate = () => {
      VersionCheck.needUpdate()
        .then(res => {
          if (res && res.isNeeded) {
            // Check if res exists and isNeeded is true
            Alert.alert(
              'Hold on!',
              'There is an updated version on the app store. Do you want to update?',
              [
                {
                  text: 'YES',
                  onPress: () => {
                    Linking.openURL(res.storeUrl);
                  },
                },
              ],
            );
          } else {
            console.log('No update is needed or the response was invalid.');
          }
        })
        .catch(error => {
          // Handle unexpected errors from VersionCheck.needUpdate()
          console.error('Error checking for updates:', error);
          Alert.alert('Error', 'Unable to check for updates. Please try again later.');
        });
    };

  if (initialRoute === null) {
    return null; // or a loading spinner
  }

  return (
    <StoreProvider store={store}>
      <ToastProvider
        placement="top"
        offset={50}
        duration={3000}
        renderType={{
          custom_success_toast: toast => (
            <View
              style={{
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                borderColor: '#B2D8FD',
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: '#fff',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: '#B2D8FD',
                }}>
                {toast.message}
              </Text>
            </View>
          ),
          custom_error_toast: toast => (
            <View
              style={{
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                borderColor: '#e71a1a',
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: '#fff',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: '#e71a1a',
                }}>
                {toast.message}
              </Text>
            </View>
          ),
        }}>
        <AppNavigator initialRouteName={initialRoute} />
      </ToastProvider>
    </StoreProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
