import { GestureResponderEvent, Text } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { TouchableOpacity } from "react-native-gesture-handler"
import colors from "../../assets/colors/colors"

interface ButtonProps {
  text: string;
  onPress?: (((event: GestureResponderEvent) => void) & (() => void)) | undefined
  color?: string;
}

export const Button = ({text, onPress, color = colors.orange3}: ButtonProps) => {

  const styles = EStyleSheet.create({
    button: {
      backgroundColor: color,
      padding: 10,
      borderRadius: 10,
    },
    text: {
      color: colors.white,
      fontFamily: 'oleo-script',
      fontSize: '1.5rem',
    },
  })

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  )
}

