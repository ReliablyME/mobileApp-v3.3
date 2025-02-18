import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {retrySymbolicateLogNow} from 'react-native/Libraries/LogBox/Data/LogBoxData';
import {Fonts} from './fonts';

export default function Button({
  width,
  height,
  backgroundColor,
  textColor,
  text,
  textSize,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height,
        width,
        backgroundColor,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        allowFontScaling={false}
        style={{
          color: textColor,
          fontFamily: Fonts.semibold,
          fontSize: textSize,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
