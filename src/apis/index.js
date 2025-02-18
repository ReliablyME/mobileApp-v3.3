import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from './baseUrl';

const axios = require('axios');

export const postApisWithoutToken = async (url, data) => {
  const config = {
    method: 'post',
    url: `${baseUrl + url}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  };

  try {
    const response = await axios(config);
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      data: err.response,
    };
  }
};

export const gettApisWithoutToken = async (url, data) => {
  console.log(`${baseUrl + url}`);
  const config = {
    method: 'get',
    url: `${baseUrl + url}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios(config);
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        data: response,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      data: err.response,
    };
  }
};

export const gettApisWithToken = async (url) => {
  const token = await AsyncStorage.getItem('userToken');

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
