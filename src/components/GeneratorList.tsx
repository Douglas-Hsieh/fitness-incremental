import React from "react";
import { View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "../../assets/colors/colors";
import { GENERATORS, GENERATORS_BY_ID } from "../../assets/data/Generators";
import { GameState } from "../../assets/data/GameState";
import BuyAmount from "../enums/BuyAmount";
import { Map } from 'immutable';
import { UnlockProgressBar } from "./UnlockProgressBar";
import { GeneratorProgressBar } from "./GeneratorProgressBar";
import { calculateTicksNeededByGeneratorId } from "../math/multipliers";
import { GeneratorIcon } from "./GeneratorIcon";
import { calculatePrice } from "../math/prices";
import { BuyGeneratorButton } from "./BuyGeneratorButton";

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