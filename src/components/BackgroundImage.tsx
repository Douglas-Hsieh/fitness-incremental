import React, { memo } from "react";
import { Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

export const BackgroundImage = memo(() => (
  <Image source={require('../../assets/images/background.png')} style={styles.backgroundImage}/>
));

const styles = EStyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    width: 2000,
    height: 2000,
  },
})