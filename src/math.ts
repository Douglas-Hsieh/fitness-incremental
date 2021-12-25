import { CurrencyGenerator } from "../assets/data/CurrencyGenerators"
import { GeneratorState } from "../assets/data/GameState"
import Scale from "../assets/data/Scale"
import { Map, Set } from 'immutable'
import { CURRENCY_UPGRADES_BY_ID } from "../assets/data/CurrencyUpgrades"
import { GeneratorUnlock, GENERATOR_UNLOCKS, GENERATOR_UNLOCKS_BY_ID, getUnlockId } from "../assets/data/GeneratorUnlocks"

// Get price of buying amountToBuy generators
export const calculatePrice = (
  amountToBuy: number,
  initialPrice: number,
  growthRate: number,
  owned: number
) => {
  return initialPrice * ((Math.pow(growthRate, owned) * (Math.pow(growthRate, amountToBuy) - 1)) / (growthRate - 1))
}

// Get maximum amount of generators balance can buy
export const calculateMaxBuy = (
  balance: number,
  initialPrice: number,
  growthRate: number,
  owned: number,
) => {
  return Math.floor(Math.log(((balance * (growthRate - 1)) / (initialPrice * (Math.pow(growthRate, owned)))) + 1) / Math.log(growthRate))
}

export const numberToHumanFormat = (number: number, smallNumberFractionDigits: number = 2, fractionDigits: number = 3): [string, string] => {
  if (number === undefined) {
    return ['NaN', 'NaN'];
  }

  // e.g. number = 12,345 == 1.2345e+4
  const [coefficient, scale] = (number).toExponential().split('e').map(Number);  // [1.2345, 4]
  const roundedDownDigits = (scale % 3)
  const roundedDownScale = scale - roundedDownDigits;  // 4 - 1 == 3

  if (roundedDownScale === 0 || roundedDownScale === 3) {
    return [number.toFixed(smallNumberFractionDigits), ''];
  }

  // ['1.2345', 'thousand']
  return [(coefficient * Math.pow(10, roundedDownDigits)).toFixed(fractionDigits), Scale.get(roundedDownScale)!]
}

const INITIAL_MULTIPLIERS_BY_GENERATOR_ID = Map<string, number>([
  ['1',1],
  ['2',1],
  ['3',1],
  ['4',1],
  ['5',1],
  ['6',1],
  ['7',1],
  ['8',1],
  ['9',1],
  ['10',1],
])

const calculateMultipliersFromUpgrades = (
  upgradeIds: Set<string>,
): Map<string, number> => {
  
  const multipliersByGeneratorId = INITIAL_MULTIPLIERS_BY_GENERATOR_ID.withMutations(multByGenId => {
    upgradeIds.forEach(upgradeId => {
      const upgrade = CURRENCY_UPGRADES_BY_ID.get(upgradeId)!
      const currentMultiplier = multByGenId.get(upgrade.generatorId)!
      multByGenId.set(upgrade.generatorId, currentMultiplier * upgrade.multiplier)
    })
  })

  return multipliersByGeneratorId
}

const calculateMultipliersFromUnlocks = (
  unlockIds: Set<string>,
) => {

  const multipliersByGeneratorId = INITIAL_MULTIPLIERS_BY_GENERATOR_ID.withMutations(multByGenId => {
    unlockIds.forEach(unlockId => {
      const unlock = GENERATOR_UNLOCKS_BY_ID.get(unlockId)!
    
      const allGenerators = unlock.targetGeneratorId === '0'
      if (allGenerators) {
        for (const generatorId of multByGenId.keys()) {
          const multiplier = multByGenId.get(generatorId)!
          multByGenId.set(generatorId, multiplier * unlock.multiplier)
        }
      } else {
        const multiplier = multByGenId.get(unlock.targetGeneratorId)!
        multByGenId.set(unlock.targetGeneratorId, multiplier * unlock.multiplier)
      }
    })
  })

  return multipliersByGeneratorId
}

export const calculateOneTickRevenue = (
  currencyGenerators: CurrencyGenerator[],
  generatorStateById: Map<string, GeneratorState>,
  upgradeIds: Set<string>,
  unlockIds: Set<string>,
  prestige: number,
): number => {
  return currencyGenerators.map(generator => {
    const generatorState = generatorStateById.get(generator.id)!;

    const upgradeMultipliersByGeneratorId = calculateMultipliersFromUpgrades(upgradeIds)
    const unlockMultipliersByGeneratorId = calculateMultipliersFromUnlocks(unlockIds);
    const prestigeMultiplier = 1 + (prestige * 0.02)

    const revenue = (generator.initialProductivity * generatorState.owned)
      * upgradeMultipliersByGeneratorId.get(generator.id)!
      * unlockMultipliersByGeneratorId.get(generator.id)!
      * prestigeMultiplier;
    return revenue;
  }).reduce((r1, r2) => r1 + r2);
}

export const calculateUnlocksFromGenerators = (
  generatorStateById: Map<string, GeneratorState>,
): GeneratorUnlock[] => {

  const completedUnlocks = GENERATOR_UNLOCKS.filter(unlock => {
    if (unlock.generatorId === '0') {  // all generators

      return Array.from(generatorStateById.values()).every(generatorState => generatorState.owned >= unlock.count)

    } else {

      const generatorState = generatorStateById.get(unlock.generatorId)!
      return generatorState.owned >= unlock.count

    }
  })
  
  return completedUnlocks
}

export const calculateEarnedPrestige = (lifeTimeEarnings: number, startingLifetimeEarnings: number): number => {
  console.log('lifeTimeEarnings', lifeTimeEarnings)
  console.log('startingLifetimeEarnings', startingLifetimeEarnings)
  return Math.pow(lifeTimeEarnings / (4e+11/9), .5) - Math.pow(startingLifetimeEarnings / (4e+11/9), .5)
}