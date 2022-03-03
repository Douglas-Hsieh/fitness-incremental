import { Ionicons } from "@expo/vector-icons"
import React, { memo } from "react"
import { TouchableOpacity, View } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import colors from "../../assets/colors/colors"
import Screen from "../enums/Screen"

interface BottomBarProps {
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
}

export const BottomBar = memo(({ screen, setScreen }: BottomBarProps) => (
  <View style={styles.bottomBar}>
    <View style={styles.overlay}/>
    <View style={styles.bottomBarWrapper}> 
      <TouchableOpacity onPress={() => setScreen(Screen.Home)}>
        <Ionicons name={screen === Screen.Home ? 'person-sharp' : 'person-outline'} size={36}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen(Screen.Upgrades)}>
        <Ionicons name={screen === Screen.Upgrades ? 'arrow-up-circle' : 'arrow-up-circle-outline'} size={36}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen(Screen.Unlocks)}>
        <Ionicons name={screen === Screen.Unlocks ? 'lock-open-sharp' : 'lock-closed-outline'} size={36}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen(Screen.Prestige)}>
        <Ionicons name={screen === Screen.Prestige ? 'star' : 'star-outline'} size={36}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen(Screen.Tasks)}>
        <Ionicons name={screen === Screen.Tasks ? 'barbell-sharp' : 'barbell-outline'} size={36}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen(Screen.Miscellaneous)}>
        <Ionicons name={screen === Screen.Miscellaneous ? 'settings-sharp' : 'settings-outline'} size={36}/>
      </TouchableOpacity>
    </View>
  </View>
))

const styles = EStyleSheet.create({
    bottomBar: {
      width: '100%',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
      opacity: .90,
      position: 'absolute',
    },
    bottomBarWrapper: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
})