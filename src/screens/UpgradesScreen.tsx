import React from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../../assets/colors/colors";
import { CURRENCY_GENERATORS } from "../../assets/data/CurrencyGenerators";
import CurrencyUpgrades from "../../assets/data/CurrencyUpgrades";
import Scale from "../../assets/data/Scale";

export const UpgradesScreen = () => {

  const Upgrade = (props: {title: string, description: string, priceCoefficient: number, priceScale: number, image: any}) => (
    <View style={styles.upgradeWrapper}>
      <Image style={styles.generatorIcon} source={props.image}/>
      <View style={styles.upgradeTextWrapper}>
        <Text style={styles.upgradeTitle}>{props.title}</Text>
        <Text style={styles.upgradeDescription}>{props.description}</Text>
        <Text style={styles.upgradePrice}>{props.priceCoefficient} {Scale.get(props.priceScale)} steps</Text>
      </View>
      <TouchableOpacity activeOpacity={.8}>
        <View style={styles.buyUpgradeButton}>
          <Text style={styles.buyUpgradeText}>Buy!</Text>
        </View>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/images/background.png')} style={styles.backgroundImage}/>
      <View style={styles.backgroundOverlay}/>
      
      <View style={styles.upgradesWrapper}>
        <View style={styles.upgradesHeaderWrapper}>
          <Text style={styles.upgradesHeaderText}>Upgrades</Text>
        </View>

        <View style={styles.upgradeIconList}>
          <View style={styles.upgradeIconContainer}>
            <Image source={require('../../assets/images/steps.png')} style={styles.upgradeIcon}/>
          </View>
          <View style={styles.upgradeIconContainer}>
            <Image source={require('../../assets/images/trainer.png')} style={styles.upgradeIcon}/>
          </View>
        </View>

        <View style={styles.upgradesDescriptionWrapper}>
          <Text style={styles.upgradesDescriptionTitle}>The best investment you can ever make is in your own health.</Text>
          <Text style={styles.upgradesDescriptionBody}>Spend your hard earned steps to give your followers a boost.</Text>
        </View>

        <ScrollView
          style={styles.upgradeList}
          contentInsetAdjustmentBehavior='automatic'
          showsVerticalScrollIndicator={false}
        >
          { CurrencyUpgrades.map(upgrade => {

            const generator = CURRENCY_GENERATORS.find(generator => generator.id == upgrade.generatorId);
            
            if (generator) {
              return (
                <Upgrade
                  key={`${upgrade.priceCoefficient}-${upgrade.priceScale}`}
                  title={generator.name}
                  description={`${generator.name} steps x3`}
                  priceCoefficient={upgrade.priceCoefficient}
                  priceScale={upgrade.priceScale}
                  image={generator.image}
                />
              )
            }
          })}
        </ScrollView>


      </View>



    </SafeAreaView>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: 2000,
    height: 2000,
  },
  backgroundOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    opacity: .6,
  },
  upgradesWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  // Upgrades Header
  upgradesHeaderWrapper: {
    width: '50%',
    height: '8%',
    backgroundColor: colors.orange3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  upgradesHeaderText: {
    fontFamily: 'oleo-script-bold',
    color: colors.white,
    fontSize: '1.5rem',
  },

  // Upgrade Type
  upgradeIconList: {
    marginTop: 10,
    flexDirection: 'row',
  },
  upgradeIconContainer: {
    height: 64,
    width: 64,
    backgroundColor: colors.gray4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    marginLeft: 10,
  },
  upgradeIcon: {
    height: 45,
    width: 45,
  },

  // Upgrades Description
  upgradesDescriptionWrapper: {
    marginTop: 10,
    width: '90%',
    height: '10%',
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradesDescriptionTitle: {
    fontFamily: 'oleo-script',
    color: colors.orange3,
  },
  upgradesDescriptionBody: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
  },

  // Upgrades
  upgradeList: {
    marginTop: 10,
  },
  upgradeWrapper: {
    marginTop: 10,
    width: '90%',
    height: '5rem',
    borderRadius: 10,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  generatorIcon: {
    height: 64,
    width: 64,
    marginLeft: 10,
  },
  upgradeTextWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  upgradeTitle: {
    fontFamily: 'oleo-script',
    color: colors.orange3,
  },
  upgradeDescription: {

  },
  upgradePrice: {

  },

  buyUpgradeButton: {
    marginRight: 10,
    backgroundColor: colors.orange3,
    width: 100,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyUpgradeText: {
    fontFamily: 'oleo-script',
    color: colors.white,
    fontSize: '1.5rem',
  }

});
