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
import colors from "../../assets/colors/colors";
import { playSound, SoundFile } from "../util/sounds";

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
  const [x0, setX0] = useState<number>(0)
  const [y0, setY0] = useState<number>(0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

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
  const memoizedSpawnProjectiles = useCallback(spawnProjectiles, [x0, y0, projectiles])

  function startGenerator() {
    if (!ownsSome || generatorState.isManuallyOperating) {
      return
    }

    const generatorStateById = gameState.generatorStateById.set(generator.id, {
      ...generatorState,
      isManuallyOperating: true,
    })
    setGameState(prevGameState => ({ ...prevGameState, generatorStateById: generatorStateById, }))

    playSound(SoundFile.MenuSelectionClick)
  }

  const hasOverlay = !ownsSome || (!generatorState.isManuallyOperating && !generatorState.hasManager)

  return (
    <View>
      <View style={styles.generatorWrapper} onLayout={setX0AndY0}>
        <Pressable style={styles.generatorLeftWrapper} onPress={startGenerator}>
          <GeneratorIcon image={generator.image} hasOverlay={hasOverlay} />
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
            onClick={memoizedSpawnProjectiles}
          />
        </Pressable>
      </View>
      {projectiles}
    </View>

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
})