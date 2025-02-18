import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Fonts} from '../components/fonts';

import Button from '../components/Button';
import {baseUrl} from '../apis/baseUrl';
import axios from 'axios';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommunityPortfolio,
  Actionwebapp,
  Faqwebapp,
  Settingwebapp,
  Adminwebapp,
} from '../apis/baseUrl';

const Settings = ({navigation, route}) => {
  const userInfo = useSelector(state => state.user.user);
  const [show, setShow] = useState(false);

  const Deleteuser = () => {
    var data = JSON.stringify({
      phone: userInfo.phone,
    });

    var config = {
      method: 'post',
      url: `${baseUrl}/api/v2.0/deleteAccount`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then(async response => {
        console.log(response, 'Deactive account');
        if (response.status == 200) {
          setShow(false);
          navigation.navigate('LoginScreen');
          await AsyncStorage.clear();
        }
      })
      .catch(error => {
        console.log(error, 'Error ');
      });
  };

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
          flexDirection: 'row', color: '#A1A1A1'
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/icon/back.png')}
            style={{width: 20, height: 20, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
        <Text
          allowFontScaling={false}
          style={{fontFamily: Fonts.bold, fontSize: 18, marginLeft: 20, color: '#A1A1A1'}}>
          Settings
        </Text>
      </View>

      <View style={{width: '100%', padding: 40, alignItems: 'center', color: '#A1A1A1'}}>
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
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            height: '20%',
            //   backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center', color: '#A1A1A1'
          }}>
          <Button
            width={'80%'}
            height={45}
            text="My Profile"
            backgroundColor={'#F58546'}
            textColor={'#fff'}
            textSize={18}
            onPress={() =>
              navigation.navigate('UpdateMember', {setting: 'Settings'})
            }
          />
        </View>

        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            height: '20%',
            //   backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center', color: '#A1A1A1'
          }}>
          <Button
            width={'80%'}
            height={45}
            text="Delete Account"
            backgroundColor={'#F58546'}
            textColor={'#fff'}
            textSize={18}
            onPress={() => setShow(true)}
          />
        </View>
      </View>
      <Modal
        testID={'modal'}
        isVisible={show}
        backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        animationIn="zoomInDown"
        onBackdropPress={() => setShow(false)}
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View style={styles.content}>
          <Icon name="warning" size={80} color={'#0D4D95'} />
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 20,
              fontFamily: Fonts.semibold,
              color: '#797D82',
              textAlign: 'center',
              lineHeight: 27,
            }}>
            Are You Sure,You want to delete Account ?
          </Text>
          <View
            style={{
              width: '100%',
              marginTop: 15,
              flexDirection: 'row',
              justifyContent: 'space-between', color: '#A1A1A1'
            }}>
            <Button
              width={'40%'}
              height={45}
              text="Cancel"
              backgroundColor={'#0D4D95'}
              textColor={'#fff'}
              textSize={18}
              onPress={() => setShow(false)}
            />
            <Button
              width={'40%'}
              height={45}
              text="Yes delete it !"
              backgroundColor={'#F58546'}
              textColor={'#fff'}
              textSize={18}
              onPress={() => Deleteuser()}
            />
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
export default Settings;
