import React, { memo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "../../assets/colors/colors";
import { Generator, GENERATORS, GENERATORS_BY_ID } from "../../assets/data/Generators";
import { GameState } from "../../assets/data/GameState";
import BuyAmount from "../enums/BuyAmount";
import { numberToHumanFormat } from "../math/formatting";
import { Map } from 'immutable';
import { playSound, SoundFile } from "../util/sounds";
import { UnlockProgressBar } from "./UnlockProgressBar";
import { GeneratorProgressBar } from "./GeneratorProgressBar";
import { calculateTicksNeededByGeneratorId } from "../math/multipliers";
import { GeneratorIcon } from "./GeneratorIcon";
import { calculatePrice } from "../math/prices";

interface BuyGeneratorButtonProps {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  generator: Generator;
  amount: number;
  price: number;
  isDisabled: boolean;
  isLarge: boolean;
}

const BuyGeneratorButton = memo(({setGameState, generator, amount, price, isDisabled, isLarge}: BuyGeneratorButtonProps) => {
  const [coefficient, scale] = numberToHumanFormat(price)

  const handleBuy = () => {
    if (isDisabled) {
      return
    }
    
    setGameState(prevGameState => {
      const generatorState = prevGameState.generatorStateById.get(generator.id)!
      const newGeneratorState = Object.assign({}, generatorState, {owned: generatorState.owned + amount})
      const generatorStateById = prevGameState.generatorStateById.set(generator.id, newGeneratorState);

      return ({
        ...prevGameState,
        balance: prevGameState.balance - price,
        generatorStateById: generatorStateById,
      })
    })

    playSound(SoundFile.MenuSelectionClick)
  }

  return (
    <TouchableOpacity activeOpacity={.8} disabled={isDisabled} onPress={handleBuy} touchSoundDisabled={true}>
      <View style={[
        styles.buyGeneratorButton1,
        isLarge ? { height: styles.buyGeneratorButton1.height * 1.5 } : {},
        isDisabled ? {backgroundColor: colors.gray5} : {},
      ]}>
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
})

interface GeneratorListProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  priceByGeneratorId: Map<string, number>;
  maxBuyByGeneratorId: Map<string, number>;
  buyAmount: BuyAmount;
  temporaryMultiplier: number;
}

export const GeneratorList = ({
  gameState,
  setGameState,
  priceByGeneratorId,
  maxBuyByGeneratorId,
  buyAmount,
  temporaryMultiplier,
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

      const ownsSome = generatorState.owned > 0

      const ticksNeededByGeneratorId = calculateTicksNeededByGeneratorId(GENERATORS_BY_ID, gameState.unlockIds)
      const ticksNeeded = ticksNeededByGeneratorId.get(generator.id)!

      const isGold = temporaryMultiplier > 1

      return (
        <View key={generator.id} style={styles.generatorWrapper}>
          <View style={styles.generatorLeftWrapper}>
            <GeneratorIcon image={generator.image} hasOverlay={!ownsSome}/>
            <UnlockProgressBar generator={generator} owned={generatorState.owned}/>
          </View>
          <View style={styles.generatorRightWrapper}>
            { ownsSome &&
              <GeneratorProgressBar generator={generator} gameState={gameState} ticksNeeded={ticksNeeded} isGold={isGold}/>
            }
            <BuyGeneratorButton
              setGameState={setGameState}
              generator={generator}
              price={price}
              amount={amount}
              isDisabled={isDisabled}
              isLarge={!ownsSome}
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
    marginTop: 30,
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