import React, { memo, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "../../assets/colors/colors";
import { CurrencyGenerator, CURRENCY_GENERATORS } from "../../assets/data/CurrencyGenerators";
import { GeneratorState, GameState } from "../../assets/data/GameState";
import BuyAmount from "../enums/BuyAmount";
import { calculatePrice, numberToHumanFormat } from "../math";
import { Map } from 'immutable';
import { Audio } from 'expo-av';

const GeneratorIcon = memo((props: {image: any}) => {
  console.log('GeneratorIcon render')
  return (
  <View style={styles.iconContainer1}>
    <View style={styles.iconContainer2}>
      <View style={styles.iconContainer3}>
        <Image source={props.image} style={styles.icon}/>
      </View>
    </View>
  </View>
)})

interface GeneratorProgressBarProps {
  generatorState: GeneratorState;
  progress: number;
}

const GeneratorProgressBar = ({generatorState, progress}: GeneratorProgressBarProps) => (
  <View style={styles.generatorProgressBarContainer}>
    <View style={[
      styles.generatorProgressBar,
      {width: progress * styles.generatorProgressBar.width},
    ]}>
    </View>
    <Text style={styles.generatorProgressBarText}>{generatorState.owned}</Text>
  </View>
)

interface StepProgressBarProps {
  progress: number;
}

const StepProgressBar = ({progress}: StepProgressBarProps) => (
  <View style={styles.stepProgressBarWrapper}>
    <View style={styles.stepProgressBarContainer1}>
      <View style={styles.stepProgressBarContainer2}>
        <View style={styles.stepProgressBarContainer3}>
          <View style={[
            styles.stepProgressBar,
            {width: progress * styles.stepProgressBar.width},
          ]}/>
        </View>
      </View>
    </View>
    <Text style={styles.stepProgressBarText}>6440.00 / step</Text>
  </View>
)

interface BuyGeneratorButtonProps {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  generator: CurrencyGenerator;
  generatorState: GeneratorState;
  amount: number;
  price: number;
  isDisabled: boolean;
}

const BuyGeneratorButton = ({gameState, setGameState, generator, amount, price, isDisabled}: BuyGeneratorButtonProps) => {
  const [coefficient, scale] = numberToHumanFormat(price)
  const generatorState = gameState.generatorStateById.get(generator.id)!;

  const [sound, setSound] = useState<Audio.Sound>()

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('./../../assets/audio/menu-selection-click.wav')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  const buyGenerator = () => {
    const price = calculatePrice(amount, generator.initialPrice, generator.growthRate, generatorState.owned);

    if (price <= gameState.balance) {
      
      const newGeneratorState = Object.assign({}, generatorState, {owned: generatorState.owned + amount})
      const generatorStateById = gameState.generatorStateById.set(generator.id, newGeneratorState);

      setGameState({
        ...gameState,
        balance: gameState.balance - price,
        generatorStateById: generatorStateById,
      })

      playSound()
    }
  }

  return (
    <TouchableOpacity activeOpacity={.8} disabled={isDisabled} onPress={buyGenerator}>
      <View style={styles.buyGeneratorButton1}>
        <View style={[styles.buyGeneratorButton2, isDisabled ? {backgroundColor: colors.gray4} : {}]}>
          <View style={styles.buyGeneratorBuyAmountWrapper}>
            <Text style={styles.buyGeneratorBuyText}>Buy</Text>
            <Text style={styles.buyGeneratorAmountText}>{`x${amount}`}</Text>
          </View>
          <View style={styles.buyGeneratorPriceWrapper}>
            <Text style={styles.buyGeneratorPriceText}>{coefficient}</Text>
            <Text style={styles.buyGeneratorPriceScaleText}>{scale}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

interface GeneratorListProps {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  priceByGeneratorId: Map<string, number>;
  maxBuyByGeneratorId: Map<string, number>;
  buyAmount: BuyAmount;
}

export const GeneratorList = ({
  gameState,
  setGameState,
  priceByGeneratorId,
  maxBuyByGeneratorId,
  buyAmount,
}: GeneratorListProps) => (
  <View style={styles.generatorListWrapper}>
    {CURRENCY_GENERATORS.map(generator => {
      let price = priceByGeneratorId.get(generator.id)!;
      let isDisabled = price > gameState.balance;
      let amount: number;
      const generatorState = gameState.generatorStateById.get(generator.id)!;

      if (buyAmount === BuyAmount.Max) {
        amount = maxBuyByGeneratorId.get(generator.id)!;
        if (amount === 0) {
          amount = 1;
          price = calculatePrice(amount, generator.initialPrice, generator.growthRate, generatorState.owned)
          isDisabled = true;
        }
      } else {
        amount = buyAmount.valueOf();
      }

      return (
        <View key={generator.id} style={styles.generatorWrapper}>
          <View style={styles.generatorLeftWrapper}>
            <GeneratorIcon image={generator.image}/>
            <GeneratorProgressBar generatorState={generatorState} progress={1}/>
          </View>
          <View style={styles.generatorRightWrapper}>
            <StepProgressBar progress={1}/>
            <BuyGeneratorButton
              gameState={gameState}
              setGameState={setGameState}
              generator={generator}
              generatorState={generatorState}
              price={price}
              amount={amount}
              isDisabled={isDisabled}
            />
          </View>
        </View>
      )
    })}
  </View>
)

const styles = EStyleSheet.create({
  // Generator
  generatorListWrapper: {
    marginLeft: 10,
  },
  generatorWrapper: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  generatorLeftWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  generatorRightWrapper: {
    flexDirection: 'column',
    marginLeft: 10,
  },

  // Icon
  iconContainer1: {
    height: 80,
    width: 80,
    backgroundColor: colors.blue3,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer2: {
    height: '90%',
    width: '90%',
    backgroundColor: colors.blue1,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer3: {
    height: '90%',
    width: '90%',
    backgroundColor: colors.blue2,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '80%',
    width: '80%',
  },

  // Generator Progress Bar
  generatorProgressBarContainer: {
    marginTop: -20,

    width: 90,
    height: 25,
    backgroundColor: colors.blue3,
    borderRadius: 20,
    alignItems: 'center',
  },
  generatorProgressBar: {
    marginTop: 2.5,
    width: 85,
    height: 20,
    backgroundColor: colors.green2,
    borderRadius: 19,
  },
  generatorProgressBarText: {
    marginTop: -20,
    color: colors.white,
    textShadowColor: colors.black,
    textShadowRadius: 5,
  },

  // Step Progress Bar
  stepProgressBarWrapper: {
    alignItems: 'center',
    width: 200,
    height: 35,
  },
  stepProgressBarContainer1: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepProgressBarContainer2: {
    width: '99%',
    height: '95%',
    backgroundColor: colors.green1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepProgressBarContainer3: {
    width: '99%',
    height: '95%',
    backgroundColor: colors.white,
    borderRadius: 100,
  },
  stepProgressBar: {
    width: 196,
    height: '100%',
    backgroundColor: colors.green3,
    borderRadius: 100,
  },
  stepProgressBarText: {
    marginTop: -30,
    color: colors.black,
  },

  // Buy Button
  buyGeneratorButton1: {
    marginTop: 4,
    width: 200,
    height: 40,
    backgroundColor: colors.orange5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyGeneratorButton2: {
    width: '99%',
    height: '95%',
    backgroundColor: colors.orange3,
    borderRadius: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyGeneratorBuyAmountWrapper: {
    alignItems: 'center',
  },
  buyGeneratorBuyText: {
    color: colors.white,
  },
  buyGeneratorAmountText: {
    color: colors.white,
  },
  buyGeneratorPriceWrapper: {
    alignItems: 'center',
  },
  buyGeneratorPriceText: {
    color: colors.white,
    fontSize: 15,
  },
  buyGeneratorPriceScaleText: {
    fontSize: 10,
  },
})