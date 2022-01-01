import { Audio } from "expo-av"
import * as All from "../../assets/audio"

export enum SoundFile {
  CashRegister = 'cashRegister',
  MenuSelectionClick = 'menuSelectionClick',
  SwitchOn = 'switchOn',
}

export const playSound = async (soundFile: SoundFile) => {
  const {sound} = await Audio.Sound.createAsync(All[soundFile])

  sound.playAsync()
  
  setTimeout(() => {
    sound.unloadAsync()
  }, 10000)  // Hacky: this won't work for long audio files
}