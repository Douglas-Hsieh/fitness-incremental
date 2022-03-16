import React, { memo, useEffect, useState } from "react";
import { Dimensions, LayoutChangeEvent, SafeAreaView, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DEBUG_GAME_STATE, GameState, INITIAL_GAME_STATE } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Button } from "../components/Button";
import Center from "../components/Center";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Header } from "../components/Header";
import { Projectile } from "../components/Projectile";
import Screen from "../enums/Screen";
import { User } from "../shared/users.interface";

interface MiscellaneousScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  user: User | undefined;
  speed: number;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const MiscellaneousScreen = memo(({setScreen, user, speed, setGameState}: MiscellaneousScreenProps) => {
  const [showDeleteDataModal, setShowDeleteDataModal] = useState<boolean>(false)

  const [projectiles, setProjectiles] = useState<JSX.Element[]>([])
  const [x0, setX0] = useState<number>(0)
  const [y0, setY0] = useState<number>(0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

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
      fitnessLocation: prevGameState.fitnessLocation,
      visitHistory: prevGameState.visitHistory,
    }))
  }

  function setX0AndY0(event: LayoutChangeEvent) {
    const {x, y, width, height} = event.nativeEvent.layout;
    setX0(x + (width / 2))
    setY0(y + (height / 2))
  }

  function spawnProjectiles() {
    const newProjectile = <Projectile x0={x0} y0={y0}/>
    setProjectiles([...projectiles].concat(new Array(4).fill(newProjectile)))
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    const newTimeoutId = setTimeout(() => {
      setProjectiles([])
    }, 5000)
    setTimeoutId(newTimeoutId)
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>

      <View style={styles.screenWrapper}>
        <Header title={'Miscellaneous'}/>
        { user && user.roles.includes('ROLE_ADMIN') &&
          <Center>
            <Button text={'Fitness Locations'} onPress={() => setScreen(Screen.FitnessLocationAdmin)}/>
            <Button text={`Speed x${speed}`} onPress={toggleSpeed}/>
            <Button text={'Debug GameState'} onPress={debug}/>
            <Button text={'Spawn Projectile'} onPress={spawnProjectiles} onLayout={setX0AndY0}/>
            <Button text={'Does Nothing'}/>
            { projectiles }
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