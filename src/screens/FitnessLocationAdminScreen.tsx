import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GameState } from "../../assets/data/GameState";
import { BackgroundImage } from "../components/BackgroundImage";
import { BottomBar } from "../components/BottomBar";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { SERVER_URL } from "../config";
import Screen from "../enums/Screen";
import { FitnessLocation } from "../../../fitness-incremental-shared/src/fitness-location.interface"
import colors from "../../assets/colors/colors";

interface FitnessLocationAdminScreen {
  setScreen: (screen: Screen) => void;
  setGameState: (gameState: GameState) => void;
}

export const FitnessLocationAdminScreen = ({setScreen, setGameState}: FitnessLocationAdminScreen) => {
  const [fitnessLocations, setFitnessLocations] = useState<FitnessLocation[]>([])

  const getAndSetFitnessLocations = async () => {
    await fetch(`${SERVER_URL}/fitness-locations/isVerified/null`)
      .then(res => res.json())
      .then(res => {
        setFitnessLocations(res.data)
      })
  }

  const judgeFitnessLocation = async (userId: string, isVerified: boolean) => {
    await fetch(`${SERVER_URL}/fitness-locations/${userId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isVerified: isVerified,
      }),
    }).then(res => {
      const remainingFitnessLocations = fitnessLocations.filter(fitnessLocation => fitnessLocation.userId !== userId)
      setFitnessLocations(remainingFitnessLocations)
    })
  }

  useEffect(() => {
    getAndSetFitnessLocations()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>

      <View style={styles.screenWrapper}>
        <Header title={'Fitness Locations'}/>

        <Button text={'Refresh'} onPress={getAndSetFitnessLocations} style={styles.refreshButton}/>

        { fitnessLocations.map(fitnessLocation => (
          <View key={fitnessLocation.userId}>
            <Text>{fitnessLocation.userId}</Text>
            <Image
              source={{ uri: fitnessLocation.imageUri }}
              style={styles.image}
            />
            <View style={styles.buttonGroup}>
              <Button onPress={() => {judgeFitnessLocation(fitnessLocation.userId, false)}} text={'Fail'} style={styles.failButton}/>
              <Button onPress={() => {judgeFitnessLocation(fitnessLocation.userId, true)}} text={'Pass'} style={styles.passButton}/>
            </View>
          </View>
        ))}

      </View>

      <BottomBar screen={Screen.Miscellaneous} setScreen={setScreen}/>
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
  image: {
    width: 400,
    height: 400,
  },
  refreshButton: {
    backgroundColor: colors.blue2
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  passButton: {
    backgroundColor: colors.green3,
    flex: 1,
  },
  failButton: {
    backgroundColor: 'red',
    flex: 1,
  }
})