import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { EVERYONE_GENERATOR, GENERATORS } from "../../assets/data/Generators";
import { GENERATOR_MULTIPLIER_CASH_UPGRADES, GENERATOR_MULTIPLIER_PRESTIGE_UPGRADES, getUpgradeId, MANAGER_UPGRADES, UpgradeType } from "../../assets/data/Upgrades";
import { GameState } from "../../assets/data/GameState";
import { UpgradeItem, UpgradeItemProps } from "../components/UpgradeItem";
import { Set } from "immutable";
import { Currency } from "../enums/Currency";

interface UpgradesListProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  upgradeType: UpgradeType;
}

const UpgradesList = ({ gameState, setGameState, upgradeType }: UpgradesListProps) => {

  let upgrades;
  let ownedUpgrades: Set<string>;
  if (upgradeType === UpgradeType.GeneratorMultiplierCashUpgrade) {
    upgrades = GENERATOR_MULTIPLIER_CASH_UPGRADES;
    ownedUpgrades = gameState.upgradeState.generatorMultiplierCashUpgradeIds;
  } else if (upgradeType === UpgradeType.GeneratorMultiplierPrestigeUpgrade) {
    upgrades = GENERATOR_MULTIPLIER_PRESTIGE_UPGRADES;
    ownedUpgrades = gameState.upgradeState.generatorMultiplierPrestigeUpgradeIds;
  } else {
    upgrades = MANAGER_UPGRADES;
    ownedUpgrades = gameState.upgradeState.managerUpgradeIds;
  }

  const remainingUpgrades = upgrades
    .filter(upgrade => !ownedUpgrades.has(getUpgradeId(upgrade)))
    .sort((u1, u2) => u1.price - u2.price);

  const upgradeData = remainingUpgrades.map(upgrade => {
    let image;
    let generatorName;
    let description;

    if (upgrade.generatorId === '0') {
      image = EVERYONE_GENERATOR.image;
      generatorName = EVERYONE_GENERATOR.name;
    } else {
      const generator = GENERATORS.find(generator => generator.id == upgrade.generatorId)!;
      image = generator.image;
      generatorName = generator.name;
    }

    if (upgradeType === UpgradeType.ManagerUpgrade) {
      description = `Automate ${generatorName}`;
    } else {
      description = `${generatorName} steps x3`;
    }

    const isDisabled = upgrade.priceCurrency === Currency.Cash
      ? upgrade.price > gameState.balance
      : upgrade.price > gameState.prestige

    return {
      upgradeType: upgradeType,
      upgrade: upgrade,
      title: generatorName,
      description: description,
      price: upgrade.price,
      currency: upgrade.priceCurrency,
      image: image,
      isDisabled: isDisabled,
      setGameState: setGameState,
    };
  });

  const renderItem = ({ item }: { item: UpgradeItemProps; }) => <UpgradeItem {...item} />;

  return (
    <FlatList
      data={upgradeData}
      renderItem={renderItem}
      keyExtractor={item => getUpgradeId(item.upgrade)}
      contentInsetAdjustmentBehavior='automatic'
      showsVerticalScrollIndicator={false} />
  );
};

export default UpgradesList