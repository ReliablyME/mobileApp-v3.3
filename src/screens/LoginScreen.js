import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Appearance,
  TouchableOpacity,
} from 'react-native';
import Button from '../components/Button';
import {Fonts} from '../components/fonts';
import SimpleText from '../components/Text';
import {showStatus} from '../components/showToast';
import { BackHandler } from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import Modal from 'react-native-modal';
import Avatar from '../components/Avatar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import {gettApisWithoutToken, postApisWithoutToken} from '../apis';
import {useDispatch} from 'react-redux';
import {setUserDetail} from '../store/action/user.action';
import AlertModal from '../components/AlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
var allCountryCode = require('../../assets/countries.json');
const LoginScreen = ({navigation}) => {
  const toast = useToast();
  const [mobileNumber, setMobileNumber] = useState(null);
  const [isUserExist, setUserExist] = useState(false);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [countryCodeList, setCountryCodeList] = useState(allCountryCode);
  const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);
  const [modalValue, setmodalValue] = useState(false);
  const [message, setmessage] = useState('');
  // console.log(mobileNumber);


  const colorScheme = Appearance.getColorScheme();



  const dispatch = useDispatch();

  const checkLogin = () => {
    if (!mobileNumber) {
      setmodalValue(true);
      setmessage('please enter your mobile number');
    } else {
      setmodalValue(true);
      setmessage('Verification code has been sent successfully!');
//      checkUserExist();
      sendOtp();
    }

    //
  };

    const checkUserExist = async () => {
      try {
        const response = await gettApisWithoutToken(
          `/api/v2.0/member?phone=${countryCode}${mobileNumber}`
        );

        if (response?.success) {
          sendOtp(true, response); // Pass the response to sendOtp
          dispatch(setUserDetail(response.data.results.data[0]));
        } else {
          sendOtp(false);
        }
      } catch (error) {
        console.error("Error in checkUserExist:", error);
        setmodalValue(true);
        setmessage("An error occurred while checking user existence. Please try again.");
      }
    };



const [loading, setLoading] = useState(false);

    const sendOtp = async () => {
      setLoading(true); // Start loading
      try {
        const response = await postApisWithoutToken(`/api/v2.0/getOTP`, {
          phone: `${countryCode}${mobileNumber}`,
        });

        if (response?.data?.success) {
          await AsyncStorage.setItem('mobile', `${countryCode}${mobileNumber}`);
          console.log("Navigating to OtpScreen with params:", {
            mobile: `${countryCode}${mobileNumber}`,
            secret: response.data.secret,
//            isUserExist: status ? 1 : 0,
//            userID: userDetails?.data?.results?.data[0]?._id,
          });
          navigation.navigate('OtpScreen', {
            mobile: `${countryCode}${mobileNumber}`,
            secret: response.data.secret,
//            isUserExist: status ? 1 : 0,
//            userID: userDetails?.data?.results?.data[0]?._id,
          });
          setmodalValue(false);
        } else {
          setmodalValue(true);
          setmessage("You don't have an account yet, please register");
          navigation.navigate('Registration');
        }
      } catch (error) {
        console.error("Error in sendOtp:", error);
        setmodalValue(true);
        setmessage("Failed to send OTP. Please try again later.");
      } finally {
        setLoading(false); // End loading
      }
    };

  // ///// button up when keybo is on ////
  Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardIsOpen(true);
  });
  Keyboard.addListener('keyboardDidHide', () => {
    setKeyboardIsOpen(false);
  });
  // ///// button up when keybo is on ////

