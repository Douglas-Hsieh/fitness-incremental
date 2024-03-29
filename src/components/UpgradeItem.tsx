import React, { memo, useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { HighlightableElement } from "react-native-highlight-overlay";
import colors from "../../assets/colors/colors";
import { HIGHLIGHTABLE_RECTANGLE_OPTIONS } from "../../assets/data/Constants";
import { GameState } from "../../assets/data/GameState";
import { GeneratorMultiplierUpgrade, getUpgradeId, ManagerUpgrade, UpgradeType } from "../../assets/data/Upgrades";
import { Currency } from "../enums/Currency";
import { HighlightId } from "../enums/HightlightId";
import { numberToHumanFormat } from "../math/formatting";
import { playSound, SoundFile } from "../util/sounds";
import { ConfirmationModalProps, DEFAULT_CONFIRMATION_MODAL_PROPS } from "./ConfirmationModal";

export interface UpgradeItemProps {
  upgradeType: UpgradeType;
  upgrade: GeneratorMultiplierUpgrade | ManagerUpgrade;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  image: any;
  isDisabled: boolean;
  isExpensive: boolean;
  setModalProps: React.Dispatch<React.SetStateAction<ConfirmationModalProps>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const UpgradeItem = memo(({upgradeType, upgrade, title, description, price, currency, image, isDisabled, isExpensive, setModalProps, setGameState}: UpgradeItemProps) => {
  const upgradeId = getUpgradeId(upgrade)
  const [coefficient, scale] = numberToHumanFormat(price, 0, 0);
  const currencyText = currency === Currency.Cash
    ? 'steps'
    : 'trainers'
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (showModal) {
      setModalProps({
        visible: true,
        setVisible: setShowModal,
        title: `Warning`,
        body: `This upgrade is very expensive. Are you sure you want to buy it?`,
        onConfirm: buyUpgrade,
        onCancel: () => {},
      })
    } else {
      setModalProps(DEFAULT_CONFIRMATION_MODAL_PROPS)
    }
  }, [showModal])

  function handleBuyUpgrade() {
    if (isExpensive) {
      handleBuyExpensiveUpgrade()
    } else {
      buyUpgrade()
    }
  }

  function handleBuyExpensiveUpgrade() {
    setShowModal(true)
  }

  function buyUpgrade() {
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
  
  const upgradeItemComponent = (
    <View style={styles.upgradeWrapper}>
      <Image style={styles.generatorIcon} source={image}/>
      <View style={styles.upgradeTextWrapper}>
        <Text style={styles.upgradeTitle}>{title}</Text>
        <Text style={styles.upgradeDescription}>{description}</Text>
        <Text style={styles.upgradePrice}>{coefficient} {scale} {currencyText}</Text>
      </View>
      <TouchableOpacity style={[styles.buyUpgradeButton, isDisabled ? {backgroundColor: colors.gray4} : {}]} activeOpacity={.8} onPress={handleBuyUpgrade} disabled={isDisabled}>
        <Text style={styles.buyUpgradeText}>Buy!</Text>
      </TouchableOpacity>
    </View>
  )

  if (upgradeType === UpgradeType.ManagerUpgrade && upgrade.generatorId === '1') {
    return (
      <HighlightableElement id={HighlightId.ManagerUpgrade1} options={HIGHLIGHTABLE_RECTANGLE_OPTIONS}>
        {upgradeItemComponent}
      </HighlightableElement>
    )
  } else {
    return upgradeItemComponent
  }
})

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