import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../../assets/colors/colors";
import { CURRENCY_GENERATORS } from "../../assets/data/CurrencyGenerators";
import { GameState, GeneratorState, INITIAL_GAME_STATE } from "../../assets/data/GameState";
import BuyAmount from "../enums/BuyAmount";
import { calculateMaxBuy, calculatePrice, numberToHumanFormat } from "../math";
import useInterval from "../util/useInterval";
import { Map } from 'immutable';

export const HomeScreen = (props: {navigation: any}) => {

  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isMenuShown, setIsMenuShown] = useState<boolean>(false);
  const [buyAmount, setBuyAmount] = useState<BuyAmount>(BuyAmount.One);

  const [priceOf1ByGeneratorId, setPriceOf1ByGeneratorId] = useState<Map<number,number>>(Map());
  const [priceOf10ByGeneratorId, setPriceOf10ByGeneratorId] = useState<Map<number,number>>(Map());
  const [priceOf100ByGeneratorId, setPriceOf100ByGeneratorId] = useState<Map<number,number>>(Map());
  const [priceOfMaxByGeneratorId, setPriceOfMaxByGeneratorId] = useState<Map<number,number>>(Map());
  const [maxBuyByGeneratorId, setMaxBuyByGeneratorId] = useState<Map<number,number>>(Map());
  const [priceByGeneratorId, setPriceByGeneratorId] = useState<Map<number,number>>(priceOf1ByGeneratorId);


  useEffect(() => {
    // Calculate max buy for each generator
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
    // Calculate x1, x10, x100 prices for each generator

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

    // TODO: Test
    console.log('generator owned changes')
  }, [JSON.stringify(Array.from(gameState.generatorStateById.values()).map(generatorState => generatorState.owned))])

  useEffect(() => {
    if (buyAmount === BuyAmount.One) {
      setPriceByGeneratorId(priceOf1ByGeneratorId);
    } else if (buyAmount === BuyAmount.Ten) {
      setPriceByGeneratorId(priceOf10ByGeneratorId);
    } else if (buyAmount === BuyAmount.Hundred) {
      setPriceByGeneratorId(priceOf100ByGeneratorId);
    } else if (buyAmount === BuyAmount.Max) {
      setPriceByGeneratorId(priceOfMaxByGeneratorId);
    }
  }, [buyAmount])

  const toggleBuyAmount = () => {
    if (buyAmount === BuyAmount.One) setBuyAmount(BuyAmount.Ten);
    else if (buyAmount === BuyAmount.Ten) setBuyAmount(BuyAmount.Hundred);
    else if (buyAmount === BuyAmount.Hundred) setBuyAmount(BuyAmount.Max);
    else setBuyAmount(BuyAmount.One);
  }

  // TODO: Test
  const buyGenerator = (generatorId: number, amount: number) => {
    const generator = CURRENCY_GENERATORS[generatorId - 1];
    const generatorState = gameState.generatorStateById.get(generatorId)!;
    const price = calculatePrice(amount, generator.initialPrice, generator.growthRate, generatorState.owned);

    if (price <= gameState.balance) {
      const generatorStateById = gameState.generatorStateById;
      const generatorState = generatorStateById.get(generatorId);
      generatorState!.owned = generatorState!.owned + amount;
      gameState.generatorStateById.set(generatorId, generatorState!);

      setGameState({
        ...gameState,
        balance: gameState.balance - price,
        generatorStateById: generatorStateById,
      })
    }
  }

  // Components
  const TopBar = () => {
    const [coefficient, scale] = numberToHumanFormat(gameState.balance);

    return (
    <View style={styles.topBar}>
      <View style={styles.overlay}/>
      <Image source={require('../../assets/images/male-avatar.png')} style={styles.avatar}/>
      <Image source={require('../../assets/images/steps.png')} style={styles.steps}/>
      <View style={styles.stepsCountWrapper}>
        <Text style={styles.stepsCountText}>{coefficient}</Text>
        <Text style={styles.stepsScaleText}>{scale}</Text>
      </View>
      <TouchableOpacity style={styles.buyAmountButton} activeOpacity={.8} onPress={toggleBuyAmount}>
        <Text style={styles.buyAmountBuyText}>Buy</Text>
        <Text style={styles.buyAmountAmountText}>{buyAmount}</Text>
      </TouchableOpacity>
    </View>
  )}

  const GeneratorIcon = (props: {image: any}) => (
    <View style={styles.iconContainer1}>
      <View style={styles.iconContainer2}>
        <View style={styles.iconContainer3}>
          <Image source={props.image} style={styles.icon}/>
        </View>
      </View>
    </View>
  )

  const GeneratorProgressBar = (props: {generatorState: GeneratorState, progress: number}) => (
    <View style={styles.generatorProgressBarContainer}>
      <View style={[
        styles.generatorProgressBar,
        {width: props.progress * styles.generatorProgressBar.width},
      ]}>
      </View>
      <Text style={styles.generatorProgressBarText}>{props.generatorState.owned}</Text>
    </View>
  )

  const StepProgressBar = (props: {progress: number}) => (
    <View style={styles.stepProgressBarWrapper}>
      <View style={styles.stepProgressBarContainer1}>
        <View style={styles.stepProgressBarContainer2}>
          <View style={styles.stepProgressBarContainer3}>
            <View style={[
              styles.stepProgressBar,
              {width: props.progress * styles.stepProgressBar.width},
            ]}/>
          </View>
        </View>
      </View>
      <Text style={styles.stepProgressBarText}>6440.00 / step</Text>
    </View>
  )

  const BuyGeneratorButton = (props: {price: number, maxBuy: number}) => {
    const [coefficient, scale] = numberToHumanFormat(props.price)

    let buyAmountText = buyAmount.toString();
    if (buyAmount === BuyAmount.Max) {
      buyAmountText = `x${props.maxBuy}`;
    }

    return (
    <TouchableOpacity activeOpacity={.8}>
      <View style={styles.buyGeneratorButton1}>
        <View style={styles.buyGeneratorButton2}>
          <View style={styles.buyGeneratorBuyAmountWrapper}>
            <Text style={styles.buyGeneratorBuyText}>Buy</Text>
            <Text style={styles.buyGeneratorAmountText}>{buyAmountText}</Text>
          </View>
          <View style={styles.buyGeneratorPriceWrapper}>
            <Text style={styles.buyGeneratorPriceText}>{coefficient}</Text>
            <Text style={styles.buyGeneratorPriceScaleText}>{scale}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )}

  const BottomBar = () => (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarOverlay}/>
      <TouchableOpacity onPress={() => { setIsMenuShown(!isMenuShown) }}>
        <Feather name='menu' size={50} color={'white'} style={styles.menuIcon}/>
      </TouchableOpacity>
    </View>
  )

  const Menu = () => (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.menuOverlay} activeOpacity={.5} onPress={() => setIsMenuShown(false)}/>

      <TouchableOpacity style={styles.menuItem} activeOpacity={.9} onPress={() => props.navigation.navigate('Upgrades')}>
        <Text style={styles.menuItemText}>Upgrades</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} activeOpacity={.9}>
        <Text style={styles.menuItemText}>Unlocks</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} activeOpacity={.9}>
        <Text style={styles.menuItemText}>Trainers</Text>
      </TouchableOpacity>
    </View>
  )
  

  return (
    <SafeAreaView style={styles.container}>

        <Image source={require('../../assets/images/background.png')} style={styles.backgroundImage}/>

        <ScrollView
          contentInsetAdjustmentBehavior='automatic'
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
        >
          <View style={styles.generatorListWrapper}>
            {CURRENCY_GENERATORS.map(generator => 
              <View key={generator.id} style={styles.generatorWrapper}>
                <View style={styles.generatorLeftWrapper}>
                  <GeneratorIcon image={generator.image}/>
                  <GeneratorProgressBar generatorState={gameState.generatorStateById.get(generator.id)!} progress={1}/>
                </View>
                <View style={styles.generatorRightWrapper}>
                  <StepProgressBar progress={1}/>
                  <BuyGeneratorButton price={priceByGeneratorId.get(generator.id)!} maxBuy={maxBuyByGeneratorId.get(generator.id)!}/>
                </View>
              </View>
            )}
          </View>
          <View style={{height: 150}}/>
        </ScrollView>

        <TopBar/>
        <View style={{flex: 1}}/>
        { isMenuShown && <Menu/>}
        <BottomBar/>


    </SafeAreaView>

  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: 2000,
    height: 2000,
  },

  // Top Bar
  topBar: {
    flex: .15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    opacity: .75,
    position: 'absolute',
  },
  avatar: {
    width: 64,
    height: 64,
    marginLeft: '5%',
  },
  steps: {
    width: 25,
    height: 25,
    marginLeft: 25,
  },
  stepsCountWrapper: {
    marginLeft: 10,
    alignItems: 'center',
  },
  stepsCountText: {
    fontSize: 20,
  },
  stepsScaleText: {
  },
  buyAmountButton: {
    marginLeft: 130,
    width: 70,
    height: 50,
    backgroundColor: colors.orange2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyAmountBuyText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'oleo-script'
  },
  buyAmountAmountText: {
    color: colors.white,
    fontFamily: 'oleo-script',
    fontSize: 20,
  },

  scroll: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 90,
  },
  // Generator
  generatorListWrapper: {
    marginLeft: 10,
  },
  generatorWrapper: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  generatorLeftWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  generatorRightWrapper: {
    flexDirection: 'column',
    marginLeft: 10,
  },

  // Icon
  iconContainer1: {
    height: 80,
    width: 80,
    backgroundColor: colors.blue3,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer2: {
    height: '90%',
    width: '90%',
    backgroundColor: colors.blue1,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer3: {
    height: '90%',
    width: '90%',
    backgroundColor: colors.blue2,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '80%',
    width: '80%',
  },

  // Generator Progress Bar
  generatorProgressBarContainer: {
    marginTop: -20,

    width: 90,
    height: 25,
    backgroundColor: colors.blue3,
    borderRadius: 20,
    alignItems: 'center',
  },
  generatorProgressBar: {
    marginTop: 2.5,
    width: 85,
    height: 20,
    backgroundColor: colors.green2,
    borderRadius: 19,
  },
  generatorProgressBarText: {
    marginTop: -20,
    color: colors.white,
    textShadowColor: colors.black,
    textShadowRadius: 5,
  },

  // Step Progress Bar
  stepProgressBarWrapper: {
    alignItems: 'center',
    width: 200,
    height: 35,
  },
  stepProgressBarContainer1: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepProgressBarContainer2: {
    width: '99%',
    height: '95%',
    backgroundColor: colors.green1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepProgressBarContainer3: {
    width: '99%',
    height: '95%',
    backgroundColor: colors.white,
    borderRadius: 100,
  },
  stepProgressBar: {
    width: 196,
    height: '100%',
    backgroundColor: colors.green3,
    borderRadius: 100,
  },
  stepProgressBarText: {
    marginTop: -30,
    color: colors.black,
  },

  // Buy Button
  buyGeneratorButton1: {
    marginTop: 4,
    width: 200,
    height: 40,
    backgroundColor: colors.orange5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyGeneratorButton2: {
    width: '99%',
    height: '95%',
    backgroundColor: colors.orange3,
    borderRadius: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyGeneratorBuyAmountWrapper: {
    alignItems: 'center',
  },
  buyGeneratorBuyText: {
    color: colors.white,
  },
  buyGeneratorAmountText: {
    color: colors.white,
  },
  buyGeneratorPriceWrapper: {
    alignItems: 'center',
  },
  buyGeneratorPriceText: {
    color: colors.white,
    fontSize: 15,
  },
  buyGeneratorPriceScaleText: {
    fontSize: 10,
  },

  // Bottom Bar
  bottomBar: {
    flex: .09,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBarOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
    opacity: .5,
    position: 'absolute',
  },
  menuIcon: {
    color: colors.white,
  },

  // Menu
  menu: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
    opacity: .5,
  },
  menuItems: {
    alignItems: 'center',
  },
  menuItem: {
    marginTop: '10%',
    width: '50%',
    height: '10%',
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontFamily: 'oleo-script',
    fontSize: 30,
    color: colors.gray5,
  },



});
