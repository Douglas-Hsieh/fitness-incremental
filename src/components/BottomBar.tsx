import { MaterialIcons, Foundation } from "@expo/vector-icons"
import React, { memo } from "react"
import { TouchableOpacity, View } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import colors from "../../assets/colors/colors"
import Screen from "../enums/Screen"

interface BottomBarProps {
  setScreen: (screen: Screen) => void;
}

export const BottomBar = memo(({ setScreen }: BottomBarProps) => (
  <View style={styles.bottomBar}>
    <View style={styles.overlay}/>
    <View style={styles.bottomBarWrapper}> 
      <TouchableOpacity onPress={() => setScreen(Screen.Home)}>
        <Foundation name={'home'} size={36}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen(Screen.Upgrades)}>
        <MaterialIcons name={'upgrade'} size={36}/>
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