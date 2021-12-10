export interface CurrencyGenerator {
  id: number;
  name: string;
  initialPrice: number;  // Cost of first generator
  growthRate: number;  // Rate at which cost grows
  initialRevenue: number;
  initialSteps: number;
  initialProductivity: number;  // initialRevenue / initialSteps
  image: any;
}

export const CURRENCY_GENERATORS: CurrencyGenerator[] = [
  {
    id: 1,
    name: 'Puppies',
    initialPrice: 3.738,
    growthRate: 1.07,
    initialSteps: 0.6,
    initialRevenue: 1,
    initialProductivity: 1.67,
    image: require('../images/puppy.png'),
  },
  {
    id: 2,
    name: 'Friends',
    initialPrice: 60,
    growthRate: 1.15,
    initialSteps: 3,
    initialRevenue: 60,
    initialProductivity: 20,
    image: require('../images/friend.png'),
  },
  {
    id: 3,
    name: 'Athletes',
    initialPrice: 720,
    growthRate: 1.14,
    initialSteps: 6,
    initialRevenue: 540,
    initialProductivity: 90,
    image: require('../images/athlete.png'),
  },
  {
    id: 4,
    name: 'Playgrounds',
    initialPrice: 8640,
    growthRate: 1.13,
    initialSteps: 12,
    initialRevenue: 4320,
    initialProductivity: 360,
    image: require('../images/playground.png'),
  },
  {
    id: 5,
    name: 'Soccer Teams',
    initialPrice: 103680,
    growthRate: 1.12,
    initialSteps: 24,
    initialRevenue: 51840,
    initialProductivity: 2160,
    image: require('../images/soccer-team.png'),
  },
  {
    id: 6,
    name: 'Gyms',
    initialPrice: 1244160,
    growthRate: 1.11,
    initialSteps: 96,
    initialRevenue: 622080,
    initialProductivity: 6480,
    image: require('../images/treadmill.png'),
  },
  {
    id: 7,
    name: 'Police Departments',
    initialPrice: 14929920,
    growthRate: 1.10,
    initialSteps: 384,
    initialRevenue: 7464960,
    initialProductivity: 19440,
    image: require('../images/police.png'),
  },
  {
    id: 8,
    name: 'Ninja Villages',
    initialPrice: 179159040,
    growthRate: 1.09,
    initialSteps: 1536,
    initialRevenue: 89579520,
    initialProductivity: 58320,
    image: require('../images/ninja.png'),
  },
  {
    id: 9,
    name: 'Cities',
    initialPrice: 2149908480,
    growthRate: 1.08,
    initialSteps: 6144,
    initialRevenue: 1074954240,
    initialProductivity: 174960,
    image: require('../images/cities.png'),
  },
  {
    id: 10,
    name: 'Armies',
    initialPrice: 25798901760,
    growthRate: 1.07,
    initialSteps: 36864,
    initialRevenue: 29668737024,
    initialProductivity: 804816,
    image: require('../images/soldier.png'),
  },
]