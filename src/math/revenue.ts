import { Generator, GENERATORS_BY_ID } from "../../assets/data/Generators";
import { GameState } from "../../assets/data/GameState";
import { calculateMultipliersFromUpgrades, calculateMultipliersFromUnlocks, calculateTemporaryMultipliers, calculateTicksNeededByGeneratorId } from "./multipliers";

export const calculateGeneratorBaseRevenue = (
  generator: Generator,
  gameState: GameState
) => {
  const { generatorStateById, upgradeIds, unlockIds, prestige } = gameState;

  const generatorState = generatorStateById.get(generator.id)!;

  const upgradeMultipliersByGeneratorId = calculateMultipliersFromUpgrades(upgradeIds);
  const unlockMultipliersByGeneratorId = calculateMultipliersFromUnlocks(unlockIds);
  const prestigeMultiplier = 1 + (prestige * 0.02);

  const revenue = (generator.initialRevenue * generatorState.owned)
    * upgradeMultipliersByGeneratorId.get(generator.id)!
    * unlockMultipliersByGeneratorId.get(generator.id)!
    * prestigeMultiplier;

  return revenue;
};

export const calculateGeneratorRevenue = (
  generator: Generator,
  gameState: GameState
) => {
  const baseRevenue = calculateGeneratorBaseRevenue(generator, gameState);
  const temporaryMultiplier = calculateTemporaryMultipliers(gameState.temporaryMultipliers);
  return baseRevenue * temporaryMultiplier;
};

export const calculateGeneratorProductivity = (
  generator: Generator,
  gameState: GameState
) => {
  const generatorRevenue = calculateGeneratorRevenue(generator, gameState)
  const ticksToUse = calculateTicksToUse(gameState.ticks, gameState.speed)
  const ticksNeededByGeneratorId = calculateTicksNeededByGeneratorId(GENERATORS_BY_ID, gameState.unlockIds)
  const ticksNeeded = ticksNeededByGeneratorId.get(generator.id)!
  return generatorRevenue * (ticksToUse / ticksNeeded)
}

export const calculateOneTickBaseRevenue = (
  generators: Generator[],
  gameState: GameState
): number => {
  const { generatorStateById, upgradeIds, unlockIds, prestige } = gameState;

  const upgradeMultipliersByGeneratorId = calculateMultipliersFromUpgrades(upgradeIds);
  const unlockMultipliersByGeneratorId = calculateMultipliersFromUnlocks(unlockIds);
  const prestigeMultiplier = 1 + (prestige * 0.02);

  return generators.map(generator => {
    const generatorState = generatorStateById.get(generator.id)!;
    const revenue = (generator.initialProductivity * generatorState.owned)
      * upgradeMultipliersByGeneratorId.get(generator.id)!
      * unlockMultipliersByGeneratorId.get(generator.id)!
      * prestigeMultiplier;
    return revenue;
  }).reduce((r1, r2) => r1 + r2);
};

export const calculateTicksToUse = (ticksRemaining: number, speed: number): number => {
  let ticksToUse
  if (ticksRemaining <= 0) {
    ticksToUse = 0
  } else if (ticksRemaining < 25000) {
    ticksToUse = .25
  } else if (ticksRemaining < 50000) {
    ticksToUse = .5
  } else if (ticksRemaining < 100000) {
    ticksToUse = 1
  } else if (ticksRemaining < 150000) {
    ticksToUse = 2
  } else if (ticksRemaining < 200000) {
    ticksToUse = 3
  } else {
    ticksToUse = 4
  }
  return ticksToUse * speed
}

export const progressGenerators = (
  gameState: GameState,
  ticksToUse: number,
) => {
  let revenue = 0
  const ticksNeededByGeneratorId = calculateTicksNeededByGeneratorId(GENERATORS_BY_ID, gameState.unlockIds)

  const generatorStateById = gameState.generatorStateById.withMutations(genStateById => {
    Array.from(genStateById.entries())
      .forEach(([id, genState]) => {
        if (genState.owned <= 0) {
          return
        }

        const generator = GENERATORS_BY_ID.get(id)!
        const newTicks = genState.ticks + ticksToUse
        const ticksNeeded = ticksNeededByGeneratorId.get(generator.id)!

        if (newTicks >= ticksNeeded) {
          const timesProduced = Math.floor(newTicks / ticksNeeded)
          genStateById.set(id, {
            ...genState,
            ticks: newTicks % ticksNeeded,
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