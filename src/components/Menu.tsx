import React, { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import colors from "../../assets/colors/colors"
import Screen from "../enums/Screen"

interface MenuProps {
  setIsMenuShown: (isMenuShown: boolean) => void;
  setScreen: (screen: Screen) => void;
}

export const Menu = memo(({setIsMenuShown, setScreen}: MenuProps) => (
  <View style={styles.menu}>
    <TouchableOpacity style={styles.menuOverlay} activeOpacity={.5} onPress={() => setIsMenuShown(false)}/>

    <TouchableOpacity style={styles.menuItem} activeOpacity={.9} onPress={() => setScreen(Screen.Upgrades)}>
      <Text style={styles.menuItemText}>Upgrades</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.menuItem} activeOpacity={.9} onPress={() => setScreen(Screen.Unlocks)}>
      <Text style={styles.menuItemText}>Unlocks</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.menuItem} activeOpacity={.9} onPress={() => setScreen(Screen.Trainers)}>
      <Text style={styles.menuItemText}>Trainers</Text>
    </TouchableOpacity>
  </View>
))

const styles = EStyleSheet.create({
    // Menu
    menu: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: colors.black,
      opacity: .5,
    },
    menuItems: {
      alignItems: 'center',
    },
    menuItem: {
      marginTop: '10%',
      width: '50%',
      height: '10%',
      borderRadius: 10,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemText: {
      fontFamily: 'oleo-script',
      fontSize: 30,
      color: colors.gray5,
    },
})