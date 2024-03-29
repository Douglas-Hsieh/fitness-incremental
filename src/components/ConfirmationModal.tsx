import React from "react"
import { Modal, Text, View } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import colors from "../../assets/colors/colors"
import { window } from "../util/Window"
import { Button } from "./Button"


export interface ConfirmationModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  body: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DEFAULT_CONFIRMATION_MODAL_PROPS: ConfirmationModalProps = {
  visible: false,
  setVisible: () => {},
  title: '',
  body: '',
  onConfirm: () => {},
  onCancel: () => {},
}

export const ConfirmationModal = ({visible, setVisible, title, body, onConfirm, onCancel}: ConfirmationModalProps) => {

  return (
    <Modal
      animationType={'fade'}
      visible={visible}
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modal}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.buttons}>
          <Button text={'Confirm'} onPress={() => {
            onConfirm()
            setVisible(false)
          }}/>
          <Button text={'Cancel'} onPress={() => {
            onCancel()
            setVisible(false)
          }}/>
        </View>
      </View>
    </Modal>
  )

}

const styles = EStyleSheet.create({
  modal: {
    position: 'absolute',
    marginLeft: window.width / 6,
    marginTop: window.height / 4,
    width: window.width / 1.5,
    height: window.width / 1.5,
    maxHeight: window.height / 1.5,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    borderWidth: 1,
  },
  title: {
    fontSize: '1.5rem',
  },
  body: {
    fontSize: '1rem',
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})