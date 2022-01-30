import React, { memo } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "../../assets/colors/colors";
import { Generator, GENERATORS } from "../../assets/data/Generators";
import { GameState } from "../../assets/data/GameState";
import { GeneratorState } from "../../assets/data/GeneratorState";
import BuyAmount from "../enums/BuyAmount";
import { numberToHumanFormat } from "../math/formatting";
import { calculatePrice } from "../math/prices";
import { Map } from 'immutable';
import { playSound, SoundFile } from "../util/sounds";
import { UnlockProgressBar } from "./UnlockProgressBar";
import { GeneratorProgressBar } from "./GeneratorProgressBar";

const GeneratorIcon = memo((props: {image: any}) => {
  return (
  <View style={styles.iconContainer1}>
    <View style={styles.iconContainer2}>
      <View style={styles.iconContainer3}>
        <Image source={props.image} style={styles.icon}/>
      </View>
    </View>
  </View>
)})

interface BuyGeneratorButtonProps {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  generator: Generator;
  generatorState: GeneratorState;
  amount: number;
  price: number;
  isDisabled: boolean;
}

const BuyGeneratorButton = ({gameState, setGameState, generator, amount, price, isDisabled}: BuyGeneratorButtonProps) => {
  const [coefficient, scale] = numberToHumanFormat(price)
  const generatorState = gameState.generatorStateById.get(generator.id)!;

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

      playSound(SoundFile.MenuSelectionClick)
    }
  }

  return (
    <TouchableOpacity activeOpacity={.8} disabled={isDisabled} onPress={buyGenerator} touchSoundDisabled={true}>
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
    {GENERATORS.map(generator => {
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
            <UnlockProgressBar generator={generator} generatorState={generatorState}/>
          </View>
          <View style={styles.generatorRightWrapper}>
            <GeneratorProgressBar generator={generator} gameState={gameState}/>
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