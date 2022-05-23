import React, { useCallback, useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import { Generator } from "../../assets/data/Generators";
import { GameState } from "../../assets/data/GameState";
import { UnlockProgressBar } from "./UnlockProgressBar";
import { GeneratorProgressBar } from "./GeneratorProgressBar";
import { GeneratorIcon } from "./GeneratorIcon";
import { BuyGeneratorButton } from "./BuyGeneratorButton";
import { GeneratorState } from "../../assets/data/GeneratorState";
import { Projectile } from "./Projectile";
import EStyleSheet from "react-native-extended-stylesheet";
import { playSound, SoundFile } from "../util/sounds";
import { HighlightableElement } from 'react-native-highlight-overlay';
import { TutorialState } from "../../assets/data/TutorialState";
import { HIGHLIGHTABLE_RECTANGLE_OPTIONS } from "../../assets/data/Constants";
import { StepsImage, TicksImage } from "./TopBar";

interface GeneratorComponentProps {
  generator: Generator;
  generatorState: GeneratorState;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  price: number;
  amount: number;
  isDisabled: boolean;
  ticksNeeded: number;
  isGold: boolean;
  ownsSome: boolean;
}

export const GeneratorComponent = ({ generator, generatorState, gameState, setGameState, price, amount, isDisabled, ticksNeeded, isGold, ownsSome }: GeneratorComponentProps) => {
  const [projectiles, setProjectiles] = useState<JSX.Element[]>([])
  const [buyButtonX0, setBuyButtonX0] = useState<number>(0)
  const [buyButtonY0, setBuyButtonY0] = useState<number>(0)
  const [iconX0, setIconX0] = useState<number>(0)
  const [iconY0, setIconY0] = useState<number>(0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  function setLayout(event: LayoutChangeEvent, setX0: React.Dispatch<React.SetStateAction<number>>, setY0: React.Dispatch<React.SetStateAction<number>>) {
    const {x, y, width, height} = event.nativeEvent.layout;
    setX0(x + (width / 2))
    setY0(y + (height / 2))
  }
  function setBuyButtonLayout(event: LayoutChangeEvent) {
    setLayout(event, setBuyButtonX0, setBuyButtonY0)
  }
  function setIconLayout(event: LayoutChangeEvent) {
    setLayout(event, setIconX0, setIconY0)
  }

  function spawnProjectiles(x0: number, y0: number, image: JSX.Element) {
    const newProjectile = <Projectile x0={x0} y0={y0} image={image}/>
    setProjectiles([...projectiles].concat(new Array(4).fill(newProjectile)))
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    const newTimeoutId = setTimeout(() => {
      setProjectiles([])
    }, 5000)
    setTimeoutId(newTimeoutId)
  }
  
  const memoizedSpawnProjectiles = useCallback((x0: number, y0: number, image: JSX.Element) => spawnProjectiles(x0, y0, image), [buyButtonX0, buyButtonY0, projectiles])
  const spawnCash = () => memoizedSpawnProjectiles(buyButtonX0, buyButtonY0, <StepsImage/>)
  const spawnTicks = () => memoizedSpawnProjectiles(iconX0, iconY0, <TicksImage/>)

  function completeTutorial(key: keyof TutorialState) {
    setGameState(prevGameState => ({
      ...prevGameState,
      tutorialState: {
        ...prevGameState.tutorialState,
        [key]: {
          ...prevGameState.tutorialState[key],
          isCompleted: true,
        }
      }
    }))
  }

  function startGenerator() {
    if (!ownsSome || generatorState.isManuallyOperating || generatorState.hasManager) {
      return
    }

    const generatorStateById = gameState.generatorStateById.set(generator.id, {
      ...generatorState,
      isManuallyOperating: true,
    })

    // Complete tutorial
    if (generator.id === '1' && !gameState.tutorialState.firstGenerator1.isCompleted) {
      completeTutorial("firstGenerator1")
    }
    setGameState(prevGameState => ({ ...prevGameState, generatorStateById: generatorStateById, }))

    playSound(SoundFile.MenuSelectionClick)
    spawnTicks()
  }

  const isOperating = generatorState.isManuallyOperating || generatorState.hasManager;

  return (
    <HighlightableElement id={`generator-${generator.id}`} options={HIGHLIGHTABLE_RECTANGLE_OPTIONS}>
      <View style={styles.generatorWrapper} onLayout={setBuyButtonLayout}>
        <Pressable style={styles.generatorLeftWrapper} onPress={startGenerator} onLayout={setIconLayout}>
          <GeneratorIcon image={generator.image} ownsSome={ownsSome} isOperating={isOperating}/>
          <UnlockProgressBar generator={generator} owned={generatorState.owned} />
        </Pressable>
        <Pressable style={styles.generatorRightWrapper} onPress={startGenerator}>
          {ownsSome &&
            <GeneratorProgressBar generator={generator} gameState={gameState} ticksNeeded={ticksNeeded} isGold={isGold} />
          }
          <BuyGeneratorButton
            setGameState={setGameState}
            generator={generator}
            price={price}
            amount={amount}
            isDisabled={isDisabled}
            isLarge={!ownsSome}
            onClick={spawnCash}
          />
        </Pressable>
      </View>
      {projectiles}
    </HighlightableElement>

  );
};

const styles = EStyleSheet.create({
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
})