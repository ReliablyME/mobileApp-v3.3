import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import Button from '../components/Button';
import { Fonts } from '../components/fonts';
import SimpleText from '../components/Text';
import { showStatus } from '../components/showToast';
import { useToast } from 'react-native-toast-notifications';
import Modal from 'react-native-modal';
import Avatar from '../components/Avatar';
import { baseUrl } from '../apis/baseUrl';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AlertModal from '../components/AlertModal';
var allCountryTimeZone = require('../../assets/timezone.json');

const Registration = ({ navigation }) => {
  const toast = useToast();
  const [mobileNumber, setMobileNumber] = useState('');
  const [show, setShow] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState('(UTC-06:00) Central America');
  const [timezoneList, setTimeZoneList] = useState(allCountryTimeZone);
  const [modalValue, setModalValue] = useState(false);
  const [message, setMessage] = useState('');

  // Handle registration logic
  const handleRegistration = async () => {
    if (!firstname.trim() || !lastname.trim() || !mobileNumber.trim()) {
      setModalValue(true);
      setMessage('Please fill in all required fields');
      return;
    }

    try {
//11
      const data = JSON.stringify({
        firstName: firstname,
        lastName: lastname,
        timezone: selectedTimeZone,
        phone: mobileNumber,
        badges: null,
        isManager: false,
//        deviceId: devicetoken,
//        deviceType: 'mobile',
      });

      const config = {
        method: 'POST',
        url: `${baseUrl}/api/v2.0/member`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      };

      console.log(config);

      const response = await axios(config);
      console.log("response", response);
      if (response.status === 200) {
        setModalValue(true);
        setMessage('Registration successful!');
//        setTimeout(() => {
//          navigation.replace('Dashboard', { from: 'Registration' });
//        }, 1500);
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setModalValue(true);
      setMessage('Failed to register. Please try again.');
    }
  };

  // Back button handling
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, []);

  const backButtonHandler = () => {
    if (navigation.isFocused()) {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', onPress: () => null, style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Register</Text>

        {/* First Name Input */}
        <TextInput
          placeholder="First Name"
          value={firstname}
          onChangeText={setFirstname}
          style={styles.input}
        />

        {/* Last Name Input */}
        <TextInput
          placeholder="Last Name"
          value={lastname}
          onChangeText={setLastname}
          style={styles.input}
        />

        {/* Mobile Number Input */}
        <TextInput
          placeholder="Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          style={styles.input}
        />

        {/* Timezone Selection */}
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={styles.timezoneInput}>
          <Text style={{ color: '#A1A1A1' }}>{selectedTimeZone}</Text>
        </TouchableOpacity>

        {/* Submit Button */}

        {/* Timezone Modal */}
        <Modal isVisible={show} onBackdropPress={() => setShow(false)}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Search Timezone"
              onChangeText={(e) => {
                const filter = allCountryTimeZone.filter((val) =>
                  val.value.includes(e)
                );
                setTimeZoneList(filter);
              }}
              style={styles.searchInput}
            />
            <FlatList
              data={timezoneList}
              keyExtractor={(item) => item.text}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTimeZone(item.text);
                    setShow(false);
                  }}
                  style={styles.timezoneItem}>
                  <Text>{item?.value} ({item.abbr})</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        {/* Alert Modal */}
        <AlertModal
          visible={modalValue}
          onClose={() => setModalValue(false)}
          message={message}
        />
      </KeyboardAwareScrollView>
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
           text="Register"
           backgroundColor={'#F58546'}
           textColor={'#fff'}
           textSize={18}
           onPress={handleRegistration}
           />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  timezoneInput: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    fontSize: 16,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#ddd',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: '#A1A1A1',
  },
  timezoneItem: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#414141',
    padding: 15,
  },
});

export default Registration;