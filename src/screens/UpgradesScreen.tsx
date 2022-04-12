import React from "react";
import { SafeAreaView, View} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "../../assets/colors/colors";
import { UpgradeType } from "../../assets/data/Upgrades";
import { GameState } from "../../assets/data/GameState";
import { Background } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Description } from "../components/Description";
import { Header } from "../components/Header";
import Screen from "../enums/Screen";
import UpgradesList from "./UpgradesList";
import { UpgradeIconList } from "./UpgradeIconList";

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
      <Background/>
      <View style={styles.backgroundOverlay}/>

      <View style={styles.upgradesWrapper}>
        <Header title={'Upgrades'}/>

        <UpgradeIconList
          upgradeType={upgradeType}
          setUpgradeType={setUpgradeType}
        />

        <Description
          title={'The best investment you can ever make is in your own health.'}
          body={'Spend steps to make your followers stronger and faster.'}
        />

        <View style={{height: 10}}/>

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
});
