import { Ionicons } from "@expo/vector-icons"
import React, { memo } from "react"
import { TouchableOpacity, View } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { HighlightableElement } from "react-native-highlight-overlay"
import colors from "../../assets/colors/colors"
import Screen from "../enums/Screen"
import { HighlightId } from "../enums/HightlightId"
import { HIGHLIGHTABLE_RECTANGLE_OPTIONS } from "../../assets/data/Constants"

const ICON_SIZE = 36

interface BottomBarProps {
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
}

export const BottomBar = memo(({ screen, setScreen }: BottomBarProps) => (
  <View style={styles.bottomBar}>
    <View style={styles.overlay}/>
    <View style={styles.bottomBarWrapper}>
      <Ionicons name={screen === Screen.Home ? 'person-sharp' : 'person-outline'} size={ICON_SIZE}/>
      <Ionicons name={screen === Screen.Upgrades ? 'arrow-up-circle' : 'arrow-up-circle-outline'} size={ICON_SIZE}/>
      <Ionicons name={screen === Screen.Unlocks ? 'lock-open-sharp' : 'lock-closed-outline'} size={ICON_SIZE}/>
      <Ionicons name={screen === Screen.Prestige ? 'star' : 'star-outline'} size={ICON_SIZE}/>
      <Ionicons name={screen === Screen.Tasks ? 'barbell-sharp' : 'barbell-outline'} size={ICON_SIZE}/>
      <Ionicons name={screen === Screen.Miscellaneous ? 'settings-sharp' : 'settings-outline'} size={ICON_SIZE}/>
    </View>
    <View style={[{position: 'absolute'}, styles.bottomBarWrapper]}>
      <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Home)}/>
      <HighlightableElement id={HighlightId.UpgradesTab} options={HIGHLIGHTABLE_RECTANGLE_OPTIONS}>
        <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Upgrades)}/>
      </HighlightableElement>
      <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Unlocks)}/>
      <HighlightableElement id={HighlightId.PrestigeTab} options={HIGHLIGHTABLE_RECTANGLE_OPTIONS}>
        <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Prestige)}/>
      </HighlightableElement>
      <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Tasks)}/>
      <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Miscellaneous)}/>
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
    touchableIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
    }
})