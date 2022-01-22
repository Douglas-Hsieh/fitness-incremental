import { GENERATORS_BY_ID } from "../../assets/data/Generators"
import { GameState } from "../../assets/data/GameState"
import { calculateGeneratorRevenue } from "./revenue"

export const calculateTicksToUse = (ticksRemaining: number): number => {
  if (ticksRemaining <= 0) {
    return 0
  } else if (ticksRemaining < 25000) {
    return .25
  } else if (ticksRemaining < 50000) {
    return .5
  } else if (ticksRemaining < 100000) {
    return 1
  } else if (ticksRemaining < 150000) {
    return 2
  } else if (ticksRemaining < 200000) {
    return 3
  } else {
    return 4
  }
}

export const progressGenerators = (
  gameState: GameState,
  ticksToUse: number,
) => {
  let revenue = 0
  const generatorStateById = gameState.generatorStateById.withMutations(genStateById => {
    Array.from(genStateById.entries())
      .forEach(([id, genState]) => {
        if (genState.owned <= 0) {
          return
        }

        const generator = GENERATORS_BY_ID.get(id)!
        const newTicks = genState.ticks + ticksToUse

        if (newTicks >= generator.initialTicks) {
          const timesProduced = Math.floor(newTicks / generator.initialTicks)
          genStateById.set(id, {
            ...genState,
            ticks: newTicks % generator.initialTicks,
          })
          revenue += timesProduced * calculateGeneratorRevenue(generator, gameState)
        } else {
          genStateById.set(id, {
            ...genState,
            ticks: newTicks,
          })
        }
      })
  })

  return {
    generatorStateById: generatorStateById,
    revenue: revenue,
  }
}