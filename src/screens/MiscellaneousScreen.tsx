import React, { memo, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { DEBUG_GAME_STATE, GameState, INITIAL_GAME_STATE } from "../../assets/data/GameState";
import { Background } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Button } from "../components/Button";
import Center from "../components/Center";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Header } from "../components/Header";
import Screen from "../enums/Screen";
import { FitnessLocation } from "../shared/fitness-locations.interface";
import { User } from "../shared/users.interface";

interface MiscellaneousScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  user: User | undefined;
  speed: number;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  fitnessLocation: FitnessLocation | null;
}

export const MiscellaneousScreen = memo(({setScreen, user, speed, setGameState, fitnessLocation}: MiscellaneousScreenProps) => {
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
    setGameState(prevGameState => ({
      ...DEBUG_GAME_STATE,
      user: prevGameState.user,
      fitnessLocation: fitnessLocation,
      visitHistory: prevGameState.visitHistory,
    }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <Background/>

      <View style={styles.screenWrapper}>
        <Header title={'Miscellaneous'}/>
        { user && user.roles.includes('ROLE_ADMIN') &&
          <Center>
            <Button text={'Fitness Locations'} onPress={() => setScreen(Screen.FitnessLocationAdmin)}/>
            <Button text={`Speed x${speed}`} onPress={toggleSpeed}/>
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
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
  },
})