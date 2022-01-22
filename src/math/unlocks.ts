import { GeneratorState } from "../../assets/data/GeneratorState";
import { Map } from 'immutable';
import { GeneratorUnlock, GENERATOR_UNLOCKS } from "../../assets/data/GeneratorUnlocks";


export const calculateUnlocksFromGenerators = (
  generatorStateById: Map<string, GeneratorState>
): GeneratorUnlock[] => {

  const completedUnlocks = GENERATOR_UNLOCKS.filter(unlock => {
    if (unlock.generatorId === '0') { // all generators

      return Array.from(generatorStateById.values()).every(generatorState => generatorState.owned >= unlock.count);

    } else {

      const generatorState = generatorStateById.get(unlock.generatorId)!;
      return generatorState.owned >= unlock.count;

    }
  });

  return completedUnlocks;
};
