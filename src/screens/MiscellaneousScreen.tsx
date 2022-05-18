import React, { memo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { DEBUG_GAME_STATE, GameState, INITIAL_GAME_STATE } from "../../assets/data/GameState";
import { deleteUser } from "../api/users";
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
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  fitnessLocation: FitnessLocation | null;
}

export const MiscellaneousScreen = memo(({setScreen, user, speed, gameState, setGameState, fitnessLocation}: MiscellaneousScreenProps) => {
  const [showDeleteDataModal, setShowDeleteDataModal] = useState<boolean>(false)

  const deleteData = () => {
    setGameState(INITIAL_GAME_STATE)
    if (user) {
      deleteUser(user.id);
    }
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
      stepProgressHistory: prevGameState.stepProgressHistory,
    }))
  }

  const addMultiplier = () => {
    setGameState(prevGameState => ({
      ...prevGameState,
      permanentMultiplier: prevGameState.permanentMultiplier * 3,
    }))
  }

  const addTicks = () => {
    setGameState(prevGameState => ({
      ...prevGameState,
      ticks: prevGameState.ticks + 1e+6,
    }))
  }

  const permanentMultiplierCount = Math.round(Math.log(gameState.permanentMultiplier) / Math.log(3));

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
            <Text>{permanentMultiplierCount}</Text>
            <Button text={'Add x3 Multiplier'} onPress={addMultiplier}/>
            <Button text={'Add ticks'} onPress={addTicks}/>

          </Center>
        }
        <Center>
          <Button text={'Delete Data'} style={{backgroundColor: 'red'}} onPress={() => setShowDeleteDataModal(true)}/>
        </Center>
      </View>

      <BottomBar screen={Screen.Miscellaneous} setScreen={setScreen}/>

      <ConfirmationModal
        visible={showDeleteDataModal}
        setVisible={setShowDeleteDataModal}
        title={'Confirm Deletion'}
        body={'Are you sure you want to delete all data and progress?'}
        onConfirm={() => {
          deleteData()
        }}
        onCancel={() => {}}
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