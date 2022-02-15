import { Generator, GENERATORS_BY_ID } from "../../assets/data/Generators";
import { GameState } from "../../assets/data/GameState";
import { calculateMultipliersFromUpgrades, calculateMultipliersFromUnlocks, calculateTemporaryMultipliers, calculateTicksNeededByGeneratorId } from "./multipliers";
import { calculateTicksToUse } from "./math";

export const calculateGeneratorBaseRevenue = (
  generator: Generator,
  gameState: GameState
) => {
  const { generatorStateById, upgradeIds, unlockIds, prestige } = gameState;

  const generatorState = generatorStateById.get(generator.id)!;

  const upgradeMultipliersByGeneratorId = calculateMultipliersFromUpgrades(upgradeIds);
  const unlockMultipliersByGeneratorId = calculateMultipliersFromUnlocks(unlockIds);
  const prestigeMultiplier = 1 + (prestige * 0.02);

  const revenue = (generator.initialRevenue * generatorState.owned)
    * upgradeMultipliersByGeneratorId.get(generator.id)!
    * unlockMultipliersByGeneratorId.get(generator.id)!
    * prestigeMultiplier;

  return revenue;
};

export const calculateGeneratorRevenue = (
  generator: Generator,
  gameState: GameState
) => {
  const baseRevenue = calculateGeneratorBaseRevenue(generator, gameState);
  const temporaryMultiplier = calculateTemporaryMultipliers(gameState.temporaryMultipliers);
  return baseRevenue * temporaryMultiplier;
};

export const calculateGeneratorProductivity = (
  generator: Generator,
  gameState: GameState
) => {
  const generatorRevenue = calculateGeneratorRevenue(generator, gameState)
  const ticksToUse = calculateTicksToUse(gameState.ticks, gameState.speed)
  const ticksNeededByGeneratorId = calculateTicksNeededByGeneratorId(GENERATORS_BY_ID, gameState.unlockIds)
  const ticksNeeded = ticksNeededByGeneratorId.get(generator.id)!
  return generatorRevenue * (ticksToUse / ticksNeeded)
}

export const calculateOneTickBaseRevenue = (
  generators: Generator[],
  gameState: GameState
): number => {
  const { generatorStateById, upgradeIds, unlockIds, prestige } = gameState;

  const upgradeMultipliersByGeneratorId = calculateMultipliersFromUpgrades(upgradeIds);
  const unlockMultipliersByGeneratorId = calculateMultipliersFromUnlocks(unlockIds);
  const prestigeMultiplier = 1 + (prestige * 0.02);

  return generators.map(generator => {
    const generatorState = generatorStateById.get(generator.id)!;
    const revenue = (generator.initialProductivity * generatorState.owned)
      * upgradeMultipliersByGeneratorId.get(generator.id)!
      * unlockMultipliersByGeneratorId.get(generator.id)!
      * prestigeMultiplier;
    return revenue;
  }).reduce((r1, r2) => r1 + r2);
};
