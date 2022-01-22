import React, { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "../../assets/colors/colors";
import BuyAmount from "../enums/BuyAmount";
import { numberToHumanFormat } from "../math/formatting";
import { playSound, SoundFile } from "../util/sounds";

const AvatarImage = memo(() => (
  <Image source={require('../../assets/images/male-avatar.png')} style={styles.avatarIcon}/>
));

const TicksImage = memo(() => (
  <Image source={require('../../assets/images/lightning.png')} style={styles.ticksIcon}/>
));

const StepsImage = memo(() => (
  <Image source={require('../../assets/images/steps.png')} style={styles.stepsIcon}/>
));

interface TopBarProps {
  balance: number,
  ticks: number,
  buyAmount: BuyAmount,
  setBuyAmount: (buyAmount: BuyAmount) => void,
}

export const TopBar = memo(({balance, ticks, buyAmount, setBuyAmount}: TopBarProps) => {
  console.log('TopBar render')

  const [coefficient, scale] = numberToHumanFormat(balance);

  const toggleBuyAmount = () => {
    if (buyAmount === BuyAmount.One) setBuyAmount(BuyAmount.Ten);
    else if (buyAmount === BuyAmount.Ten) setBuyAmount(BuyAmount.Hundred);
    else if (buyAmount === BuyAmount.Hundred) setBuyAmount(BuyAmount.Max);
    else setBuyAmount(BuyAmount.One);

    playSound(SoundFile.SwitchOn)
  }

  return (
    <View style={styles.topBar}>
      <View style={styles.overlay}/>
      <AvatarImage/>

      <View style={styles.resourcesWrapper}>
      <View style={styles.stepsWrapper}>
        <StepsImage/>
        <View style={styles.stepsCountWrapper}>
          <Text style={styles.stepsCountText}>{coefficient}</Text>
          <Text style={styles.stepsScaleText}>{scale}</Text>
        </View>
      </View>

      <View style={styles.ticksWrapper}>
        <TicksImage/>
        <View style={styles.ticksCountWrapper}>
          <Text style={styles.ticksCountText}>{ticks}</Text>
        </View>
      </View>
      </View>

      <TouchableOpacity style={styles.buyAmountButton} activeOpacity={.8} onPress={toggleBuyAmount} touchSoundDisabled={true}>
        <Text style={styles.buyAmountBuyText}>Buy</Text>
        <Text style={styles.buyAmountAmountText}>{buyAmount}</Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = EStyleSheet.create({
    topBar: {
      flex: .15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    overlay: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
      opacity: .75,
      position: 'absolute',
    },
    avatarIcon: {
      width: 64,
      height: 64,
      marginLeft: '5%',
    },

    resourcesWrapper: {
      marginLeft: '-20%',
      flexDirection: 'column',
    },

    stepsWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stepsIcon: {
      width: 25,
      height: 25,
    },
    stepsCountWrapper: {
      marginLeft: 10,
      alignItems: 'center',
    },
    stepsCountText: {
      fontSize: '1.1rem',
    },
    stepsScaleText: {
      fontSize: '.9rem',
    },

    ticksWrapper: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    ticksIcon: {
      width: 20,
      height: 20,
    },
    ticksCountWrapper: {
      marginLeft: 10,
      alignItems: 'center',
    },
    ticksCountText: {
      fontSize: '1.1rem',
    },

    buyAmountButton: {
      marginRight: '5%',
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