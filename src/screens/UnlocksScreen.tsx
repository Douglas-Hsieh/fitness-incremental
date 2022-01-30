import { Map } from "immutable"
import React from "react"
import { Image, SafeAreaView, Text, View } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { ScrollView } from "react-native-gesture-handler"
import colors from "../../assets/colors/colors"
import { GENERATORS_BY_ID } from "../../assets/data/Generators"
import { GameState } from "../../assets/data/GameState"
import { GeneratorState } from "../../assets/data/GeneratorState"
import { GeneratorUnlock, getNextUnlock } from "../../assets/data/GeneratorUnlocks"
import { BackgroundImage } from "../components/BackgroundImage"
import { BottomBar } from "../components/BottomBar"
import { Description } from "../components/Description"
import { Header } from "../components/Header"
import Screen from "../enums/Screen"

interface UnlockCardListProps {
  generatorStateById: Map<string, GeneratorState>;
}

const UnlockCardList = ({generatorStateById}: UnlockCardListProps) => {

  let unlocks = Array.from(generatorStateById.entries())
    .map(([generatorId, generatorState]) => getNextUnlock(generatorId, generatorState.owned))

  const allGeneratorsMin = Array.from(generatorStateById.values())
    .map(generatorState => generatorState.owned)
    .reduce((owned1, owned2) => Math.min(owned1, owned2))
  unlocks.push(getNextUnlock('0', allGeneratorsMin))

  const nextUnlocks = unlocks.filter(unlock => unlock) as GeneratorUnlock[]

  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior='automatic'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.cardList}
    >
      {nextUnlocks.map(unlock => {
        let key;
        let image;
        let generatorName;

        if (unlock.generatorId === '0') {
          key = 0,
          image = require('../../assets/images/everyone.png')
          generatorName = 'Everyone'
        } else {
          const generator = GENERATORS_BY_ID.get(unlock.generatorId)!
          key = generator.id
          image = generator.image
          generatorName = generator.name
        }

        return (
          <UnlockCard
            key={key}
            image={image}
            generatorName={generatorName}
            count={unlock.count}
            multiplier={unlock.multiplier}
          />
        )
      })}

    </ScrollView>
  )
}

interface UnlockCardProps {
  image: any;
  generatorName: string;
  count: number;
  multiplier: number;
}

const UnlockCard = ({image, generatorName, count, multiplier}: UnlockCardProps) => (
  <View style={styles.cardContainer1}>
    <View style={styles.cardContainer2}>
      <Image source={image} style={styles.icon}/>
      <Text style={styles.countText}>{count}</Text> 
      <Text style={styles.generatorNameText}>{generatorName}</Text>
      <Text style={styles.multiplierText}>x{multiplier}</Text> 
    </View>
  </View>
)

interface UnlocksScreenProps {
  setScreen: (screen: Screen) => void;
  gameState: GameState;
}

export const UnlocksScreen = ({setScreen, gameState}: UnlocksScreenProps) => {

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage/>
      <View style={styles.backgroundOverlay}/>
      <View style={styles.unlocksWrapper}>
        <Header title={'Milestones'}/>
        <Description
          title={'You are closer than you were yesterday.'}
          body={'Hit these milestones to unlock amazing bonuses!'}
        />

        <UnlockCardList generatorStateById={gameState.generatorStateById}/>

      </View>
      <BottomBar screen={Screen.Unlocks} setScreen={setScreen}/>
    </SafeAreaView>
  )

}

const styles = EStyleSheet.create({

  container: {
    flex: 1,
  },
  backgroundOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    opacity: .6,
  },
  unlocksWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  // card
  scroll: {
    marginTop: '3%',
    width: '100%',  // don't change this
  },
  cardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  cardContainer1: {
    width: '6.5rem',
    height: '9rem',
    backgroundColor: colors.orange3,
    marginVertical: '1%',
    marginHorizontal: '.5%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer2: {
    width: '98%',
    height: '98%',
    backgroundColor: colors.white,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  icon: {
    width: '3rem',
    height: '3rem',
  },
  countText: {
    fontFamily: 'oleo-script-bold',
    fontSize: '1.25rem',
    color: colors.orange2,
  },
  generatorNameText: {
    fontFamily: 'oleo-script',
    fontSize: '.8rem',
  },
  multiplierText: {
    fontFamily: 'oleo-script',
    fontSize: '1rem',
  }

})