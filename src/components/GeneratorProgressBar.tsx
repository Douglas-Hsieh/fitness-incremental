import React from "react"
import { CurrencyGenerator } from "../../assets/data/CurrencyGenerators"
import { GeneratorState } from "../../assets/data/GeneratorState"
import { ProgressBar } from "./ProgressBar"

interface GeneratorProgressBarProps {
  generator: CurrencyGenerator;
  generatorState: GeneratorState;
}

export const GeneratorProgressBar = ({generator, generatorState}: GeneratorProgressBarProps) => {
  // Calculate progress
  const progress = generatorState.ticks / generator.initialTicks
  const text = `${(progress * 100).toFixed(2)}%`

  return (
    <ProgressBar
      progress={progress}
      text={text}
      containerClassnames={'h-9'}
      progressBarBackgroundClassnames={'bg-white'}
      progressBarClassnames={'bg-green-400'}
      textClassnames={'text-black'}
    />
  )
}