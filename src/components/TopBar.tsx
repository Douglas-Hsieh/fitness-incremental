import React, { memo, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { HighlightableElement } from "react-native-highlight-overlay";
import colors from "../../assets/colors/colors";
import { HIGHLIGHTABLE_RECTANGLE_OPTIONS, TickLevel, TICK_LEVELS, TICK_THRESHOLDS } from "../../assets/data/Constants";
import BuyAmount from "../enums/BuyAmount";
import { HighlightId } from "../enums/HightlightId";
import { numberToHumanFormat } from "../math/formatting";
import { playSound, SoundFile } from "../util/sounds";
import { ProgressBar } from "./ProgressBar";

const AvatarImage = memo(() => (
  <Image source={require('../../assets/images/male-avatar.png')} style={styles.avatarIcon}/>
));

export const TicksImage = memo(() => (
  <Image source={require('../../assets/images/lightning.png')} style={styles.ticksIcon}/>
));

export const StepsImage = memo(() => (
  <Image source={require('../../assets/images/steps.png')} style={styles.stepsIcon}/>
));

const TemporaryMultiplierImage = memo(() => (
  <Image source={require('../../assets/images/hourglass.png')} style={styles.temporaryMultiplierIcon}/>
))

interface TicksUsedProgressBarProps {
  ticks: number;
}

const TicksUsedProgressBar = memo(({ticks}: TicksUsedProgressBarProps) => {
  const [tickLevel, setTickLevel] = useState<TickLevel>()
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    for (let i = 0; i < TICK_LEVELS.size - 1; ++i) {
      if (TICK_THRESHOLDS.get(i)! < ticks && ticks < TICK_THRESHOLDS.get(i + 1)!) {
        const numerator = ticks - TICK_THRESHOLDS.get(i)!
        let denominator
        if (TICK_THRESHOLDS.get(i + 1)! === Infinity) {
          denominator = TICK_THRESHOLDS.get(i)!
        } else {
          denominator = TICK_THRESHOLDS.get(i + 1)! - TICK_THRESHOLDS.get(i)!
        }
        const progress = numerator / denominator > 1
          ? 1
          : numerator / denominator
        
        setTickLevel(TICK_LEVELS.get(i + 1)!)
        setProgress(progress)
      }
    }

  }, [ticks])

  return (
    <ProgressBar
      progress={progress}
      text={`x${tickLevel?.ticksToUse}`}
      progressBarClassnames={tickLevel?.progressBarClassnames}
    />
  )
})

interface BuyAmountButtonProps {
  buyAmount: BuyAmount;
  setBuyAmount: React.Dispatch<React.SetStateAction<BuyAmount>>;
}

export const BuyAmountButton = memo(({buyAmount, setBuyAmount}: BuyAmountButtonProps) => {
  
  const toggleBuyAmount = () => {
    if (buyAmount === BuyAmount.One) setBuyAmount(BuyAmount.Ten);
    else if (buyAmount === BuyAmount.Ten) setBuyAmount(BuyAmount.Hundred);
    else if (buyAmount === BuyAmount.Hundred) setBuyAmount(BuyAmount.Max);
    else setBuyAmount(BuyAmount.One);

    playSound(SoundFile.SwitchOn)
  }

  return (
  <TouchableOpacity style={styles.buyAmountButton} activeOpacity={.8} onPress={toggleBuyAmount} touchSoundDisabled={true}>
    <Text style={styles.buyAmountBuyText}>Buy</Text>
    <Text style={styles.buyAmountAmountText}>{buyAmount}</Text>
  </TouchableOpacity>
)})

interface TopBarProps {
  balance: number;
  ticks: number;
  speed: number;
  buyAmount: BuyAmount;
  setBuyAmount: React.Dispatch<React.SetStateAction<BuyAmount>>;
  temporaryMultiplier: number;
}

export const TopBar = memo(({balance, ticks, speed, buyAmount, setBuyAmount, temporaryMultiplier}: TopBarProps) => {

  const [coefficient, scale] = numberToHumanFormat(balance);
  const ticksText = ticks.toFixed(0);

  return (
    <View style={styles.topBar}>
      <View style={styles.overlay}/>
      <AvatarImage/>

      <View style={styles.resourcesWrapper}>
        <HighlightableElement id={HighlightId.Steps} style={styles.stepsWrapper} options={HIGHLIGHTABLE_RECTANGLE_OPTIONS}>
          <StepsImage/>
          <View style={styles.stepsCountWrapper}>
            <Text style={styles.stepsCountText}>{coefficient}</Text>
            <Text style={styles.stepsScaleText}>{scale}</Text>
          </View>
        </HighlightableElement>

        <HighlightableElement id={HighlightId.Ticks} style={styles.ticksWrapper} options={HIGHLIGHTABLE_RECTANGLE_OPTIONS}>
          <TicksImage/>
          <View style={styles.ticksCountWrapper}>
            <Text style={styles.ticksCountText}>{ticksText}</Text>
            <TicksUsedProgressBar ticks={ticks}/>
          </View>
        </HighlightableElement>
      </View>

      { temporaryMultiplier !== 1 &&
        <View style={styles.temporaryMultiplierWrapper}>
          <Text style={styles.temporaryMultiplierText}>x{temporaryMultiplier}</Text>
          <TemporaryMultiplierImage/>
        </View>
      }

      <HighlightableElement id={HighlightId.BuyAmountButton} options={HIGHLIGHTABLE_RECTANGLE_OPTIONS}>
        <BuyAmountButton
          buyAmount={buyAmount}
          setBuyAmount={setBuyAmount}
        />
      </HighlightableElement>

    </View>
  )
})

const styles = EStyleSheet.create({
    topBar: {
      width: '100%',
      height: '15%',
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
      flexDirection: 'column',
      width: '45%',
    },

    stepsWrapper: {
      height: '48%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    stepsIcon: {
      marginLeft: 10,
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
      height: '48%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ticksIcon: {
      marginLeft: 10,
      width: 25,
      height: 25,
    },
    ticksCountWrapper: {
      marginLeft: 10,
      width: '65%',
    },
    ticksCountText: {
      fontSize: '1.1rem',
    },

    temporaryMultiplierIcon: {
      width: 20,
      height: 20,
    },
    temporaryMultiplierWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    temporaryMultiplierText: {
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