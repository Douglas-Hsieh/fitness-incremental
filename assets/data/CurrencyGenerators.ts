export interface CurrencyGenerator {
  id: number;
  name: string;
  initialCost: number;
  coefficient: number;
  initialRevenue: number;
  initialSteps: number;
  initialProductivity: number;  // initialRevenue / initialSteps
  image: any;
}

export const CURRENCY_GENERATORS: CurrencyGenerator[] = [
  {
    id: 1,
    name: 'Puppies',
    initialCost: 3.738,
    coefficient: 1.07,
    initialSteps: 0.6,
    initialRevenue: 1,
    initialProductivity: 1.67,
    image: require('../images/puppy.png'),
  },
  {
    id: 2,
    name: 'Friends',
    initialCost: 60,
    coefficient: 1.15,
    initialSteps: 3,
    initialRevenue: 60,
    initialProductivity: 20,
    image: require('../images/friend.png'),
  },
  {
    id: 3,
    name: 'Athletes',
    initialCost: 720,
    coefficient: 1.14,
    initialSteps: 6,
    initialRevenue: 540,
    initialProductivity: 90,
    image: require('../images/athlete.png'),
  },
  {
    id: 4,
    name: 'Playgrounds',
    initialCost: 8640,
    coefficient: 1.13,
    initialSteps: 12,
    initialRevenue: 4320,
    initialProductivity: 360,
    image: require('../images/playground.png'),
  },
  {
    id: 5,
    name: 'Soccer Teams',
    initialCost: 103680,
    coefficient: 1.12,
    initialSteps: 24,
    initialRevenue: 51840,
    initialProductivity: 2160,
    image: require('../images/soccer-team.png'),
  },
  {
    id: 6,
    name: 'Gyms',
    initialCost: 1244160,
    coefficient: 1.11,
    initialSteps: 96,
    initialRevenue: 622080,
    initialProductivity: 6480,
    image: require('../images/treadmill.png'),
  },
  {
    id: 7,
    name: 'Police Departments',
    initialCost: 14929920,
    coefficient: 1.10,
    initialSteps: 384,
    initialRevenue: 7464960,
    initialProductivity: 19440,
    image: require('../images/police.png'),
  },
  {
    id: 8,
    name: 'Ninja Villages',
    initialCost: 179159040,
    coefficient: 1.09,
    initialSteps: 1536,
    initialRevenue: 89579520,
    initialProductivity: 58320,
    image: require('../images/ninja.png'),
  },
  {
    id: 9,
    name: 'Cities',
    initialCost: 2149908480,
    coefficient: 1.08,
    initialSteps: 6144,
    initialRevenue: 1074954240,
    initialProductivity: 174960,
    image: require('../images/cities.png'),
  },
  {
    id: 10,
    name: 'Armies',
    initialCost: 25798901760,
    coefficient: 1.07,
    initialSteps: 36864,
    initialRevenue: 29668737024,
    initialProductivity: 804816,
    image: require('../images/soldier.png'),
  },
]