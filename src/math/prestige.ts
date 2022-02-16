
export const calculateEarnedPrestige = (lifetimeEarningsSinceBeginning: number, lifetimeEarningsSinceLastReset: number): number => {
  if (lifetimeEarningsSinceBeginning < lifetimeEarningsSinceLastReset) {
    return 0
  }

  const k = 4e+11 / 9
  const prestige = Math.pow(lifetimeEarningsSinceBeginning / k, .5) - Math.pow(lifetimeEarningsSinceLastReset / k, .5);
  return Math.floor(prestige)
};
