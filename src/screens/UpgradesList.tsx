import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { EVERYONE_GENERATOR, GENERATORS } from "../../assets/data/Generators";
import { GENERATOR_MULTIPLIER_CASH_UPGRADES, GENERATOR_MULTIPLIER_PRESTIGE_UPGRADES, getUpgradeId, MANAGER_UPGRADES, UpgradeType } from "../../assets/data/Upgrades";
import { GameState } from "../../assets/data/GameState";
import { UpgradeItem, UpgradeItemProps } from "../components/UpgradeItem";
import { Set } from "immutable";
import { Currency } from "../enums/Currency";
import { ConfirmationModalProps } from "../components/ConfirmationModal";

interface UpgradesListProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  upgradeType: UpgradeType;
  setModalProps: React.Dispatch<React.SetStateAction<ConfirmationModalProps>>;
}

const UpgradesList = ({ gameState, setGameState, upgradeType, setModalProps }: UpgradesListProps) => {

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
    
    const isExpensive = upgrade.priceCurrency === Currency.Prestige
      && 10 * upgrade.price > gameState.prestige

    return {
      upgradeType: upgradeType,
      upgrade: upgrade,
      title: upgrade.title ? upgrade.title : generatorName,
      description: description,
      price: upgrade.price,
      currency: upgrade.priceCurrency,
      image: image,
      isDisabled: isDisabled,
      isExpensive: isExpensive,
      setModalProps: setModalProps,
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
      showsVerticalScrollIndicator={false}
      initialNumToRender={5}
    />
  );
};

export default UpgradesList