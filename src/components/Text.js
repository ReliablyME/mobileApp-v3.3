import React from 'react';
import {Text} from 'react-native';

const SimpleText = ({
  color,
  fontFamily,
  fontSize,
  lineHieght,
  onPress,
  text,
}) => {
  return (
    <Text
      allowFontScaling={false}
      onPress={onPress}
      style={{color: color, fontFamily: fontFamily, fontSize: fontSize}}>
      {text}
    </Text>
  );
};

export default SimpleText;
