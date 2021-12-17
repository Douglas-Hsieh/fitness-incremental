import React, { memo } from "react"
import { Text, View } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import colors from "../../assets/colors/colors"

interface HeaderProps {
  title: string;
}

export const Header = memo(({title}: HeaderProps) => (
  <View style={styles.headerWrapper}>
    <Text style={styles.headerText}>{title}</Text>
  </View>
))

const styles = EStyleSheet.create({
    headerWrapper: {
      width: '50%',
      height: '8%',
      backgroundColor: colors.orange3,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
    },
    headerText: {
      fontFamily: 'oleo-script-bold',
      color: colors.white,
      fontSize: '1.5rem',
    },
})