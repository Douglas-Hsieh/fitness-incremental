import { Map, Set } from 'immutable';
import { GENERATOR_MULTIPLIER_UPGRADE_BY_ID } from "../../assets/data/Upgrades";
import { GENERATOR_UNLOCKS_BY_ID, UnlockReward } from "../../assets/data/GeneratorUnlocks";
import { TemporaryMultiplier } from "../types/TemporaryMultiplier";
import { Generator } from '../../assets/data/Generators';

const INITIAL_MULTIPLIERS_BY_GENERATOR_ID = Map<string, number>([
  ['1', 1],
  ['2', 1],
  ['3', 1],
  ['4', 1],
  ['5', 1],
  ['6', 1],
  ['7', 1],
  ['8', 1],
  ['9', 1],
  ['10', 1],
]);

const INITIAL_SPEED_BY_GENERATOR_ID = Map<string, number>([
  ['1', 1],
  ['2', 1],
  ['3', 1],
  ['4', 1],
  ['5', 1],
  ['6', 1],
  ['7', 1],
  ['8', 1],
  ['9', 1],
  ['10', 1],
]);

export const calculateMultipliersFromUpgrades = (
  upgradeIds: Set<string>
): Map<string, number> => {

  const multipliersByGeneratorId = INITIAL_MULTIPLIERS_BY_GENERATOR_ID.withMutations(multByGenId => {
    upgradeIds.forEach(upgradeId => {
      const upgrade = GENERATOR_MULTIPLIER_UPGRADE_BY_ID.get(upgradeId)!;
      if (upgrade.generatorId === '0') {
        multByGenId.forEach((mult, genId) => {
          multByGenId.set(genId, mult * upgrade.multiplier)
        })
      } else {
        const mult = multByGenId.get(upgrade.generatorId)!;
        multByGenId.set(upgrade.generatorId, mult * upgrade.multiplier);
      }
    });
  });

  return multipliersByGeneratorId;
};

export const calculateMultipliersFromUnlocks = (
  unlockIds: Set<string>
) => {

  const multiplierByGeneratorId = INITIAL_MULTIPLIERS_BY_GENERATOR_ID.withMutations(multByGenId => {
    unlockIds.forEach(unlockId => {
      const unlock = GENERATOR_UNLOCKS_BY_ID.get(unlockId)!;

      if (unlock.reward !== UnlockReward.Multiplier) {
        return
      }

      const allGenerators = unlock.targetGeneratorId === '0';
      if (allGenerators) {
        for (const generatorId of multByGenId.keys()) {
          const multiplier = multByGenId.get(generatorId)!;
          multByGenId.set(generatorId, multiplier * unlock.value);
        }
      } else {
        const multiplier = multByGenId.get(unlock.targetGeneratorId)!;
        multByGenId.set(unlock.targetGeneratorId, multiplier * unlock.value);
      }
    });
  });

  return multiplierByGeneratorId;
};

export const calculateTemporaryMultipliers = (temporaryMultipliers: Set<TemporaryMultiplier>) => {
  const now = new Date();

  const cumulativeMultiplier = Array.from(temporaryMultipliers)
    .filter(tempMult => now < tempMult.expirationDate)
    .map(tempMult => tempMult.multiplier)
    .reduce((mult1, mult2) => mult1 + mult2, 0);
  return cumulativeMultiplier === 0 ? 1 : cumulativeMultiplier;
};

const calculateSpeedsFromUnlocks = (
  unlockIds: Set<string>
) => {
  const speedByGeneratorId = INITIAL_SPEED_BY_GENERATOR_ID.withMutations(speedByGenId => {
    unlockIds.forEach(unlockId => {
      const unlock = GENERATOR_UNLOCKS_BY_ID.get(unlockId)!;

      if (unlock.reward !== UnlockReward.Speed) {
        return
      }

      const allGenerators = unlock.targetGeneratorId === '0';
      if (allGenerators) {
        for (const generatorId of speedByGenId.keys()) {
          const speed = speedByGenId.get(generatorId)!;
          speedByGenId.set(generatorId, speed * unlock.value);
        }
      } else {
        const speed = speedByGenId.get(unlock.targetGeneratorId)!;
        speedByGenId.set(unlock.targetGeneratorId, speed * unlock.value);
      }
    });
  });

  return speedByGeneratorId;
}

export const calculateTicksNeededByGeneratorId = (
  generatorById: Map<string, Generator>,
  unlockIds: Set<string>
) => {
  const speedByGeneratorId = calculateSpeedsFromUnlocks(unlockIds)
  const ticksNeededByGeneratorId = generatorById.map(generator => generator.initialTicks / speedByGeneratorId.get(generator.id)!)
  return ticksNeededByGeneratorId
}