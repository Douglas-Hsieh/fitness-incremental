import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GENERATORS } from "../../assets/data/Generators";
import { GameState } from "../../assets/data/GameState";
import BuyAmount from "../enums/BuyAmount";
import { calculateUnlocksFromGenerators } from "../math/unlocks";
import { calculateMaxBuy, calculatePrice } from "../math/prices";
import { Map } from 'immutable';
import { TopBar } from "../components/TopBar";
import { GeneratorList } from "../components/GeneratorList";
import { BottomBar } from "../components/BottomBar";
import { Background } from "../components/BackgroundImage";
import Screen from "../enums/Screen";
import { Set } from 'immutable'
import { GeneratorUnlock, GENERATOR_UNLOCKS_BY_ID, getUnlockId } from "../../assets/data/GeneratorUnlocks";
import { UnlockModal } from "../components/UnlockModal";
import { LocationObject } from "expo-location";
import { HighlightOverlay } from 'react-native-highlight-overlay';

interface HomeScreenProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  buyAmount: BuyAmount;
  setBuyAmount: React.Dispatch<React.SetStateAction<BuyAmount>>;
  temporaryMultiplier: number;
  stepsToday: number;
  currentLocation: LocationObject | undefined;
  generatorsHighlightId: string | null;
  showDialogue: (text: string) => void;
}

export const HomeScreen = ({setScreen, gameState, setGameState, buyAmount, setBuyAmount, temporaryMultiplier, generatorsHighlightId, showDialogue}: HomeScreenProps) => {
  const [maxBuyByGeneratorId, setMaxBuyByGeneratorId] = useState<Map<string,number>>(Map());
  const [priceByGeneratorId, setPriceByGeneratorId] = useState<Map<string,number>>(Map());
  const [newUnlocks, setNewUnlocks] = useState<Set<GeneratorUnlock>>(Set())

  useEffect(() => {
    // console.log('Calculate max buy for each generator')
    if (buyAmount !== BuyAmount.Max) {
      return
    }

    const maxBuyByGeneratorId = Map<string,number>().withMutations(maxBuyByGenId => {
      GENERATORS.forEach(generator => {
        const generatorState = gameState.generatorStateById.get(generator.id)!;
        const maxBuy = calculateMaxBuy(gameState.balance, generator.initialPrice, generator.growthRate, generatorState.owned);
        maxBuyByGenId.set(generator.id, maxBuy)
      })
    })

    const priceOfMaxByGeneratorId = Map<string, number>().withMutations(priceOfMaxByGenId => {
      GENERATORS.forEach(generator => {
        const generatorState = gameState.generatorStateById.get(generator.id)!;
        const maxBuy = maxBuyByGeneratorId.get(generator.id)!
        priceOfMaxByGenId.set(generator.id, calculatePrice(maxBuy, generator.initialPrice, generator.growthRate, generatorState.owned))
      })
    })

    setMaxBuyByGeneratorId(maxBuyByGeneratorId);
    setPriceByGeneratorId(priceOfMaxByGeneratorId)
  }, [buyAmount, gameState.balance])

  useEffect(() => {
    // console.log(`Calculating prices for buying ${buyAmount}`)

    if (buyAmount === BuyAmount.Max) {
      return
    }

    const priceByGeneratorId = Map<string, number>().withMutations(priceByGenId => {
      GENERATORS.forEach(generator => {
        const generatorState = gameState.generatorStateById.get(generator.id)!
        priceByGenId.set(generator.id, calculatePrice(buyAmount, generator.initialPrice, generator.growthRate, generatorState.owned))
      })
    })
    setPriceByGeneratorId(priceByGeneratorId)

  }, [buyAmount, JSON.stringify(Array.from(gameState.generatorStateById.values()).map(generatorState => generatorState.owned))])

  useEffect(() => {
    // console.log('Calculate unlocks')

    const oldUnlockIds = gameState.unlockIds
    const unlocks = calculateUnlocksFromGenerators(gameState.generatorStateById)
    const unlockIds = Set(unlocks.map(unlock => getUnlockId(unlock)))
    setGameState(prevGameState => ({
      ...prevGameState,
      unlockIds: unlockIds,
    }))

    const newUnlockIds = Set([...unlockIds].filter(unlockId => !oldUnlockIds.has(unlockId)))
    if (newUnlockIds.size > 0) {
      const newUnlocks = newUnlockIds.map(newUnlockId => GENERATOR_UNLOCKS_BY_ID.get(newUnlockId)!) 
      setNewUnlocks(newUnlocks)
    }
  }, [JSON.stringify(Array.from(gameState.generatorStateById.values()).map(generatorState => generatorState.owned))])

  useEffect(() => {
    if (gameState.ticks <= 0) {
      showDialogue('Your followers ran out of motivation and gave up :(\n\nMove around to create motivation!')
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>

      <Background/>

      <TopBar
        balance={gameState.balance}
        ticks={gameState.ticks}
        speed={gameState.speed}
        buyAmount={buyAmount}
        setBuyAmount={setBuyAmount}
        temporaryMultiplier={temporaryMultiplier}
      />

      <ScrollView
        contentInsetAdjustmentBehavior='automatic'
        showsVerticalScrollIndicator={false}
      >
        <GeneratorList
          gameState={gameState}
          setGameState={setGameState}
          priceByGeneratorId={priceByGeneratorId}
          maxBuyByGeneratorId={maxBuyByGeneratorId}
          buyAmount={buyAmount}
          temporaryMultiplier={temporaryMultiplier}
        />
      </ScrollView>
      <HighlightOverlay
        highlightedElementId={generatorsHighlightId}
        onDismiss={() => {}}
      />
      <BottomBar screen={Screen.Home} setScreen={setScreen}/>
      
      { newUnlocks.map(newUnlock => 
        <UnlockModal
          key={`${newUnlock.generatorId}-${newUnlock.count}`}
          unlock={newUnlock}
        />
      )}

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
