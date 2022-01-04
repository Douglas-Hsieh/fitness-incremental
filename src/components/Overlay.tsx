import { StyleSheet, View } from "react-native"
import colors from "../../assets/colors/colors"

export const Overlay = () => (
  <View style={styles.overlay}/>
)

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
    opacity: .5,
  }
})