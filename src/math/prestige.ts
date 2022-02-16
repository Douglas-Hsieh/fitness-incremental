export const K = 4e+11 / 9

export const calculateEarnedPrestige = (sessionEarnings: number, lastSessionEarnings: number): number => {
  if (sessionEarnings < lastSessionEarnings) {
    return 0
  }

  const prestige = Math.pow(sessionEarnings / K, .5) - Math.pow(lastSessionEarnings / K, .5);
  return Math.floor(prestige)
};
