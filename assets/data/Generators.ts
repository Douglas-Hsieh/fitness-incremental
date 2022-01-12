import { Map } from "immutable"

export interface Generator {
  id: string;
  name: string;
  initialPrice: number;  // Cost of first generator
  growthRate: number;  // Rate at which cost grows
  initialRevenue: number;
  initialTicks: number;  // initial # of ticks required to produce revenue
  initialProductivity: number;  // initialRevenue / initialTicks
  image: any;
}

export const GENERATORS_BY_ID: Map<string, Generator> = Map([
  ["1", {
    id: "1",
    name: 'Puppies',
    initialPrice: 3.738,
    growthRate: 1.07,
    initialTicks: 0.6,
    initialRevenue: 1,
    initialProductivity: 1.67,
    image: require('../images/puppy.png'),
  }],
  ["2", {
    id: "2",
    name: 'Friends',
    initialPrice: 60,
    growthRate: 1.15,
    initialTicks: 3,
    initialRevenue: 60,
    initialProductivity: 20,
    image: require('../images/friend.png'),
  }],
  ["3", {
    id: "3",
    name: 'Athletes',
    initialPrice: 720,
    growthRate: 1.14,
    initialTicks: 6,
    initialRevenue: 540,
    initialProductivity: 90,
    image: require('../images/athlete.png'),
  }],
  ["4", {
    id: "4",
    name: 'Playgrounds',
    initialPrice: 8640,
    growthRate: 1.13,
    initialTicks: 12,
    initialRevenue: 4320,
    initialProductivity: 360,
    image: require('../images/playground.png'),
  }],
  ["5", {
    id: "5",
    name: 'Soccer Teams',
    initialPrice: 103680,
    growthRate: 1.12,
    initialTicks: 24,
    initialRevenue: 51840,
    initialProductivity: 2160,
    image: require('../images/soccer-team.png'),
  }],
  ["6", {
    id: "6",
    name: 'Gyms',
    initialPrice: 1244160,
    growthRate: 1.11,
    initialTicks: 96,
    initialRevenue: 622080,
    initialProductivity: 6480,
    image: require('../images/treadmill.png'),
  }],
  ["7", {
    id: "7",
    name: 'Police Departments',
    initialPrice: 14929920,
    growthRate: 1.10,
    initialTicks: 384,
    initialRevenue: 7464960,
    initialProductivity: 19440,
    image: require('../images/police.png'),
  }],
  ["8", {
    id: "8",
    name: 'Ninja Villages',
    initialPrice: 179159040,
    growthRate: 1.09,
    initialTicks: 1536,
    initialRevenue: 89579520,
    initialProductivity: 58320,
    image: require('../images/ninja.png'),
  }],
  ["9", {
    id: "9",
    name: 'Cities',
    initialPrice: 2149908480,
    growthRate: 1.08,
    initialTicks: 6144,
    initialRevenue: 1074954240,
    initialProductivity: 174960,
    image: require('../images/everyone.png'),
  }],
  ["10", {
    id: "10",
    name: 'Armies',
    initialPrice: 25798901760,
    growthRate: 1.07,
    initialTicks: 36864,
    initialRevenue: 29668737024,
    initialProductivity: 804816,
    image: require('../images/soldier.png'),
  }],
])
export const GENERATORS = Array.from(GENERATORS_BY_ID.values())

// Not actually a generator, but used for upgrades, unlocks for all generators
export const EVERYONE_GENERATOR = {
  id: '0',
  name: 'All Followers',
  image: require('../images/cities.png')
}