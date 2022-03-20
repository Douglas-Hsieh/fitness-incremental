import { Set } from "immutable";

export class UpgradeState {
  generatorMultiplierCashUpgradeIds: Set<string>;
  generatorMultiplierPrestigeUpgradeIds: Set<string>;
  managerUpgradeIds: Set<string>;

  constructor(
    generatorMultiplierCashUpgradeIds: Set<string> = Set(),
    generatorMultiplierPrestigeUpgradeIds: Set<string> = Set(),
    managerUpgradeIds: Set<string> = Set(),
  ) {
    this.generatorMultiplierCashUpgradeIds = generatorMultiplierCashUpgradeIds
    this.generatorMultiplierPrestigeUpgradeIds = generatorMultiplierPrestigeUpgradeIds
    this.managerUpgradeIds = managerUpgradeIds
  }

  static fromJson(upgradeState: UpgradeState) {
    return new UpgradeState(
      Set(upgradeState.generatorMultiplierCashUpgradeIds),
      Set(upgradeState.generatorMultiplierPrestigeUpgradeIds),
      Set(upgradeState.managerUpgradeIds),
    )
  }
  
}
