import React from "react";
import { SafeAreaView, View, Image} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { FlatList } from "react-native-gesture-handler";
import colors from "../../assets/colors/colors";
import { EVERYONE_GENERATOR, GENERATORS } from "../../assets/data/Generators";
import { GENERATOR_MULTIPLIER_UPGRADES } from "../../assets/data/Upgrades";
import { GameState } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Description } from "../components/Description";
import { Header } from "../components/Header";
import Screen from "../enums/Screen";
import { UpgradeItem, UpgradeItemProps } from "../components/UpgradeItem";

interface UpgradesListProps {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

const UpgradesList = ({gameState, setGameState}: UpgradesListProps) => {
  const remainingUpgrades = GENERATOR_MULTIPLIER_UPGRADES
    .filter(upgrade => !gameState.upgradeIds.contains(upgrade.id))
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
      upgradeId: upgrade.id,
      title: generatorName,
      description: `${generatorName} steps x3`,
      price: upgrade.price,
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

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>
      <View style={styles.backgroundOverlay}/>
      
      <View style={styles.upgradesWrapper}>
        <Header title={'Upgrades'}/>

        <View style={styles.upgradeIconList}>
          <View style={styles.upgradeIconContainer}>
            <Image source={require('../../assets/images/steps.png')} style={styles.upgradeIcon}/>
          </View>
          <View style={styles.upgradeIconContainer}>
            <Image source={require('../../assets/images/trainer.png')} style={styles.upgradeIcon}/>
          </View>
        </View>

        <Description
          title={'The best investment you can ever make is in your own health.'}
          body={'Spend your hard earned steps to give your followers a boost.'}
        />

        <UpgradesList
          gameState={gameState}
          setGameState={setGameState}
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
    height: 64,
    width: 64,
    backgroundColor: colors.gray4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    marginLeft: 10,
  },
  upgradeIcon: {
    height: 45,
    width: 45,
  },

  // Upgrades
  scroll: {
    marginTop: 10,
  },

});
