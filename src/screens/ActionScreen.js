import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Button from '../components/Button';
import {Fonts} from '../components/fonts';
const ActionScreen = ({navigation, route}) => {
  const messageitem = route.params?.item;
  console.log(messageitem);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View
          style={{
            width: '100%',
            height: 60,
            borderBottomColor: '#dddd',
            borderBottomWidth: 0.5,
            alignItems: 'center',
            // justifyCo÷ntent: 'center',
            paddingHorizontal: 20,
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{width: 20, height: 20, resizeMode: 'contain'}}
              source={require('../../assets/icon/back.png')}
            />
          </TouchableOpacity>
          <Text
            allowFontScaling={false}
            style={{fontFamily: Fonts.bold, fontSize: 18, marginLeft: 20}}>
            Parw Royw
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            backgroundColor: '#F1FAFF',
            padding: 15,
          }}>
          <Text
            allowFontScaling={false}
            style={{fontSize: 15, fontFamily: Fonts.medium, lineHeight: 19}}>
            {messageitem.message}
          </Text>

          <Text
            allowFontScaling={false}
            style={{
              fontFamily: Fonts.bold,
              fontSize: 14,
              color: '#0D4D95',
              marginTop: 10,
            }}>
            EXPLANATIONS
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: Fonts.bold,
              fontSize: 14,
              color: '#0D4D95',
              marginTop: 10,
            }}>
            CLARIFICATIONS
          </Text>

          <View style={{width: '100%', flexDirection: 'row', marginTop: 30}}>
            <View style={{width: '50%'}}>
              <Button
                width={'90%'}
                height={50}
                backgroundColor={'#F58546'}
                text={'ISSUE'}
                textSize={18}
                textColor={'#fff'}
              />
            </View>
            <View
              style={{
                width: '50%',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <Button
                width={'90%'}
                height={50}
                backgroundColor={'#0D4D95'}
                text={'REJECT'}
                textSize={18}
                textColor={'#fff'}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ActionScreen;