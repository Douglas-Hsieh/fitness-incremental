import React from "react";
import { View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { GENERATORS, GENERATORS_BY_ID } from "../../assets/data/Generators";
import { GameState } from "../../assets/data/GameState";
import BuyAmount from "../enums/BuyAmount";
import { Map } from 'immutable';
import { calculateTicksNeededByGeneratorId } from "../math/multipliers";
import { calculatePrice } from "../math/prices";
import { GeneratorComponent } from "./GeneratorComponent";

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
        <GeneratorComponent
          key={generator.id}
          generator={generator}
          generatorState={generatorState}
          gameState={gameState}
          setGameState={setGameState}
          price={price}
          amount={amount}
          isDisabled={isDisabled}
          ticksNeeded={ticksNeeded}
          isGold={isGold}
          ownsSome={ownsSome}
        />
      )
    })}
  </View>
)

const styles = EStyleSheet.create({
  generatorListWrapper: {
    marginLeft: 10,
    marginVertical: 10,
  },
})