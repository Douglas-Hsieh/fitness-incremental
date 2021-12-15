import { StyleSheet, View } from "react-native";

interface CenterProps {

}

const Center: React.FC<CenterProps> = ({children}) => (
  <View style={styles.center}>
    {children}
  </View>
)

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Center;