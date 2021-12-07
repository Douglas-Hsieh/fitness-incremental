
interface CurrencyUpgrade {
  generatorId: number,
  priceCoefficient: number,
  priceScale: number,
  multiplier: number,
}

const CurrencyUpgrades: CurrencyUpgrade[] = [
  { generatorId: 1, priceCoefficient: 250, priceScale:3, multiplier: 3 },
  { generatorId: 2, priceCoefficient: 500, priceScale:3, multiplier: 3 },
  { generatorId: 3, priceCoefficient: 1, priceScale:6, multiplier: 3 },
  { generatorId: 4, priceCoefficient: 5, priceScale:6, multiplier: 3 },
  { generatorId: 5, priceCoefficient: 10, priceScale:6, multiplier: 3 },
  { generatorId: 6, priceCoefficient: 25, priceScale:6, multiplier: 3 },
  { generatorId: 7, priceCoefficient: 500, priceScale:6, multiplier: 3 },
  { generatorId: 8, priceCoefficient: 10, priceScale:9, multiplier: 3 },
  { generatorId: 9, priceCoefficient: 50, priceScale:9, multiplier: 3 },
  { generatorId: 10, priceCoefficient: 250, priceScale:9, multiplier: 3 },
  { generatorId: 0, priceCoefficient: 1, priceScale:12, multiplier: 3 },
  { generatorId: 1, priceCoefficient: 20, priceScale:12, multiplier: 3 },
  { generatorId: 2, priceCoefficient: 50, priceScale:12, multiplier: 3 },
  { generatorId: 3, priceCoefficient: 100, priceScale:12, multiplier: 3 },
  { generatorId: 4, priceCoefficient: 500, priceScale:12, multiplier: 3 },
  { generatorId: 5, priceCoefficient: 1, priceScale:15, multiplier: 3 },
  { generatorId: 6, priceCoefficient: 2, priceScale:15, multiplier: 3 },
  { generatorId: 7, priceCoefficient: 5, priceScale:15, multiplier: 3 },
  { generatorId: 9, priceCoefficient: 10, priceScale:15, multiplier: 3 },
  { generatorId: 10, priceCoefficient: 20, priceScale:15, multiplier: 3 },
  { generatorId: 0, priceCoefficient: 50, priceScale:15, multiplier: 3 },
]

export default CurrencyUpgrades;