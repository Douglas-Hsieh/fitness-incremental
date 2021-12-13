
interface CurrencyUpgrade {
  id: number,
  generatorId: number,
  price: number,
  multiplier: number,
}

const CurrencyUpgrades: CurrencyUpgrade[] = [
  { id: 1, generatorId: 1, price: 250e+3, multiplier: 3 },
  { id: 2, generatorId: 2, price: 500e+3, multiplier: 3 },
  { id: 3, generatorId: 3, price: 1e+6, multiplier: 3 },
  { id: 4, generatorId: 4, price: 5e+6, multiplier: 3 },
  { id: 5, generatorId: 5, price: 10e+6, multiplier: 3 },
  { id: 6, generatorId: 6, price: 25e+6, multiplier: 3 },
  { id: 7, generatorId: 7, price: 500e+6, multiplier: 3 },
  { id: 8, generatorId: 8, price: 10e+9, multiplier: 3 },
  { id: 9, generatorId: 9, price: 50e+9, multiplier: 3 },
  { id: 10, generatorId: 10, price: 250e+9, multiplier: 3 },
  { id: 11, generatorId: 0, price: 1e+12, multiplier: 3 },
  { id: 12, generatorId: 1, price: 20e+12, multiplier: 3 },
  { id: 13, generatorId: 2, price: 50e+12, multiplier: 3 },
  { id: 14, generatorId: 3, price: 100e+12, multiplier: 3 },
  { id: 15, generatorId: 4, price: 500e+12, multiplier: 3 },
  { id: 16, generatorId: 5, price: 1e+15, multiplier: 3 },
  { id: 17, generatorId: 6, price: 2e+15, multiplier: 3 },
  { id: 18, generatorId: 7, price: 5e+15, multiplier: 3 },
  { id: 19, generatorId: 9, price: 10e+15, multiplier: 3 },
  { id: 20, generatorId: 10, price: 20e+15, multiplier: 3 },
  { id: 21, generatorId: 0, price: 50e+15, multiplier: 3 },
]

export default CurrencyUpgrades;