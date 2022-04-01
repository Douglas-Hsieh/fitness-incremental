import { memo } from "react";
import { GestureResponderEvent, Image, Pressable, Text, View } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import colors from "../../assets/colors/colors"

const AvatarImage = memo(() => (
  <Image source={require('../../assets/images/trainer.png')} style={styles.avatarIcon}/>
));

interface DialogueModalProps {
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined
  body: string;
}

export const DialogueModal = memo(({ onPress, body }: DialogueModalProps) => (
  <Pressable onPress={onPress} style={styles.modal}>
    <Text style={styles.body}>{body}</Text>
    <View style={{flex: .25, flexDirection: 'row'}}>
      <AvatarImage/>
    </View>
  </Pressable>
))

const styles = EStyleSheet.create({
  modal: {
    alignSelf: 'center',
    flexDirection: 'row',
    position: 'absolute',
    width: '90%',
    height: '25%',
    bottom: 50,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    borderWidth: 2,
  },
  pressable: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: '1.5rem',
  },
  body: {
    fontSize: '1.5rem',
    flex: .7,
  },
  avatarIcon: {
    width: '100%',
    aspectRatio: 1,
  },
})