//  useEffect(() => {
//    BackHandler.addEventListener("hardwareBackPress", setShow(false));
//    return () => {
//      BackHandler.removeEventListener("hardwareBackPress", setShow(false));
//    };
//  }, []);
    useEffect(() => {
      const onBackPress = () => {
        setShow(false); // Update state
        return true; // Prevent the default back action
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#B2D8FD', color: '#A1A1A1'}}>
      <SafeAreaView backgroundColor="#B2D8FD"></SafeAreaView>
      <AlertModal
        modalValue={modalValue}
        // closeModal={() => navigateonnext()}
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
        <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
          <Text
            allowFontScaling={false}
            style={{fontSize: 24, color: '#A1A1A1', fontFamily: Fonts.bold}}>
            Enter Your Mobile Number
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 18,
              fontFamily: Fonts.regular,
              color: '#A1A1A1',
              textAlign: 'center',
              marginTop: 10,
              lineHeight: 26,
            }}>
            To activate  notifications on your phone, continue with your
            mobile number
          </Text>

          <View
            style={{
              width: '100%',
              marginTop: 25,
              borderColor: '#EFEFEF',
              borderRadius: 10,
              borderWidth: 1,
              height: 70,
              padding: 10,
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: Fonts.regular,
                fontSize: 14,
                color: '#B2AEAE',
              }}>
              Phone number
            </Text>
            <KeyboardAvoidingView
              style={{
                width: '100%',
                marginTop: 5,
                flexDirection: 'row',
                height: 40,
              }}>
              <TouchableOpacity
                onPress={() => setShow(true)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text allowFontScaling={false} style={{fontSize: 16, color: '#A1A1A1'}}>
                  {countryCode}
                </Text>
                <Image
                  source={{
                    uri: 'https://cdn3.iconfinder.com/data/icons/user-interface-169/32/chevron-bottom-512.png',
                  }}
                  style={{height: 18, width: 18, marginLeft: 5}}
                />
              </TouchableOpacity>
              
              <View
                style={{
                  height: 25,
                  width: 1,
                  backgroundColor: '#B2AEAE',
                  marginHorizontal: 10,
                }}></View>
              <TextInput
                allowFontScaling={false}
                onChangeText={e => {
                  setMobileNumber(e);
                  if (e.length == 15) {
                    Keyboard.dismiss();
                  }
                }}
                returnKeyType="done"
                maxLength={15}
                keyboardType="number-pad"
                style={{flex: 1, fontSize: 18, color: '#A1A1A1'}}
                placeholder="Phone Number..."
              />
            </KeyboardAvoidingView>
          </View>
        </View>
        <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              color: '#A1A1A1',
              padding: 20,

              justifyContent:
                Platform.OS === 'ios'
                  ? !keyboardIsOpen && 'flex-end'
                  : 'flex-end',
            }}>
            <Button
              width={'80%'}
              height={45}
              text="Next"
              backgroundColor={'#F58546'}
              textColor={'#fff'}
              textSize={18}
              onPress={() => checkLogin()}
            />
          </View>
        </KeyboardAwareScrollView>
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
            <View style={{width: '100%', padding: 10, alignItems: 'flex-end',color: '#A1A1A1'}}>
              <Icon onPress={() => setShow(false)} name="times" size={25} style={{color: '#A1A1A1'}}/>
            </View>
            <View style={{width: '100%', padding: 10}}>
              <TextInput
                allowFontScaling={false}
                placeholderTextColor='#222222'
                placeholder="Search Country"
                onChangeText={e => {
                  var filter = allCountryCode.filter(val =>
                    val.name.includes(e),
                  );
                  setCountryCodeList(filter);
                }}
                style={{
                  width: '100%',
                  height: 40,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  color: '#222222',
                  borderRadius: 10,
                  padding: 10,
                }}
              /> 
              
            </View>
            <FlatList
              data={countryCodeList}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setCountryCode(`+${item.dialCode}`);
                      setShow(false);
                    }}
                    style={{
                      width: '100%',
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#414141',
                      color: '#A1A1A1',
                      padding: 15,
                    }}>
                    <Text
                    style={{color: '#222222'}}
                      allowFontScaling={false}
                      marginL-10
                      text70
                      $textDefault>
                      +{item.dialCode} : {item?.name}
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
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});

export default LoginScreen;
