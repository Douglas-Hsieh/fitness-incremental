import React, { memo } from "react";
import { Image, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

export const FancyBackground = memo(() => (
  <Image source={require('../../assets/images/background.png')} style={styles.backgroundImage}/>
));

export const Background = memo(() => (
  <View style={styles.background}/>
));

const styles = EStyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    width: 2000,
    height: 2000,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: .1,
  },
})