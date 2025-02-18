import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import Button from '../components/Button';
import {Fonts} from '../components/fonts';
import SimpleText from '../components/Text';
import {showStatus} from '../components/showToast';
import {useToast} from 'react-native-toast-notifications';
import Modal from 'react-native-modal';
import Avatar from '../components/Avatar';
import {baseUrl} from '../apis/baseUrl';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AlertModal from '../components/AlertModal';
import {useSelector} from 'react-redux';
var allCountryTimeZone = require('../../assets/timezone.json');

const UpdateMember = ({navigation, route}) => {
  const toast = useToast();
  const [mobileNumber, setMobileNumber] = useState('');
  const [show, setShow] = useState(false);
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [previousScreen, setPreviousScreen] = useState(null);
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    '(UTC-06:00) Central America',
  );
  const [timezoneList, setTimeZoneLIst] = useState(allCountryTimeZone);
  const [modalValue, setmodalValue] = useState(false);
  const [message, setmessage] = useState('');
  //const userInfo = useSelector(state => state.user.user);

  useEffect(() => {
    async function renderPage() {
        setfirstname(await AsyncStorage.getItem('firstname'));
        setlastname(await AsyncStorage.getItem('lastname'));
        setSelectedTimeZone(await AsyncStorage.getItem('timezone'));
        const mobilenum = await AsyncStorage.getItem('mobile');
        setMobileNumber(mobilenum);
    }
    renderPage();
  }, []);

