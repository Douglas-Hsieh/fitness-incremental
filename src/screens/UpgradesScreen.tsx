import React from "react";
import { SafeAreaView, View, Image} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../assets/colors/colors";
import { UpgradeType } from "../../assets/data/Upgrades";
import { GameState } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Description } from "../components/Description";
import { Header } from "../components/Header";
import Screen from "../enums/Screen";
import { playSound, SoundFile } from "../util/sounds";
import UpgradesList from "./UpgradesList";

interface UpgradesScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  upgradeType: UpgradeType;
  setUpgradeType: React.Dispatch<React.SetStateAction<UpgradeType>>;
}

export const UpgradesScreen = ({setScreen, gameState, setGameState, upgradeType, setUpgradeType}: UpgradesScreenProps) => {

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>
      <View style={styles.backgroundOverlay}/>
      
      <View style={styles.upgradesWrapper}>
        <Header title={'Upgrades'}/>

        <View style={styles.upgradeIconList}>
          <TouchableOpacity style={[
              styles.upgradeIconContainer,
              upgradeType === UpgradeType.GeneratorMultiplierCashUpgrade ? styles.selected : {},
            ]}
            onPress={() => {
              setUpgradeType(UpgradeType.GeneratorMultiplierCashUpgrade)
              playSound(SoundFile.SwitchOn)
            }}
          >
            <Image source={require('../../assets/images/steps.png')} style={styles.upgradeIcon}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.upgradeIconContainer,
              upgradeType === UpgradeType.GeneratorMultiplierPrestigeUpgrade ? styles.selected : {},
            ]}
            onPress={() => {
              setUpgradeType(UpgradeType.GeneratorMultiplierPrestigeUpgrade)
              playSound(SoundFile.SwitchOn)
            }}          >
            <Image source={require('../../assets/images/trainer.png')} style={styles.upgradeIcon}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.upgradeIconContainer,
              upgradeType === UpgradeType.ManagerUpgrade ? styles.selected : {},
            ]}
            onPress={() => {
              setUpgradeType(UpgradeType.ManagerUpgrade)
              playSound(SoundFile.SwitchOn)
            }}
          >
            <Image source={require('../../assets/images/puppy.png')} style={styles.upgradeIcon}/>
          </TouchableOpacity>
        </View>

        <Description
          title={'The best investment you can ever make is in your own health.'}
          body={'Spend your hard earned steps to give your followers a boost.'}
        />

        <UpgradesList
          gameState={gameState}
          setGameState={setGameState}
          upgradeType={upgradeType}
        />
      </View>

      <BottomBar screen={Screen.Upgrades} setScreen={setScreen}/>
    </SafeAreaView>
  );
}

export const styles = EStyleSheet.create({
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
});
