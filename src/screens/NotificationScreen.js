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
import axios from 'axios';
import {Fonts} from '../components/fonts';
import {baseUrl} from '../apis/baseUrl';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {ActionUrl} from '../apis/baseUrl';
import Hyperlink from 'react-native-hyperlink';

const NotificationScreen = ({navigation}) => {
  const [content, setContent] = useState([
    // {
    //   title: 'Notification',
    //   message:
    //     'And I has answered your question: “What is your personal resolution.',
    //   date: '2022-06-02',
    //   unread: true,
    //   action: true,
    // },
  ]);
  const [isloading, setloading] = useState(true);

  const [isUpdate, setUpdate] = useState(false);
  const isFocused = useIsFocused();
  const userInfo = useSelector(state => state.user.user);
  // console.log(userInfo, 'userinfo');

  const readNotification = key => {
    var data = content;
    data[key].unread = false;
    setContent(data);
    setUpdate(!isUpdate);
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior if there's no back stack
    };

    /*const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!navigation.canGoBack()) {
        return; // No need to prevent default behavior if there's no back stack
      }
      e.preventDefault();
      navigation.goBack();
    });*/

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation]);
  
  useEffect(() => {
    getnotificationlist();
  }, [isFocused]);
  // get all notification list ////
  const getnotificationlist = async () => {
    const mobilenum = await AsyncStorage.getItem('mobile');

    var config = {
      method: 'get',
      url: `${baseUrl}/api/v2.0/getMessagesApp?receiver=${mobilenum}`,
    };
    axios(config)
      .then(async response => {
        console.log(response, 'notification form');
        if (response.status == 200) {
          setContent(response.data.results.data);
          setloading(false);
        }
      })
      .catch(error => {
        console.log(error, 'Error studenet');
      });
  };
  /// message read or unread api///
  const readmessages = item => {
    var data = JSON.stringify({
      msg_id: item._id,
      status: 'read',
    });

    var config = {
      method: 'post',
      url: `${baseUrl}/api/v2.0/setMessageStatus`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then(async response => {
        console.log(response, 'notification read');
        if (response.status == 200) {
        }
      })
      .catch(error => {
        console.log(error, 'Error studenet');
      });
  };
  //// Action  message read api///
  const readActionMessage = () => {
    var data = JSON.stringify({
      member_id: userInfo._id,
      status: 'read',
    });

    var config = {
      method: 'post',
      url: `${baseUrl}/api/v2.0/setAllActionableMessageStatus`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then(async response => {
        console.log(response, 'action read');
        if (response.status == 200) {
        }
      })
      .catch(error => {
        console.log(error, 'Error action read');
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {isloading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'small'} color={'#0D4D95'} />
        </View>
      ) : (
        <View style={{flex: 1, color: '#A1A1A1'}}>
          <View
            style={{
              width: '100%',
              height: 60,
              borderBottomColor: '#ddd',
              borderBottomWidth: 0.5,
              alignItems: 'center',
              // justifyCo÷ntent: 'center',
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
              style={{fontFamily: Fonts.bold, fontSize: 18, marginLeft: 20, color: '#222222'}}>
              Notifications
            </Text>
          </View>
          <View style={{flex: 1}}>
          <Text
              allowFontScaling={false}
              style={{fontFamily: Fonts.bold, fontSize: 13, marginLeft: 20, color: '#A1A1A1'}}>
              By clicking a notification, you will get redirected to the web app on your browser
            </Text>
            {content.length > 0 ? (
              <FlatList
                data={content}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.actionable === 'yes') {
                          readNotification(index);

                          Linking.openURL(`${ActionUrl}?id=${userInfo._id}`);
                          readActionMessage();

                          // navigation.navigate('ActionScreen', {item});
                        } else {
                          readmessages(item);
                          getnotificationlist();
                          readNotification(index);
                        }
                      }}
                      style={{
                        width: '100%',
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#ddd',
                        padding: 15,
                      }}>
                      <View style={{height: 30}}>
                        <Text
                          selectable
                          allowFontScaling={false}
                          style={{
                            fontSize: 12,
                            fontFamily: Fonts.regular,
                            color: 'rgba(31, 31, 31, 0.72)',
                            marginTop: 10,
                          }}>
                          {moment(item.createdAt).format('LLL')}
                        </Text>
                      </View>

                      {item.actionable === 'yes' && (
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            style={{
                              height: 16,
                              width: 16,
                              resizeMode: 'contain',
                            }}
                            source={require('../../assets/icon/action.png')}
                          />
                          <Text
                            selectable
                            allowFontScaling={false}
                            style={{
                              fontSize: 14,
                              fontFamily: Fonts.regular,
                              color: 'rgba(31, 31, 31, 0.72)',
                              marginLeft: 10,
                            }}>
                            Action required
                          </Text>
                        </View>
                      )}
                      <View
                        style={{
                          width: '100%',
                          // flexDirection: 'row',
                          marginTop: 10,
                        }}>
                        {item.img_url == 'NA' ? null : (
                          <Image
                            source={{uri: item.img_url}}
                            style={{
                              height: 250,
                              width: '100%',
                              resizeMode: 'contain',
                            }}
                          />
                        )}
                        <Hyperlink
                          linkStyle={{color: '#2980b9', fontSize: 16}}
                          onPress={url => Linking.openURL(url)}>
                          <View style={{flex: 1}}>
                            <Text
                              selectable
                              allowFontScaling={false}
                              style={{
                                fontSize: 15,
                                fontFamily: Fonts.regular,
                                color:
                                  item.status === 'unread'
                                    ? '#000420'
                                    : '#797D82',
                              }}>
                              {item.message}
                            </Text>
                          </View>
                        </Hyperlink>

                        {item.action && (
                          <Image
                            style={{
                              marginLeft: 15,
                              height: 20,
                              width: 20,
                              resizeMode: 'contain',
                            }}
                            source={require('../../assets/icon/angle-right.png')}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#A1A1A1'}}>No Data Found</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
