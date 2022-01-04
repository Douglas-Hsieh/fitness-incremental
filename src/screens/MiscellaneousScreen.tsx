import { SafeAreaView, StyleSheet, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import colors from "../../assets/colors/colors";
import { GameState, INITIAL_GAME_STATE } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Button } from "../components/Button";
import Screen from "../enums/Screen";

interface MiscellaneousScreenProps {
  setScreen: (screen: Screen) => void;
  setGameState: (gameState: GameState) => void;
}

export const MiscellaneousScreen = ({setScreen, setGameState}: MiscellaneousScreenProps) => {

  const handleDeleteData = () => {
    setGameState(INITIAL_GAME_STATE)
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>
      <View style={styles.screenWrapper}>
        <Button text={'Delete Data'} color={'red'} onPress={handleDeleteData}/>
      </View>

      <BottomBar screen={Screen.Miscellaneous} setScreen={setScreen}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})