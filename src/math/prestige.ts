
export const calculateEarnedPrestige = (lifetimeEarningsSinceBeginning: number, lifetimeEarningsSinceLastReset: number): number => {
  console.log('lifetimeEarningsSinceBeginning', lifetimeEarningsSinceBeginning);
  console.log('lifetimeEarningsSinceLastReset', lifetimeEarningsSinceLastReset);
  return Math.pow(lifetimeEarningsSinceBeginning / (4e+11 / 9), .5) - Math.pow(lifetimeEarningsSinceLastReset / (4e+11 / 9), .5);
};
