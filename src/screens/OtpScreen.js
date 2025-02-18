import OTPInputView from '@twotalltotems/react-native-otp-input';
import OTPTextInput from 'react-native-otp-textinput';
import OtpInputs from 'react-native-otp-inputs';
import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import Button from '../components/Button';
import {Fonts} from '../components/fonts';
import SimpleText from '../components/Text';
import {showStatus} from '../components/showToast';
import {useToast} from 'react-native-toast-notifications';
import {postApisWithoutToken, gettApisWithToken} from '../apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import AlertModal from '../components/AlertModal';
import {
  getHash,
  startOtpListener,
  useOtpVerify,
  removeListener,
} from 'react-native-otp-verify';

const OtpScreen = ({navigation, route}) => {
//   console.log(route, 'otp page route');
//   console.log(navigation);
  const toast = useToast();
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(150);
  const [keyboardIsOpen, setKeyboardIsOpen] = useState(true);
  const [modalValue, setmodalValue] = useState(false);
  const [message, setmessage] = useState('');
  const [issecret, setsecret] = useState('');
  // console.log(timeLeft);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(seconds => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getHash()
      .then(hash => {
        console.log(hash);
        // use this hash in the message.
      })
      .catch(console.log);

    startOtpListener(message => {
      console.log(message);
      // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
      const otp = /(\d{6})/g.exec(message)[1];
      setCode(otp);
      console.log(otp);

      // setOtp(otp);
    });
    return () => removeListener();
  }, []);

  const getMinutesFromSeconds = time => {
    if (time > 0) {
      const minutes = time >= 30 ? Math.floor(time / 30) : 0;
      const seconds = Math.floor(time - minutes * 30);
      return `${minutes >= 10 ? minutes : '0' + minutes}:${
        seconds >= 10 ? seconds : '0' + seconds
      }`;
    } else {
      return `00`;
    }
  };

  const [loading, setLoading] = useState(false);

  const completeLogin = async () => {
    // showStatus(toast, 'Login succusfully');
    if (!code) {
      setmodalValue(true);
      setmessage('Enter the Verification Code');
    } else {
        setLoading(true); // Start loading
          try {
                // First, verify the OTP
                const verifyResponse = await postApisWithoutToken(`/api/v2.0/verifyOTP`, {
                  phone: route.params.mobile,  // From navigation params
                  otp: code,
                  secret:issecret !== '' ? issecret : route.params.secret, // From navigation params
                });
                console.log("VerifyOTP Response:", verifyResponse.data);
                if (!verifyResponse.data.member?._id || !verifyResponse.data.member?.token ||
                 !verifyResponse.data?.success) {
                      throw new Error("Invalid OTP or missing user data in response");
                }
                // Step 3: Extract critical data
                const { _id, token, firstName, lastName, timezone} = verifyResponse.data.member;

               // Step 4: Store data securely
                AsyncStorage.multiSet([
                  ['userToken', token],
                  ['userid', _id],
                  ['isLoggedIn', "true"],
                  ['mobile', route.params.mobile],
                  ['firstname', firstName],
                  ['lastname', lastName],
                  ['timezone', timezone],
                ]);

                // Step 5: Navigate to Dashboard
                navigation.navigate('Dashboard', { from: 'OtpScreen' });
        } catch (error) {
            console.error("Authentication Error:", error);
                setmodalValue(true);
                setmessage(error.message || "Authentication failed");
        } finally {
            setLoading(false); // End loading
        }
    }
  };

  /////////// resend varification code////
  const sendOtp = async (status, usedetails) => {
    var response = await postApisWithoutToken(
      `/api/v2.0/getOTP/?isLogin=true`,
      {
        phone: route.params?.mobile,
      },
    );
    console.log(response, 'resentotp');

    if (response?.data?.success) {
      setsecret(response?.data?.secret);
      setTimeLeft(150);
    } else {
      alert('Error in api');
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

  return (
    <View style={{flex: 1, backgroundColor: '#B2D8FD', color: '#A1A1A1'}}>
      <SafeAreaView backgroundColor="#B2D8FD"></SafeAreaView>
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
          padding: 20, color: '#A1A1A1'
        }}>
        <View style={{width: '100%', alignItems: 'center', marginTop: 20, color: '#A1A1A1'}}>
          <Text
            allowFontScaling={false}
            style={{fontSize: 24, fontFamily: Fonts.bold, color: '#222222'}}>
            Verification
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
            Enter verification code that we have sent to {route.params?.mobile}
          </Text>
          <View
            style={{
              // backgroundColor: 'red',
              width: '100%',
              justifyContent: 'center',
              alignSelf: 'center',
              // marginTop: '2%',
              marginTop: 20,
              flexDirection: 'row',
            }}>
            {/* <OtpInputs
              numberOfInputs={6}
              autoFocus
              inputContainerStyles={styles.Inputtext}
              handleChange={e => setCode(e)}
              value={code}
              autofillFromClipboard={true}
              inputStyles={{
                textAlign: 'center',
                // backgroundColor: 'red',
                height: '100%',
              }}
              keyboardType={'phone-pad'}
              textContentType="oneTimeCode"
              editable={
                `${getMinutesFromSeconds(timeLeft)}` == '00' ? false : true
              }
            /> */}
            {/* <OTPTextInput
              handleTextChange={e => setCode(e)}
              autoFocusOnLoad
              style={styles.Inputtext}
              inputCount={6}></OTPTextInput> */}
          </View>

          <OTPInputView
            style={{width: '100%', height: 100, color: '#A1A1A1'}}
            pinCount={6}
            onCodeChanged={code => {
              setCode(code);
            }}
            code={code}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              console.log(`Code is ${code}, you are good to go!`);
            }}
            editable={
              `${getMinutesFromSeconds(timeLeft)}` == '00' ? false : true
            }
          />

          
          <TouchableOpacity
            disabled={
              `${getMinutesFromSeconds(timeLeft)}` == '00' ? false : true
            }
            onPress={() => sendOtp()}>
            <Text
              allowFontScaling={false}
              style={{
                marginTop: 15,
                color:
                  `${getMinutesFromSeconds(timeLeft)}` == '00'
                    ? '#0D4D95'
                    : '#999',
                fontSize: 18,
                fontFamily: Fonts.medium,
              }}>
            </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              padding: 20,
              justifyContent:
                Platform.OS === 'ios'
                  ? !keyboardIsOpen && 'flex-end'
                  : 'flex-end',
            }}>
            <Button
              width={'80%'}
              height={45}
              text="Proceed"
              backgroundColor={'#F58546'}
              textColor={'#fff'}
              textSize={18}
              onPress={() => completeLogin()}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Inputtext: {
    width: 50,
    height: 50,
    textAlign: 'center',

    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#A4A4A4',
    color: '#000',
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 50,
    height: 50,
    borderWidth: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#A4A4A4',
    color: '#000',
    fontSize: 18,
    fontFamily: Fonts.bold,
    // borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});

export default OtpScreen;
