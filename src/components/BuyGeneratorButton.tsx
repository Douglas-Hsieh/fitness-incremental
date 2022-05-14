import React, { memo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import colors from "../../assets/colors/colors";
import { Generator } from "../../assets/data/Generators";
import { GameState } from "../../assets/data/GameState";
import { numberToHumanFormat } from "../math/formatting";
import { playSound, SoundFile } from "../util/sounds";
import EStyleSheet from "react-native-extended-stylesheet";

interface BuyGeneratorButtonProps {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  generator: Generator;
  amount: number;
  price: number;
  isDisabled: boolean;
  isLarge: boolean;
  onClick: () => void;
}

export const BuyGeneratorButton = memo(({setGameState, generator, amount, price, isDisabled, isLarge, onClick}: BuyGeneratorButtonProps) => {
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

    onClick()
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

const styles = EStyleSheet.create({
  // Buy Button
  buyGeneratorButton1: {
    marginTop: 4,
    width: 225,
    height: 45,
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
    paddingHorizontal: 5,
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
    fontSize: 12,
  },
})