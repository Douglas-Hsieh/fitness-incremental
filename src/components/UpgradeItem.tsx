import React, { memo } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "../../assets/colors/colors";
import { GameState } from "../../assets/data/GameState";
import { GeneratorMultiplierUpgrade, getUpgradeId, ManagerUpgrade, UpgradeType } from "../../assets/data/Upgrades";
import { Currency } from "../enums/Currency";
import { numberToHumanFormat } from "../math/formatting";
import { playSound, SoundFile } from "../util/sounds";

export interface UpgradeItemProps {
  upgradeType: UpgradeType;
  upgrade: GeneratorMultiplierUpgrade | ManagerUpgrade;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  image: any;
  isDisabled: boolean;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const UpgradeItem = memo(({upgradeType, upgrade, title, description, price, currency, image, isDisabled, setGameState}: UpgradeItemProps) => {
  const upgradeId = getUpgradeId(upgrade)
  const [coefficient, scale] = numberToHumanFormat(price, 0, 0);
  const currencyText = currency === Currency.Cash
    ? 'steps'
    : 'trainers'

  const buyUpgrade = () => {
    if (!isDisabled) {
      if (upgradeType === UpgradeType.GeneratorMultiplierCashUpgrade) {
        setGameState(prevGameState => {
          const upgradeIds = prevGameState.upgradeState.generatorMultiplierCashUpgradeIds.add(upgradeId)
          return {
            ...prevGameState,
            balance: prevGameState.balance - price,
            upgradeState: {
              ...prevGameState.upgradeState,
              generatorMultiplierCashUpgradeIds: upgradeIds,
            }
          }
        })
      } else if (upgradeType === UpgradeType.GeneratorMultiplierPrestigeUpgrade) {
        setGameState(prevGameState => {
          const upgradeIds = prevGameState.upgradeState.generatorMultiplierPrestigeUpgradeIds.add(upgradeId)
          return {
            ...prevGameState,
            prestige: prevGameState.prestige - price,
            spentPrestige: prevGameState.spentPrestige + price,
            upgradeState: {
              ...prevGameState.upgradeState,
              generatorMultiplierPrestigeUpgradeIds: upgradeIds,
            }
          }
        })
      } else if (upgradeType === UpgradeType.ManagerUpgrade) {
        setGameState(prevGameState => {
          const upgradeIds = prevGameState.upgradeState.managerUpgradeIds.add(upgradeId)
          const generatorState = prevGameState.generatorStateById.get(upgrade.generatorId)!
          const generatorStateById = prevGameState.generatorStateById.set(upgrade.generatorId, {
            ...generatorState,
            hasManager: true,
          })

          return {
            ...prevGameState,
            balance: prevGameState.balance - price,
            upgradeState: {
              ...prevGameState.upgradeState,
              managerUpgradeIds: upgradeIds,
            },
            generatorStateById: generatorStateById
          }
        })
      }
      playSound(SoundFile.CashRegister)

    }
  }
  
  return (
    <View style={styles.upgradeWrapper}>
      <Image style={styles.generatorIcon} source={image}/>
      <View style={styles.upgradeTextWrapper}>
        <Text style={styles.upgradeTitle}>{title}</Text>
        <Text style={styles.upgradeDescription}>{description}</Text>
        <Text style={styles.upgradePrice}>{coefficient} {scale} {currencyText}</Text>
      </View>
      <TouchableOpacity style={[styles.buyUpgradeButton, isDisabled ? {backgroundColor: colors.gray4} : {}]} activeOpacity={.8} onPress={buyUpgrade} disabled={isDisabled}>
        <Text style={styles.buyUpgradeText}>Buy!</Text>
      </TouchableOpacity>
    </View>
)})

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