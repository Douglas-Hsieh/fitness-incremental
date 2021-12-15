import { CurrencyGenerator } from "../assets/data/CurrencyGenerators"
import { GeneratorState } from "../assets/data/GameState"
import Scale from "../assets/data/Scale"
import { Map } from 'immutable'

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


export const calculateOneTickRevenue = (
  currencyGenerators: CurrencyGenerator[],
  generatorStateById: Map<number, GeneratorState>
): number => {
  return currencyGenerators.map(generator => {
    const generatorState = generatorStateById.get(generator.id)!;
    const multipliers = 1;
    const revenue = (generator.initialRevenue * generatorState.owned) * multipliers;
    return revenue;
  }).reduce((r1, r2) => r1 + r2);
}