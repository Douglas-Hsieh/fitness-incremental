import { Ionicons } from "@expo/vector-icons"
import React, { memo, useContext } from "react"
import { TouchableOpacity, View } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { HighlightableElement } from "react-native-highlight-overlay"
import colors from "../../assets/colors/colors"
import Screen from "../enums/Screen"
import { HighlightId } from "../enums/HightlightId"
import { HIGHLIGHTABLE_RECTANGLE_OPTIONS } from "../../assets/data/Constants"
import { AppContext } from "../../contexts/AppContext"

const ICON_SIZE = 36
const BADGE_SIZE = 6
export const BOTTOM_BAR_HEIGHT = ICON_SIZE + BADGE_SIZE + 10

interface BottomBarProps {
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
}

export const BottomBar = memo(({ screen, setScreen }: BottomBarProps) => {

  const context = useContext(AppContext)!
  const { upgradeIconHasBadge, taskIconHasBadge } = context
  

  return (
    <View style={styles.bottomBar}>

      <View style={styles.overlay} />

      <View style={styles.bottomBarWrapper}>
        <Ionicons name={screen === Screen.Home ? 'person-sharp' : 'person-outline'} size={ICON_SIZE} />
        <View style={styles.iconAndBadge}>
          <Ionicons name={screen === Screen.Upgrades ? 'arrow-up-circle' : 'arrow-up-circle-outline'} size={ICON_SIZE} />
          { upgradeIconHasBadge && screen !== Screen.Upgrades && <View style={styles.badge} /> }
        </View>
        <Ionicons name={screen === Screen.Unlocks ? 'lock-open-sharp' : 'lock-closed-outline'} size={ICON_SIZE} />
        <Ionicons name={screen === Screen.Prestige ? 'star' : 'star-outline'} size={ICON_SIZE} />
        <View style={styles.iconAndBadge}>
          <Ionicons name={screen === Screen.Tasks ? 'barbell-sharp' : 'barbell-outline'} size={ICON_SIZE} />
          { taskIconHasBadge && screen !== Screen.Tasks && <View style={styles.badge} /> }
        </View>
        <Ionicons name={screen === Screen.Miscellaneous ? 'settings-sharp' : 'settings-outline'} size={ICON_SIZE} />
      </View>

      <View style={[{ position: 'absolute' }, styles.bottomBarWrapper]}>
        <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Home)} />
        <HighlightableElement id={HighlightId.UpgradesTab} options={HIGHLIGHTABLE_RECTANGLE_OPTIONS}>
          <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Upgrades)} />
        </HighlightableElement>
        <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Unlocks)} />
        <HighlightableElement id={HighlightId.PrestigeTab} options={HIGHLIGHTABLE_RECTANGLE_OPTIONS}>
          <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Prestige)} />
        </HighlightableElement>
        <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Tasks)} />
        <TouchableOpacity style={styles.touchableIcon} onPress={() => setScreen(Screen.Miscellaneous)} />
      </View>

    </View>
  )
})

const styles = EStyleSheet.create({
    bottomBar: {
      width: '100%',
      height: BOTTOM_BAR_HEIGHT,
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
    iconAndBadge: {
      width: ICON_SIZE,
      height: ICON_SIZE + BADGE_SIZE,
      flexDirection: 'column',
      alignItems: 'center',
    },
    touchableIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
    },
    badge: {
      width: BADGE_SIZE,
      height: BADGE_SIZE,
      borderRadius: BADGE_SIZE,
      backgroundColor: colors.orange3,
      marginRight: 2  // Because Ionicons are slightly off center
    }
})