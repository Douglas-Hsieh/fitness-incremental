import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { DEBUG_GAME_STATE, GameState, INITIAL_GAME_STATE } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Button } from "../components/Button";
import Center from "../components/Center";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Header } from "../components/Header";
import Screen from "../enums/Screen";

interface MiscellaneousScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const MiscellaneousScreen = ({setScreen, gameState, setGameState}: MiscellaneousScreenProps) => {
  const [showDeleteDataModal, setShowDeleteDataModal] = useState<boolean>(false)

  const deleteData = () => {
    setGameState(INITIAL_GAME_STATE)
  }

  const toggleSpeed = () => {
    setGameState(prevGameState => ({
      ...prevGameState,
      speed: prevGameState.speed === 1 ? 100 : 1,
    }))
  }

  const debug = () => {
    setGameState({
      ...DEBUG_GAME_STATE,
      user: gameState.user,
      fitnessLocation: gameState.fitnessLocation,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>

      <View style={styles.screenWrapper}>
        <Header title={'Miscellaneous'}/>
        { gameState.user && gameState.user.roles.includes('ROLE_ADMIN') &&
          <Center>
            <Button text={'Fitness Locations'} onPress={() => setScreen(Screen.FitnessLocationAdmin)}/>
            <Button text={`Speed x${gameState.speed}`} onPress={toggleSpeed}/>
            <Button text={'Debug GameState'} onPress={debug}/>
          </Center>
        }
        <Center>
          <Button text={'Delete Data'} style={{backgroundColor: 'red'}} onPress={() => setShowDeleteDataModal(true)}/>
        </Center>
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
  },
})