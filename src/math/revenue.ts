import { Generator, GENERATORS_BY_ID } from "../../assets/data/Generators";
import { GameState } from "../../assets/data/GameState";
import { calculateMultipliersFromUpgrades, calculateMultipliersFromUnlocks, calculateTemporaryMultipliers, calculateTicksNeededByGeneratorId } from "./multipliers";
import { TICK_LEVELS, TICK_THRESHOLDS, TICKS_TO_USE } from "../../assets/data/Constants";

export const calculateGeneratorBaseRevenue = (
  generator: Generator,
  gameState: GameState
) => {
  const { generatorStateById, upgradeState, unlockIds, prestige } = gameState;

  const generatorState = generatorStateById.get(generator.id)!;
  const multiplierUpgradeIds = upgradeState.generatorMultiplierCashUpgradeIds
    .merge(upgradeState.generatorMultiplierPrestigeUpgradeIds)

  const upgradeMultipliersByGeneratorId = calculateMultipliersFromUpgrades(multiplierUpgradeIds);
  const unlockMultipliersByGeneratorId = calculateMultipliersFromUnlocks(unlockIds);
  const prestigeMultiplier = 1 + (prestige * 0.02);
  const permanentMultiplier = gameState.permanentMultiplier

  const revenue = (generator.initialRevenue * generatorState.owned)
    * upgradeMultipliersByGeneratorId.get(generator.id)!
    * unlockMultipliersByGeneratorId.get(generator.id)!
    * prestigeMultiplier
    * permanentMultiplier;

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
  const { generatorStateById, upgradeState, unlockIds, prestige } = gameState;
  const multiplierUpgradeIds = upgradeState.generatorMultiplierCashUpgradeIds
    .merge(upgradeState.generatorMultiplierPrestigeUpgradeIds)

  const upgradeMultipliersByGeneratorId = calculateMultipliersFromUpgrades(multiplierUpgradeIds);
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
  const ticksToUse = TICK_LEVELS.find(t => ticksRemaining <= t.threshold)!.ticksToUse
  return ticksToUse * speed
}

export function calculateSecondsUntilAllTicksUsed(ticks: number, speed: number) {
  let seconds = 0
  
  for (let i = 0; i < TICK_THRESHOLDS.size - 1; ++i) {
    if (TICK_THRESHOLDS.get(i)! < ticks && ticks < TICK_THRESHOLDS.get(i + 1)!) {
      seconds += (ticks - TICK_THRESHOLDS.get(i)!) / (TICKS_TO_USE.get(i + 1)! * speed)
    } else if (ticks > TICK_THRESHOLDS.get(i + 1)!) {
      seconds += (TICK_THRESHOLDS.get(i + 1)! - TICK_THRESHOLDS.get(i)!) / (TICKS_TO_USE.get(i + 1)! * speed)
    }
  }

  return seconds
}

export function calculateTicksUsedSinceLastProgress(now: Date, gameState: GameState) {
  let seconds = (now.getTime() - gameState.lastRevenueProgress.getTime()) / 1000;
  let ticks = gameState.ticks;
  let ticksUsed = 0;

  // TODO: Big performance hit when user is inactive for a month
  for (let i = 0; i < seconds; ++i) {
    const ticksToUse = calculateTicksToUse(ticks, gameState.speed);
    ticks -= ticksToUse;
    ticksUsed += ticksToUse;
  }
  return ticksUsed;
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
        if (genState.owned <= 0 || (!genState.hasManager && !genState.isManuallyOperating)) {
          return
        }

        const generator = GENERATORS_BY_ID.get(id)!
        const newTicks = genState.ticks + ticksToUse
        const ticksNeeded = ticksNeededByGeneratorId.get(generator.id)!

        if (newTicks >= ticksNeeded) {
          const timesProduced = Math.floor(newTicks / ticksNeeded)
          if (genState.isManuallyOperating) {
            genStateById.set(id, {
              ...genState,
              ticks: 0,
              isManuallyOperating: false,
            })
          } else {
            genStateById.set(id, {
              ...genState,
              ticks: newTicks % ticksNeeded,
            })
          }
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

export function hasWorkingGenerator(
  gameState: GameState,
) {
  const genStates = Array.from(gameState.generatorStateById.values())
  return !!genStates.find(genState => genState.isManuallyOperating || genState.hasManager)
}