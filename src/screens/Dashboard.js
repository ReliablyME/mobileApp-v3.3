import React, {useEffect, useState, useRef} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  BackHandler,
  AppState,
} from 'react-native';
import {Fonts} from '../components/fonts';
import Modal from 'react-native-modal';
import Button from '../components/Button';
import {baseUrl} from '../apis/baseUrl';
import axios from 'axios';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Iconlogout from 'react-native-vector-icons/AntDesign';
import {useIsFocused} from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';
import {
  CommunityPortfolio,
  Actionwebapp,
  Faqwebapp,
  Settingwebapp,
  Adminwebapp,
} from '../apis/baseUrl';

const Dashboard = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [show, setShow] = useState(false);
  const [isnoticount, setnoticount] = useState([]);
  const [unreadmessage, setunreadmessage] = useState('');
  const [openmodal, setmodal] = useState(false);
  const [previousScreen, setPreviousScreen] = useState(null);

  const content = [
    {
      title: 'Notification',
      icon: require('../../assets/icon/notifcation.png'),
      onPress: 'NotificationScreen',
      badge: true,
    },
    {
      title: 'Commitment Portfolio',
      icon: require('../../assets/icon/portfolio.png'),
      onPress: '',
    },
    {
      title: 'Action',
      icon: require('../../assets/link.png'),
      onPress: '',
    },
    {
      title: 'FAQ',
      icon: require('../../assets/icon/faq.png'),
      onPress: '',
    },
    {
      title: 'Settings',
      icon: require('../../assets/icon/settings.png'),
      onPress: '',
    },
    {
      title: 'Log Out',
      icon: require('../../assets/icon/logout.png'),
      onPress: '',
    },
  ];
  // console.log(unreadmessage.length, isnoticount, 'dfdfdf');

  const getcount = ({isnoticount}) => {
    const unreadMessages = isnoticount.filter(
      message => message.status === 'unread',
    );
    setunreadmessage(unreadMessages);
  };

  useEffect(() => {
    updatetoken();
    if (route.params?.from === 'Registration') {
      // setShow(true);
      getnotificationlist();
    } else {
      getnotificationlist();
      // setShow(true);
    }
    getnotificationlist();
  }, [isFocused]);
  //// run update token in background////
  // useEffect(() => {
  //   BackgroundTimer.start();
  //   const interval = BackgroundTimer.setInterval(() => {
  //     updatetoken();
  //   }, 3000);
  //   return () => {
  //     BackgroundTimer.clearInterval(interval);
  //     BackgroundTimer.stop();
  //   };
  // });

  // get all notification list ////
  const getnotificationlist = async () => {
    const mobilenum = await AsyncStorage.getItem('mobile');

    var config = {
      method: 'get',
      url: `${baseUrl}/api/v2.0/getMessagesApp?receiver=${mobilenum}`,
    };
    axios(config)
      .then(async response => {
        // console.log(response, 'notification count');
        if (response.status == 200) {
          setnoticount(response.data.results.data);
          // getcount();
          var unreadMessages = response?.data?.results?.data.filter(
            message => message.status === 'unread',
          );
          setunreadmessage(unreadMessages);
        }
      })
      .catch(error => {
        // console.log(error, 'Error studenet');
      });
  };

  const openwebapp = async item => {
    const userId = await AsyncStorage.getItem('userid');
    console.log('id: ', userId);
    if (item.title === 'Notification') {
      navigation.navigate('NotificationScreen');
      // alert('noti');
    } else if (item.title === 'Commitment Portfolio') {
      navigation.navigate('Webpanel', {
        name: 'Commitment Portfolio',
        url: `https://app.reliably.me/a/portfolio/?id=${userId}${'&isLogin=true'}`,
      });
      // Linking.openURL(`${CommunityPortfolio}?id=${userInfo._id}`);
    } else if (item.title === 'Action') {
      navigation.navigate('Webpanel', {
        name: 'Action',
        url: `https://app.reliably.me/a/portfolioactions/?id=${userId}${'&isLogin=true'}`,
      });

      // Linking.openURL(`${Actionwebapp}?id=${userInfo._id}`);
    } else if (item.title === 'FAQ') {
      navigation.navigate('Webpanel', {
        name: 'FAQ',
        url: `${Faqwebapp}`,
      });

      // Linking.openURL(`${Faqwebapp}`);
    } else if (item.title === 'Settings') {
      navigation.navigate('Settings');

      // alert('setting');
    } else if (item.title === 'Log Out') {
      setmodal(true);
      setTimeout(() => {
        Logoutapp();
        setmodal(false);
      }, 2000);
      // Logoutapp();
    } else {
      console.log('error ');
    }
  };

  ///log out ///
  const Logoutapp = async () => {
    await AsyncStorage.clear();
    // navigation.navigate('LoginScreen');
    navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
    });
  };

  const modalclose = async () => {
    const mobilenum = await AsyncStorage.getItem('mobile');
    await AsyncStorage.setItem('modalid', mobilenum);
    setShow(false);
  };
  const appState = useRef(AppState.currentState);
  useEffect(async () => {
    const modalitem = await AsyncStorage.getItem('modalid');
    // console.log(modalitem, 'noticount');
    {
      if (!modalitem) {
        setShow(true);
      } else {
        setShow(false);
      }
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        updatetoken();
        // console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;

      // console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  /// update tokent for notification ///
  const updatetoken = async () => {
    const devicetoken = await AsyncStorage.getItem('deviceToken');
    const id = await AsyncStorage.getItem('userid');
    var data = JSON.stringify({
      deviceId: devicetoken,
    });

    var config = {
      method: 'post',
      url: `${baseUrl}/api/v2.0/update/member/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then(async response => {
        console.log(response, 'Token updated');
        if (response.status == 200) {
        }
      })
      .catch(error => {
        // console.log(error, 'Error studenet');
      });
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
  // back handle exit app
  useEffect(() => {
    // console.log('route.params', route.params.from);
    setPreviousScreen(route.params?.from);
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, [previousScreen, route.params]);
  const backButtonHandler = () => {
    if (navigation.isFocused()) {
      console.log();
      if (previousScreen) {
        BackHandler.exitApp();
      } else {
        BackHandler.exitApp();
        // navigation.goBack();
      }
      return true;
    }
  };
  ///////////////back handle exit Function

  return (
    <View style={{flex: 1, backgroundColor: '#B2D8FD', color: '#A1A1A1'}}>
      <SafeAreaView backgroundColor="#B2D8FD"></SafeAreaView>
      <View style={{width: '100%', padding: 40, alignItems: 'center'}}>
        <Image source={require('../../assets/images/logo.png')} />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 15, color: '#A1A1A1'
        }}>
        <FlatList
          data={content}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                // onPress={() => navigation.navigate(item.onPress)}
                onPress={() => openwebapp(item)}
                style={{
                  width: '100%',
                  height: 75,
                  borderRadius: 20,
                  backgroundColor: '#F1FAFF',
                  marginTop: 10,
                  flexDirection: 'row',
                  padding: 12,
                  alignItems: 'center', color: '#A1A1A1'
                }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: '#FF7F41',
                    alignItems: 'center',
                    justifyContent: 'center', color: '#A1A1A1'
                  }}>
                  <Image
                    source={item.icon}
                    style={{width: 25, height: 25, resizeMode: 'contain'}}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{fontSize: 22, fontFamily: Fonts.semibold, color: '#A1A1A1'}}>
                    {item.title}
                  </Text>
                  {item.badge && (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: '#248CCE',
                        marginLeft: 10,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text allowFontScaling={false} style={{color: '#fff'}}>
                        {unreadmessage.length}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <Modal
        testID={'modal'}
        isVisible={show}
        backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        animationIn="zoomInDown"
        onBackButtonPress={() => setShow(false)}
        onBackdropPress={() => setShow(false)}
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View style={styles.content}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 20,
              fontFamily: Fonts.semibold,
              color: '#797D82',
              textAlign: 'center',
              lineHeight: 27,
            }}>
            Welcome, {' '}
            <Text allowFontScaling={false} style={{color: '#0D4D95'}}>
              ReliablyME
            </Text>{' '}
            is a gamified personal accountability application that allows people
            to digitally send/receive promises to each other and create
            social contracts that earn digital badges and reliability,
            punctuality, and confidence related scores. It incorporates a
            commitments-based nudging process that is academically proven to be
            the most cost-effective way to affect behavior change.
          </Text>
          <View style={{width: '100%', marginTop: 15}}>
            <Button
              width={'100%'}
              height={45}
              text="Continue"
              backgroundColor={'#F58546'}
              textColor={'#fff'}
              textSize={18}
              onPress={() => modalclose()}
            />
          </View>
        </View>
      </Modal>
      {/* //// logout modal // */}
      <Modal
        testID={'modal'}
        isVisible={openmodal}
        backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View style={styles.content}>
          <Iconlogout name="warning" size={80} color={'#0D4D95'} />
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 20,
              fontFamily: Fonts.semibold,
              color: '#797D82',
              textAlign: 'center',
              lineHeight: 27,
            }}>
            You are logging out !
          </Text>
          <View
            style={{
              width: '100%',
              marginTop: 15,
              flexDirection: 'row',
              justifyContent: 'center', color: '#A1A1A1'
            }}>
            <ActivityIndicator size={'large'} color={'#F58546'} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});
export default Dashboard;
//5551234567