//  const checkLogin = async () => {
//    const devicetoken = await AsyncStorage.getItem('deviceToken');
//    const userid = await AsyncStorage.getItem('memberid');
//
//    if (1 === 2) {
//      setmodalValue(true);
//      setmessage('Enter First Name');
//    } else {
//      var data = JSON.stringify({
//        firstName: "Sigma",
//        lastName: "Slicer",
//        timezone: selectedTimeZone,
//        deviceId: devicetoken,
//        deviceType: 'mobile',
//      });
//      console.log(data);
//
//      var config = {
//        method: 'PUT',
//        url: `${baseUrl}/api/v2.0/member/${userid}`,
//        headers: {
//          'Content-Type': 'application/json',
//        },
//        data: data,
//      };
//
//      axios(config)
//        .then(response => {
//          console.log(response, 'update member form');
//          if (response.status == 200) {
//            navigation.replace('Dashboard', {
//              from: 'UpdateMember',
//            });
//          }
//        })
//        .catch(error => {
//          setmodalValue(true);
//          setmessage('Successfully Changed');
//          console.log(error, 'Error studenet');
//        });
//    }
//
//    // navigation.navigate('Dashboard', {
//    //   from: 'Registration',
//    // });
//  };

  const checkLogin = async () => {
      if (!firstname.trim() || !lastname.trim()) {
        setmodalValue(true);
        setmessage('Please fill in all required fields');
        return;
      }

      try {
        const devicetoken = await AsyncStorage.getItem('deviceToken');
        const userid = await AsyncStorage.getItem('memberid');

        const data = JSON.stringify({
          firstName: firstname,
          lastName: lastname,
          timezone: selectedTimeZone,
          deviceId: devicetoken,
          deviceType: 'mobile',
        });

        const config = {
          method: 'PUT',
          url: `${baseUrl}/api/v2.0/member/${userid}`,
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
        };

        const response = await axios(config);
        if (response.status === 200) {
          setmodalValue(true);
          setmessage('Profile updated successfully!');
          setTimeout(() => {
            navigation.replace('Dashboard', { from: 'UpdateMember' });
          }, 1500);
        }
      } catch (error) {
        console.error('Update error:', error);
        setmodalValue(true);
        setmessage('Failed to update profile. Please try again.');
      }
    };


  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      console.log(previousScreen);
      setPreviousScreen(route.params.setting);
      console.log('helo feed page');
    });
    return subscribe;
  }, [navigation]);

  // back handle exit app
  useEffect(() => {
    console.log('route.params.setting', route.params.setting);
    setPreviousScreen(route.params.setting);
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, [previousScreen, route.params]);
  const backButtonHandler = () => {
    if (navigation.isFocused()) {
      console.log(previousScreen);
      if (previousScreen) {
        navigation.goBack();
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
      <View
        style={{
          width: '100%',
          height: 60,
          borderBottomColor: '#ddd',
          borderBottomWidth: 0.5,
          alignItems: 'center',
          // justifyContent: 'center',
          paddingHorizontal: 20,
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            source={require('../../assets/icon/back.png')}
            style={{width: 20, height: 20, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
        <Text
          allowFontScaling={false}
          style={{fontFamily: Fonts.bold, fontSize: 18, marginLeft: 20, color: '#A1A1A1'}}>
          Update Member
        </Text>
      </View>
      <AlertModal
        modalValue={modalValue}
        closeModal={() => setmodalValue(false)}
        message={message}
      />
      <View style={{width: '100%', padding: 40, alignItems: 'center'}}>
        <Image source={require('../../assets/images/logo.png')} />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        }}>
        <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
          <Text
            allowFontScaling={false}
            style={{fontSize: 24, fontFamily: Fonts.bold, color: '#A1A1A1'}}>
            Update Profile
          </Text>
          <KeyboardAwareScrollView style={{width: '100%'}}>
              <View style={{width: '100%'}}>
              {/* Add TextInputs for name fields */}
              <Text
                allowFontScaling={false}
                style={{fontSize: 16, fontFamily: Fonts.bold, marginTop: 15, color: '#A1A1A1'}}>
                First Name
              </Text>
              <TextInput
                style={styles.input}
                value={firstname}
                onChangeText={setfirstname}
                placeholder="Enter first name"
                placeholderTextColor="#A1A1A1"
              />

              <Text
                allowFontScaling={false}
                style={{fontSize: 16, fontFamily: Fonts.bold, marginTop: 15, color: '#A1A1A1'}}>
                Last Name
              </Text>
              <TextInput
                style={styles.input}
                value={lastname}
                onChangeText={setlastname}
                placeholder="Enter last name"
                placeholderTextColor="#A1A1A1"
              />

              <Text
                allowFontScaling={false}
                style={{fontSize: 16, fontFamily: Fonts.bold, marginTop: 15, color: '#A1A1A1'}}>
                Choose your time zone
              </Text>
              <TouchableOpacity
                onPress={() => setShow(true)}
                style={{
                  width: '100%',
                  height: 50,
                  borderRadius: 10,
                  borderWidth: 1,
                  marginTop: 10,
                  fontSize: 16,
                  padding: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between', color: '#222222'
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: '#222222',
                  }}>
                  {selectedTimeZone}
                </Text>
                <Image
                  source={require('../../assets/icon/down.png')}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 5,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>

        <View
          style={{
            width: '100%',
            height: 80,
            alignItems: 'center',
            padding: 20,
            justifyContent: 'flex-end',
          }}>
          <Button
            width={'80%'}
            height={45}
            text="Continue"
            backgroundColor={'#F58546'}
            textColor={'#fff'}
            textSize={18}
            onPress={() => checkLogin()}
          />
        </View>
      </View>
      <Modal
        testID={'modal'}
        isVisible={show}
        backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        style={{margin: 0}}
        backdropTransitionOutTiming={600}>
        <View style={styles.content}>
          <SafeAreaView style={{width: '100%', height: '100%'}}>
            <View style={{width: '100%', padding: 10, alignItems: 'flex-end', color: '#A1A1A1'}}>
              <Icon style={{color: '#A1A1A1'}} onPress={() => setShow(false)} name="times" size={25} />
            </View>
            <View style={{width: '100%', padding: 10}}>
              <TextInput
                allowFontScaling={false}
                placeholder="search timezone"
                onChangeText={e => {
                  var filter = allCountryTimeZone.filter(val =>
                    val.value.includes(e),
                  );
                  setTimeZoneLIst(filter);
                }}
                style={{
                  width: '100%',
                  height: 40,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 10,
                  padding: 10, color: '#A1A1A1'
                }}
              />
            </View>
            <FlatList
              data={timezoneList}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTimeZone(item.text);
                      setShow(false);
                    }}
                    style={{
                      width: '100%',
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#414141',
                      padding: 15, color: '#A1A1A1'
                    }}>
                    <Text
                    style={{color: '#A1A1A1'}}
                      allowFontScaling={false}
                      marginL-10
                      text70
                      $textDefault>
                      {item?.value}({item.abbr})
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </SafeAreaView>
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
    width: '100%',
    height: '100%',
    borderColor: 'rgba(0, 0, 0, 0.1)', color: '#A1A1A1'
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderColor: '#ddd',
    color: '#222222',
    fontFamily: Fonts.regular,
  },
});

export default UpdateMember;