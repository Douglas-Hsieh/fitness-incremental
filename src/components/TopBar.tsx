import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../assets/colors/colors";
import BuyAmount from "../enums/BuyAmount";
import { numberToHumanFormat } from "../math";

const AvatarImage = memo(() => (
  <Image source={require('../../assets/images/male-avatar.png')} style={styles.avatar}/>
));

const StepsImage = memo(() => (
  <Image source={require('../../assets/images/steps.png')} style={styles.steps}/>
));

interface TopBarProps {
  balance: number,
  buyAmount: BuyAmount,
  setBuyAmount: (buyAmount: BuyAmount) => void,
}

export const TopBar = memo(({balance, buyAmount, setBuyAmount}: TopBarProps) => {
  console.log('TopBar render')

  const [coefficient, scale] = numberToHumanFormat(balance);

  const toggleBuyAmount = () => {
    if (buyAmount === BuyAmount.One) setBuyAmount(BuyAmount.Ten);
    else if (buyAmount === BuyAmount.Ten) setBuyAmount(BuyAmount.Hundred);
    else if (buyAmount === BuyAmount.Hundred) setBuyAmount(BuyAmount.Max);
    else setBuyAmount(BuyAmount.One);
  }

  return (
    <View style={styles.topBar}>
      <View style={styles.overlay}/>
      <AvatarImage/>
      <StepsImage/>
      <View style={styles.stepsCountWrapper}>
        <Text style={styles.stepsCountText}>{coefficient}</Text>
        <Text style={styles.stepsScaleText}>{scale}</Text>
      </View>
      <TouchableOpacity style={styles.buyAmountButton} activeOpacity={.8} onPress={toggleBuyAmount}>
        <Text style={styles.buyAmountBuyText}>Buy</Text>
        <Text style={styles.buyAmountAmountText}>{buyAmount}</Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
    topBar: {
      flex: .15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    overlay: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
      opacity: .75,
      position: 'absolute',
    },
    avatar: {
      width: 64,
      height: 64,
      marginLeft: '5%',
    },
    steps: {
      width: 25,
      height: 25,
      marginLeft: 25,
    },
    stepsCountWrapper: {
      marginLeft: 10,
      alignItems: 'center',
    },
    stepsCountText: {
      fontSize: 20,
    },
    stepsScaleText: {
    },
    buyAmountButton: {
      marginLeft: 130,
      width: 70,
      height: 50,
      backgroundColor: colors.orange2,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buyAmountBuyText: {
      color: colors.white,
      fontSize: 12,
      fontFamily: 'oleo-script'
    },
    buyAmountAmountText: {
      color: colors.white,
      fontFamily: 'oleo-script',
      fontSize: 20,
    },
})