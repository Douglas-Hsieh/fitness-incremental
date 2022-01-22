import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "../../assets/colors/colors";
import { GameState } from "../../assets/data/GameState";
import { numberToHumanFormat } from "../math/formatting";
import { playSound, SoundFile } from "../util/sounds";

export interface UpgradeItemProps {
  upgradeId: string;
  title: string;
  description: string;
  price: number;
  image: any;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

export const UpgradeItem = ({upgradeId, title, description, price, image, gameState, setGameState}: UpgradeItemProps) => {
  const [coefficient, scale] = numberToHumanFormat(price, 0, 0);
  const isDisabled = price > gameState.balance;

  const buyUpgrade = () => {
    if (!isDisabled) {
      const upgradeIds = gameState.upgradeIds.add(upgradeId);
      setGameState({
        ...gameState,
        balance: gameState.balance - price,
        upgradeIds: upgradeIds,
      })
      playSound(SoundFile.CashRegister)
    }
  }
  
  return (
    <View style={styles.upgradeWrapper}>
      <Image style={styles.generatorIcon} source={image}/>
      <View style={styles.upgradeTextWrapper}>
        <Text style={styles.upgradeTitle}>{title}</Text>
        <Text style={styles.upgradeDescription}>{description}</Text>
        <Text style={styles.upgradePrice}>{coefficient} {scale} steps</Text>
      </View>
      <TouchableOpacity style={[styles.buyUpgradeButton, isDisabled ? {backgroundColor: colors.gray4} : {}]} activeOpacity={.8} onPress={buyUpgrade} disabled={isDisabled}>
        <Text style={styles.buyUpgradeText}>Buy!</Text>
      </TouchableOpacity>
    </View>
)}

const styles = EStyleSheet.create({
  upgradeWrapper: {
    marginTop: 10,
    width: '90%',
    height: '5rem',
    borderRadius: 10,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  generatorIcon: {
    height: 64,
    width: 64,
    marginLeft: 10,
  },
  upgradeTextWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  upgradeTitle: {
    fontFamily: 'oleo-script',
    color: colors.orange3,
  },
  upgradeDescription: {

  },
  upgradePrice: {

  },

  buyUpgradeButton: {
    marginRight: 10,
    backgroundColor: colors.orange3,
    width: 100,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyUpgradeText: {
    fontFamily: 'oleo-script',
    color: colors.white,
    fontSize: '1.5rem',
  }
})