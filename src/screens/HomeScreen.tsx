import React, { useEffect, useState } from "react";
import { View, SafeAreaView } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { ScrollView } from "react-native-gesture-handler";
import { CURRENCY_GENERATORS } from "../../assets/data/CurrencyGenerators";
import { GameState } from "../../assets/data/GameState";
import BuyAmount from "../enums/BuyAmount";
import { calculateMaxBuy, calculateOneTickRevenue, calculatePrice } from "../math";
import useInterval from "../util/useInterval";
import { Map } from 'immutable';
import { TopBar } from "../components/TopBar";
import { GeneratorList } from "../components/GeneratorList";
import { BottomBar } from "../components/BottomBar";
import { Menu } from "../components/Menu";
import { BackgroundImage } from "../components/BackgroundImage";
import Screen from "../enums/Screen";

interface HomeScreenProps {
  setScreen: (screen: Screen) => void;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

export const HomeScreen = ({setScreen, gameState, setGameState}: HomeScreenProps) => {
  console.log('HomeScreen render')

  const [isMenuShown, setIsMenuShown] = useState<boolean>(false);
  const [buyAmount, setBuyAmount] = useState<BuyAmount>(BuyAmount.One);
  const [priceOf1ByGeneratorId, setPriceOf1ByGeneratorId] = useState<Map<number,number>>(Map());
  const [priceOf10ByGeneratorId, setPriceOf10ByGeneratorId] = useState<Map<number,number>>(Map());
  const [priceOf100ByGeneratorId, setPriceOf100ByGeneratorId] = useState<Map<number,number>>(Map());
  const [priceOfMaxByGeneratorId, setPriceOfMaxByGeneratorId] = useState<Map<number,number>>(Map());
  const [maxBuyByGeneratorId, setMaxBuyByGeneratorId] = useState<Map<number,number>>(Map());
  const [priceByGeneratorId, setPriceByGeneratorId] = useState<Map<number,number>>(Map());

  useEffect(() => {
    console.log('Calculate max buy for each generator')

    let priceOfMaxByGeneratorId = Map<number, number>();
    let maxBuyByGeneratorId = Map<number,number>();

    CURRENCY_GENERATORS.forEach(generator => {
      const generatorState = gameState.generatorStateById.get(generator.id)!;
      const maxBuy = calculateMaxBuy(gameState.balance, generator.initialPrice, generator.growthRate, generatorState.owned);
      maxBuyByGeneratorId = maxBuyByGeneratorId.set(generator.id, maxBuy);
      priceOfMaxByGeneratorId = priceOfMaxByGeneratorId.set(generator.id, calculatePrice(maxBuy, generator.initialPrice, generator.growthRate, generatorState.owned))
    });

    setMaxBuyByGeneratorId(maxBuyByGeneratorId);
    setPriceOfMaxByGeneratorId(priceOfMaxByGeneratorId);
  }, [gameState.balance])

  useEffect(() => {
    console.log('Calculate x1, x10, x100 prices for each generator')

    let priceOf1ByGeneratorId = Map<number, number>();
    let priceOf10ByGeneratorId = Map<number, number>();
    let priceOf100ByGeneratorId = Map<number, number>();

    CURRENCY_GENERATORS.forEach(generator => {
      const generatorState = gameState.generatorStateById.get(generator.id)!;
      priceOf1ByGeneratorId = priceOf1ByGeneratorId.set(generator.id, calculatePrice(1, generator.initialPrice, generator.growthRate, generatorState.owned));
      priceOf10ByGeneratorId = priceOf10ByGeneratorId.set(generator.id, calculatePrice(10, generator.initialPrice, generator.growthRate, generatorState.owned));
      priceOf100ByGeneratorId = priceOf100ByGeneratorId.set(generator.id, calculatePrice(100, generator.initialPrice, generator.growthRate, generatorState.owned));
    })

    setPriceOf1ByGeneratorId(priceOf1ByGeneratorId);
    setPriceOf10ByGeneratorId(priceOf10ByGeneratorId);
    setPriceOf100ByGeneratorId(priceOf100ByGeneratorId);

  }, [JSON.stringify(Array.from(gameState.generatorStateById.values()).map(generatorState => generatorState.owned))])

  useEffect(() => {
    console.log('Display x1, x10, x100, or MAX prices');

    if (buyAmount === BuyAmount.One) {
      setPriceByGeneratorId(priceOf1ByGeneratorId);
    } else if (buyAmount === BuyAmount.Ten) {
      setPriceByGeneratorId(priceOf10ByGeneratorId);
    } else if (buyAmount === BuyAmount.Hundred) {
      setPriceByGeneratorId(priceOf100ByGeneratorId);
    } else if (buyAmount === BuyAmount.Max) {
      setPriceByGeneratorId(priceOfMaxByGeneratorId);
    }
  }, [
    buyAmount,
    priceOf1ByGeneratorId,
    priceOf10ByGeneratorId,
    priceOf100ByGeneratorId,
    priceOfMaxByGeneratorId,
  ])

  useInterval(() => {
    const revenue = calculateOneTickRevenue(CURRENCY_GENERATORS, gameState.generatorStateById);
    console.log('Revenue this tick: ', revenue);
    setGameState({
      ...gameState,
      balance: gameState.balance + revenue,
    })
  }, 1000)

  return (
    <SafeAreaView style={styles.container}>

        <BackgroundImage/>

        <ScrollView
          contentInsetAdjustmentBehavior='automatic'
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
        >
          <GeneratorList
            gameState={gameState}
            setGameState={setGameState}
            priceByGeneratorId={priceByGeneratorId}
            maxBuyByGeneratorId={maxBuyByGeneratorId}
            buyAmount={buyAmount}
          />
          <View style={{height: 150}}/>
        </ScrollView>

        <TopBar
          balance={gameState.balance}
          buyAmount={buyAmount}
          setBuyAmount={setBuyAmount}
        />
        <View style={{flex: 1}}/>
        { isMenuShown && <Menu setIsMenuShown={setIsMenuShown} setScreen={setScreen}/>}
        <BottomBar setScreen={setScreen}/>

    </SafeAreaView>

  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 90,
  },
});
