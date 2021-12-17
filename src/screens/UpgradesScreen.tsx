import React, { memo } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../../assets/colors/colors";
import { CURRENCY_GENERATORS } from "../../assets/data/CurrencyGenerators";
import { CURRENCY_UPGRADES } from "../../assets/data/CurrencyUpgrades";
import { GameState } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Description } from "../components/Description";
import { Header } from "../components/Header";
import Screen from "../enums/Screen";
import { numberToHumanFormat } from "../math";

interface UpgradeComponentProps {
  upgradeId: number;
  title: string;
  description: string;
  price: number;
  image: any;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

const UpgradeComponent = ({upgradeId, title, description, price, image, gameState, setGameState}: UpgradeComponentProps) => {
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

interface UpgradesListProps {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

const UpgradesList = ({gameState, setGameState}: UpgradesListProps) => {
  const remainingUpgrades = CURRENCY_UPGRADES.filter(upgrade => !gameState.upgradeIds.contains(upgrade.id))

  return (
    <View>
      { remainingUpgrades.map(upgrade => {

        const generator = CURRENCY_GENERATORS.find(generator => generator.id == upgrade.generatorId);

        if (generator) {
          return (
            <UpgradeComponent
              key={`${upgrade.id}`}
              upgradeId={upgrade.id}
              title={generator.name}
              description={`${generator.name} steps x3`}
              price={upgrade.price}
              image={generator.image}
              gameState={gameState}
              setGameState={setGameState}
            />
          )
        }
        })}
    </View>
  )  
}

interface UpgradesScreenProps {
  setScreen: (screen: Screen) => void;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

export const UpgradesScreen = ({setScreen, gameState, setGameState}: UpgradesScreenProps) => {

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

        <ScrollView
          style={styles.scroll}
          contentInsetAdjustmentBehavior='automatic'
          showsVerticalScrollIndicator={false}
        >
          <UpgradesList
            gameState={gameState}
            setGameState={setGameState}
          />
        </ScrollView>
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

});
