
export const calculateEarnedPrestige = (lifeTimeEarnings: number, startingLifetimeEarnings: number): number => {
  console.log('lifeTimeEarnings', lifeTimeEarnings);
  console.log('startingLifetimeEarnings', startingLifetimeEarnings);
  return Math.pow(lifeTimeEarnings / (4e+11 / 9), .5) - Math.pow(startingLifetimeEarnings / (4e+11 / 9), .5);
};
