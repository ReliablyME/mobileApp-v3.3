import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {Fonts} from '../components/fonts';
import {WebView} from 'react-native-webview';
const Webpanel = ({navigation, route}) => {
  const [isloading, setloading] = useState(false);
  const weburl = route.params.url;
  const pagename = route.params.name;
  console.log(weburl, 'weburl');
  return (
    <SafeAreaView style={{flex: 1}}>
      {isloading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'small'} color={'#0D4D95'} />
        </View>
      ) : (
        <>
          <View style={{flex: 1}}>
            <View
              style={{
                width: '100%',
                height: 60,
                borderBottomColor: '#ddd',
                borderBottomWidth: 0.5,
                alignItems: 'center',
                // justifyCo÷ntent: 'center',
                paddingHorizontal: 20,
                flexDirection: 'row',
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
                {pagename}
              </Text>
            </View>
            <WebView
              startInLoadingState={true}
              source={{
                uri: `${weburl}`,
              }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Webpanel;
