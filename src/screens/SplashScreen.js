import React, {useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  ImageBackground,
  ActivityIndicator,
  BackHandler,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {gettApisWithoutToken, postApisWithoutToken} from '../apis';
import {setUserDetail} from '../store/action/user.action';

const SplashScreen = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(async () => {
    const userid = await AsyncStorage.getItem('userid');
    // console.log(userid, 'userid splash');
    if (!userid) {
      setTimeout(() => {
        // navigation.navigate('LoginScreen');
        navigation.reset({
          index: 0,
          routes: [{name: 'LoginScreen'}],
        });
      }, 2000);
    } else {
      checkUserExist();
    }
  }, []);

  const checkUserExist = async () => {
    const mobilenum = await AsyncStorage.getItem('mobile');
    const response = await gettApisWithoutToken(
      `/api/v2.0/member?phone=${mobilenum}`,
    );
    if (response.success) {
      // console.log(response, 'check member on splace ');
      if (response.data.results.data.length == 0) {
        // sendOtp(false);
      } else {
        //
        // sendOtp(true);

        dispatch(setUserDetail(response.data.results.data[0]));
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
        // navigation.navigate('Dashboard');
      }
    } else {
      console.log(error);
    }
  };
  // back handle exit app

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
  //   };
  // }, []);
  // const backButtonHandler = () => {
  //   const shortToast = message => {
  //     Toast.show(message, {
  //       duration: Toast.durations.LONG,
  //       position: Toast.positions.BOTTOM,
  //     });
  //   };
  //   let backHandlerClickCount;
  //   backHandlerClickCount += 1;
  //   if (backHandlerClickCount < 2) {
  //     shortToast('Press again to quit the application');
  //   } else {
  //     BackHandler.exitApp();
  //   }

  //   // timeout for fade and exit
  //   setTimeout(() => {
  //     backHandlerClickCount = 0;
  //   }, 1000);

  //   return true;
  // };
  ///////////////back handle exit Function

  return (
    <View style={{flex: 1, backgroundColor: '#ff0'}}>
      <ImageBackground
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={require('../../assets/images/Splash.png')}>
        <Image source={require('../../assets/images/logo.png')} />
        <View
          style={{
            width: 30,
            height: 30,

            position: 'absolute',
            bottom: 50,
          }}>
          <ActivityIndicator size={'large'} color={'#B2D8FD'} />
        </View>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;
