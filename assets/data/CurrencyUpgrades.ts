import { Map } from 'immutable'

export interface CurrencyUpgrade {
  id: number,
  generatorId: number,
  price: number,
  multiplier: number,
}

export const CURRENCY_UPGRADES_BY_ID: Map<number, CurrencyUpgrade> = Map([
  [1, { id: 1, generatorId: 1, price: 250e+3, multiplier: 3 }],
  [2, { id: 2, generatorId: 2, price: 500e+3, multiplier: 3 }],
  [3, { id: 3, generatorId: 3, price: 1e+6, multiplier: 3 }],
  [4, { id: 4, generatorId: 4, price: 5e+6, multiplier: 3 }],
  [5, { id: 5, generatorId: 5, price: 10e+6, multiplier: 3 }],
  [6, { id: 6, generatorId: 6, price: 25e+6, multiplier: 3 }],
  [7, { id: 7, generatorId: 7, price: 500e+6, multiplier: 3 }],
  [8, { id: 8, generatorId: 8, price: 10e+9, multiplier: 3 }],
  [9, { id: 9, generatorId: 9, price: 50e+9, multiplier: 3 }],
  [10, { id: 10, generatorId: 10, price: 250e+9, multiplier: 3 }],
  [11, { id: 11, generatorId: 0, price: 1e+12, multiplier: 3 }],
  [12, { id: 12, generatorId: 1, price: 20e+12, multiplier: 3 }],
  [13, { id: 13, generatorId: 2, price: 50e+12, multiplier: 3 }],
  [14, { id: 14, generatorId: 3, price: 100e+12, multiplier: 3 }],
  [15, { id: 15, generatorId: 4, price: 500e+12, multiplier: 3 }],
  [16, { id: 16, generatorId: 5, price: 1e+15, multiplier: 3 }],
  [17, { id: 17, generatorId: 6, price: 2e+15, multiplier: 3 }],
  [18, { id: 18, generatorId: 7, price: 5e+15, multiplier: 3 }],
  [19, { id: 19, generatorId: 9, price: 10e+15, multiplier: 3 }],
  [20, { id: 20, generatorId: 10, price: 20e+15, multiplier: 3 }],
  [21, { id: 21, generatorId: 0, price: 50e+15, multiplier: 3 }],
])

export const CURRENCY_UPGRADES = Array.from(CURRENCY_UPGRADES_BY_ID.values())