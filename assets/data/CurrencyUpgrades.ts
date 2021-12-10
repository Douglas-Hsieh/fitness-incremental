
interface CurrencyUpgrade {
  id: number,
  generatorId: number,
  priceCoefficient: number,
  priceScale: number,
  multiplier: number,
}

const CurrencyUpgrades: CurrencyUpgrade[] = [
  { id: 1, generatorId: 1, priceCoefficient: 250, priceScale: 3, multiplier: 3 },
  { id: 2, generatorId: 2, priceCoefficient: 500, priceScale: 3, multiplier: 3 },
  { id: 3, generatorId: 3, priceCoefficient: 1, priceScale: 6, multiplier: 3 },
  { id: 4, generatorId: 4, priceCoefficient: 5, priceScale: 6, multiplier: 3 },
  { id: 5, generatorId: 5, priceCoefficient: 10, priceScale: 6, multiplier: 3 },
  { id: 6, generatorId: 6, priceCoefficient: 25, priceScale: 6, multiplier: 3 },
  { id: 7, generatorId: 7, priceCoefficient: 500, priceScale: 6, multiplier: 3 },
  { id: 8, generatorId: 8, priceCoefficient: 10, priceScale: 9, multiplier: 3 },
  { id: 9, generatorId: 9, priceCoefficient: 50, priceScale: 9, multiplier: 3 },
  { id: 10, generatorId: 10, priceCoefficient: 250, priceScale: 9, multiplier: 3 },
  { id: 11, generatorId: 0, priceCoefficient: 1, priceScale: 12, multiplier: 3 },
  { id: 12, generatorId: 1, priceCoefficient: 20, priceScale: 12, multiplier: 3 },
  { id: 13, generatorId: 2, priceCoefficient: 50, priceScale: 12, multiplier: 3 },
  { id: 14, generatorId: 3, priceCoefficient: 100, priceScale: 12, multiplier: 3 },
  { id: 15, generatorId: 4, priceCoefficient: 500, priceScale: 12, multiplier: 3 },
  { id: 16, generatorId: 5, priceCoefficient: 1, priceScale: 15, multiplier: 3 },
  { id: 17, generatorId: 6, priceCoefficient: 2, priceScale: 15, multiplier: 3 },
  { id: 18, generatorId: 7, priceCoefficient: 5, priceScale: 15, multiplier: 3 },
  { id: 19, generatorId: 9, priceCoefficient: 10, priceScale: 15, multiplier: 3 },
  { id: 20, generatorId: 10, priceCoefficient: 20, priceScale: 15, multiplier: 3 },
  { id: 21, generatorId: 0, priceCoefficient: 50, priceScale: 15, multiplier: 3 },
]

export default CurrencyUpgrades;