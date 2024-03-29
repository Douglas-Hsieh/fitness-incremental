import { GestureResponderEvent, LayoutChangeEvent, Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import colors from "../../assets/colors/colors"

export interface ButtonProps {
  text: string;
  onPress?: (((event: GestureResponderEvent) => void) & (() => void)) | undefined;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>
}

export const Button = ({text, onPress, onLayout, style, textStyle}: ButtonProps) => {

  return (
    <Pressable
      style={({pressed}) => [{opacity: pressed ? 0.5 : 1.0}, styles.button, style]}
      onPress={onPress}
      onLayout={onLayout}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </Pressable>
  )
}

const styles = EStyleSheet.create({
  button: {
    backgroundColor: colors.orange3,
    padding: 10,
    borderRadius: 10,
  },
  text: {
    color: colors.white,
    fontFamily: 'oleo-script',
    fontSize: '1.5rem',
    textAlign: 'center',
  },
})