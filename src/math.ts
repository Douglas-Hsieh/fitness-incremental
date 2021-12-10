import Scale from "../assets/data/Scale"

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

export const numberToHumanFormat = (number: number): [string, string] => {
  if (number === undefined) {
    return ['NaN', 'NaN'];
  }

  // e.g. number = 12,345 == 1.2345e+4
  const [coefficient, scale] = (number).toExponential().split('e').map(Number);  // [1.2345, 4]
  const roundedDownDigits = (scale % 3)
  const roundedDownScale = scale - roundedDownDigits;  // 4 - 1 == 3

  if (roundedDownScale === 0 || roundedDownScale === 3) {
    return [number.toFixed(2), ''];
  }

  // ['1.2345', 'thousand']
  return [(coefficient * Math.pow(10, roundedDownDigits)).toFixed(3), Scale.get(roundedDownScale)!]
}
