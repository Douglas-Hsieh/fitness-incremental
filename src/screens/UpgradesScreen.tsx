import React, { useState } from "react";
import { SafeAreaView, View, Image} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../assets/colors/colors";
import { EVERYONE_GENERATOR, GENERATORS } from "../../assets/data/Generators";
import { GENERATOR_MULTIPLIER_CASH_UPGRADES, GENERATOR_MULTIPLIER_PRESTIGE_UPGRADES, getUpgradeId } from "../../assets/data/Upgrades";
import { GameState } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Description } from "../components/Description";
import { Header } from "../components/Header";
import Screen from "../enums/Screen";
import { UpgradeItem, UpgradeItemProps } from "../components/UpgradeItem";
import { Currency } from "../enums/Currency";

interface UpgradesListProps {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  currency: Currency;
}

const UpgradesList = ({gameState, setGameState, currency}: UpgradesListProps) => {

  const generatorMultiplierUpgrades = currency === Currency.Cash
    ? GENERATOR_MULTIPLIER_CASH_UPGRADES
    : GENERATOR_MULTIPLIER_PRESTIGE_UPGRADES

  const remainingUpgrades = generatorMultiplierUpgrades
    .filter(upgrade => !gameState.upgradeIds.contains(getUpgradeId(upgrade)))
    .sort((u1, u2) => u1.price - u2.price)

  const upgradeData = remainingUpgrades.map(upgrade => {
    let image;
    let generatorName;

    if (upgrade.generatorId === '0') {
      image = EVERYONE_GENERATOR.image
      generatorName = EVERYONE_GENERATOR.name
    } else {
      const generator = GENERATORS.find(generator => generator.id == upgrade.generatorId)!;
      image = generator.image
      generatorName = generator.name
    }

    return {
      upgradeId: getUpgradeId(upgrade),
      title: generatorName,
      description: `${generatorName} steps x3`,
      price: upgrade.price,
      currency: upgrade.priceCurrency,
      image: image,
      gameState: gameState,
      setGameState: setGameState,
    }
  })

  const renderItem = ({item}: {item: UpgradeItemProps}) => <UpgradeItem {...item} />

  return (
    <FlatList
      data={upgradeData}
      renderItem={renderItem}
      keyExtractor={item => item.upgradeId}
      style={styles.scroll}
      contentInsetAdjustmentBehavior='automatic'
      showsVerticalScrollIndicator={false}
    />
  )
}

interface UpgradesScreenProps {
  setScreen: (screen: Screen) => void;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

export const UpgradesScreen = ({setScreen, gameState, setGameState}: UpgradesScreenProps) => {
  console.log('UpgradesScreen render')

  const [currency, setCurrency] = useState<Currency>(Currency.Cash)

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>
      <View style={styles.backgroundOverlay}/>
      
      <View style={styles.upgradesWrapper}>
        <Header title={'Upgrades'}/>

        <View style={styles.upgradeIconList}>
          <TouchableOpacity style={[
              styles.upgradeIconContainer,
              currency === Currency.Cash ? styles.selected : {},
            ]}
            onPress={() => setCurrency(Currency.Cash)}
          >
            <Image source={require('../../assets/images/steps.png')} style={styles.upgradeIcon}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.upgradeIconContainer,
              currency === Currency.Prestige ? styles.selected : {},
            ]}
            onPress={() => setCurrency(Currency.Prestige)}
          >
            <Image source={require('../../assets/images/trainer.png')} style={styles.upgradeIcon}/>
          </TouchableOpacity>
        </View>

        <Description
          title={'The best investment you can ever make is in your own health.'}
          body={'Spend your hard earned steps to give your followers a boost.'}
        />

        <UpgradesList
          gameState={gameState}
          setGameState={setGameState}
          currency={currency}
        />
      </View>

      <BottomBar screen={Screen.Upgrades} setScreen={setScreen}/>
    </SafeAreaView>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    opacity: .6,
  },
  upgradesWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  // Exit
  exitButton: {
    width: '5%',
    height: '5%',
    backgroundColor: colors.white,
  },

  // Upgrade Type
  upgradeIconList: {
    marginTop: 10,
    flexDirection: 'row',
  },
  upgradeIconContainer: {
    height: 80,
    width: 80,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    marginLeft: 10,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: colors.gray4,
  },
  upgradeIcon: {
    height: 50,
    width: 50,
  },

  // Upgrades
  scroll: {
    marginTop: 10,
  },

});
