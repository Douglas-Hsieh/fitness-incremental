import { GestureResponderEvent, Pressable, Text } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
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
    <Pressable
      style={({pressed}) => [{opacity: pressed ? 0.5 : 1.0}, styles.button]}
      onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  )
}

