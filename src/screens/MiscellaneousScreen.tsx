import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { GameState, INITIAL_GAME_STATE } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Button } from "../components/Button";
import { ConfirmationModal } from "../components/ConfirmationModal";
import Screen from "../enums/Screen";

interface MiscellaneousScreenProps {
  setScreen: (screen: Screen) => void;
  setGameState: (gameState: GameState) => void;
}

export const MiscellaneousScreen = ({setScreen, setGameState}: MiscellaneousScreenProps) => {
  const [showDeleteDataModal, setShowDeleteDataModal] = useState<boolean>(false)

  const deleteData = () => {
    setGameState(INITIAL_GAME_STATE)
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>
      <View style={styles.screenWrapper}>
        <Button text={'Delete Data'} color={'red'} onPress={() => setShowDeleteDataModal(true)}/>
      </View>

      <BottomBar screen={Screen.Miscellaneous} setScreen={setScreen}/>

      <ConfirmationModal
        visible={showDeleteDataModal}
        title={'Confirm Deletion'}
        body={'Are you sure you want to delete all data and progress?'}
        onConfirm={() => {
          deleteData()
          setShowDeleteDataModal(false)
        }}
        onCancel={() => {setShowDeleteDataModal(false)}}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})