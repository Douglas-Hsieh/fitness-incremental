// Get price of buying amountToBuy generators

export const calculatePrice = (
  amountToBuy: number,
  initialPrice: number,
  growthRate: number,
  owned: number
) => {
  return initialPrice * ((Math.pow(growthRate, owned) * (Math.pow(growthRate, amountToBuy) - 1)) / (growthRate - 1));
};
// Get maximum amount of generators balance can buy

export const calculateMaxBuy = (
  balance: number,
  initialPrice: number,
  growthRate: number,
  owned: number
) => {
  return Math.floor(Math.log(((balance * (growthRate - 1)) / (initialPrice * (Math.pow(growthRate, owned)))) + 1) / Math.log(growthRate));
};
