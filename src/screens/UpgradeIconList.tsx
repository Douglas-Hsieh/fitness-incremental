import React, { memo } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { HighlightableElement } from "react-native-highlight-overlay";
import colors from "../../assets/colors/colors";
import { HIGHLIGHTABLE_RECTANGLE_OPTIONS } from "../../assets/data/Constants";
import { UpgradeType } from "../../assets/data/Upgrades";
import { AnimatedOverlay } from "../components/GeneratorIcon";
import { HighlightId } from "../enums/HightlightId";
import { playSound, SoundFile } from "../util/sounds";

interface UpgradeIconListProps {
  upgradeType: UpgradeType;
  setUpgradeType: React.Dispatch<React.SetStateAction<UpgradeType>>;
  cashUpgradeHasBadge: boolean;
  prestigeUpgradeHasBadge: boolean;
  managerUpgradeHasBadge: boolean;
}

export const UpgradeIconList = memo(({upgradeType, setUpgradeType, cashUpgradeHasBadge, prestigeUpgradeHasBadge, managerUpgradeHasBadge}: UpgradeIconListProps) => {

  return (
    <View style={styles.upgradeIconList}>

      <TouchableOpacity
        style={[
          styles.upgradeIconContainer,
          upgradeType === UpgradeType.GeneratorMultiplierCashUpgrade ? styles.selected : {},
        ]}
        onPress={() => {
          setUpgradeType(UpgradeType.GeneratorMultiplierCashUpgrade);
          playSound(SoundFile.SwitchOn);
        }}
      >
        {upgradeType !== UpgradeType.GeneratorMultiplierCashUpgrade && cashUpgradeHasBadge &&
          <AnimatedOverlay low={0} high={.5} style={styles.upgradeIconContainerOverlay}/>
        }
        <Image source={require('../../assets/images/steps.png')} style={styles.upgradeIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.upgradeIconContainer,
          upgradeType === UpgradeType.GeneratorMultiplierPrestigeUpgrade ? styles.selected : {},
        ]}
        onPress={() => {
          setUpgradeType(UpgradeType.GeneratorMultiplierPrestigeUpgrade);
          playSound(SoundFile.SwitchOn);
      }}>
        {upgradeType !== UpgradeType.GeneratorMultiplierPrestigeUpgrade && prestigeUpgradeHasBadge &&
          <AnimatedOverlay low={0} high={.5} style={styles.upgradeIconContainerOverlay}/>
        }
        <Image source={require('../../assets/images/trainer.png')} style={styles.upgradeIcon} />
      </TouchableOpacity>

      <HighlightableElement id={HighlightId.ManagerUpgrades} options={HIGHLIGHTABLE_RECTANGLE_OPTIONS}>
        <TouchableOpacity
          style={[
            styles.upgradeIconContainer,
            upgradeType === UpgradeType.ManagerUpgrade ? styles.selected : {},
          ]}
          onPress={() => {
            setUpgradeType(UpgradeType.ManagerUpgrade);
            playSound(SoundFile.SwitchOn);
          }}
        >
        {upgradeType !== UpgradeType.ManagerUpgrade && managerUpgradeHasBadge &&
          <AnimatedOverlay low={0} high={.5} style={styles.upgradeIconContainerOverlay}/>
        }
        <Image source={require('../../assets/images/puppy.png')} style={styles.upgradeIcon} />
        </TouchableOpacity>
      </HighlightableElement>
      
    </View>
  );
});

const styles = StyleSheet.create({
  upgradeIconList: {
    marginTop: 10,
    flexDirection: 'row',
  },
  upgradeIconContainer: {
    height: 80,
    width: 80,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: colors.orange3,
  },
  selected: {
    borderColor: colors.gray4,
  },
  upgradeIcon: {
    height: 50,
    width: 50,
  },
  upgradeIconContainerOverlay: {
    position: 'absolute',
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: colors.orange3,
  }
})