import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../assets/colors/colors";
import { CURRENCY_GENERATORS } from "../../assets/data/CurrencyGenerators";
import useInterval from "../util/useInterval";

export const HomeScreen = () => {

  const [progress, setProgress] = useState<number>(0);

  useInterval(() => {
    if (progress >= 1) {
      setProgress(0)
    } else {
      setProgress(progress + 0.01)
    }
  }, 500)

  const TopBar = () => (
    <View style={styles.topBar}>
      <View style={styles.overlay}/>
      <Image source={require('../../assets/images/male-avatar.png')} style={styles.avatar}/>
      <Image source={require('../../assets/images/steps.png')} style={styles.steps}/>
      <View style={styles.stepsCountWrapper}>
        <Text style={styles.stepsCountText}>1.398</Text>
        <Text style={styles.stepsScaleText}>Billion</Text>
      </View>
      <TouchableOpacity style={styles.buyAmountButton}>
        <Text style={styles.buyAmountBuyText}>Buy</Text>
        <Text style={styles.buyAmountAmountText}>MAX</Text>
      </TouchableOpacity>
    </View>
  )

  const IconComponent = (props: {image: any}) => (
    <View style={styles.iconContainer1}>
      <View style={styles.iconContainer2}>
        <View style={styles.iconContainer3}>
          <Image source={props.image} style={styles.icon}/>
        </View>
      </View>
    </View>
  )

  const IconProgressBarComponent = (props: {progress: number}) => (
    <View style={styles.iconProgressBarContainer}>
      <View style={[
        styles.iconProgressBar,
        {width: props.progress * styles.iconProgressBar.width},
      ]}>
      </View>
      <Text style={styles.iconProgressBarText}>50/100</Text>
    </View>
  )

  const StepProgressBarComponent = (props: {progress: number}) => (
    <View style={styles.stepProgressBarWrapper}>
      <View style={styles.stepProgressBarContainer1}>
        <View style={styles.stepProgressBarContainer2}>
          <View style={styles.stepProgressBarContainer3}>
            <View style={[
              styles.stepProgressBar,
              {width: props.progress * styles.stepProgressBar.width},
            ]}/>
          </View>
        </View>
      </View>
      <Text style={styles.stepProgressBarText}>6440.00 / step</Text>
    </View>
  )

  const BuyGeneratorButtonComponent = () => (
    <TouchableOpacity>
      <View style={styles.buyGeneratorButton1}>
        <View style={styles.buyGeneratorButton2}>
          <View style={styles.buyGeneratorBuyAmountWrapper}>
            <Text style={styles.buyGeneratorBuyText}>Buy</Text>
            <Text style={styles.buyGeneratorAmountText}>x1</Text>
          </View>
          <View style={styles.buyGeneratorPriceWrapper}>
            <Text style={styles.buyGeneratorPriceText}>2.096</Text>
            <Text style={styles.buyGeneratorPriceScaleText}>million</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const BottomBar = () => (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarOverlay}/>
      <TouchableOpacity>
        <Feather name='menu' size={50} color={'white'} style={styles.menuIcon}/>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>

        <Image source={require('../../assets/images/background.png')} style={styles.backgroundImage}/>

          <ScrollView
            contentInsetAdjustmentBehavior='automatic'
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
          >
            <View style={styles.generatorListWrapper}>
              {CURRENCY_GENERATORS.map(generator => 
                <View key={generator.id} style={styles.generatorWrapper}>
                  <View style={styles.generatorLeftWrapper}>
                    <IconComponent image={generator.image}/>
                    <IconProgressBarComponent progress={1}/>
                  </View>
                  <View style={styles.generatorRightWrapper}>
                    <StepProgressBarComponent progress={1}/>
                    <BuyGeneratorButtonComponent/>
                  </View>
                </View>
              )}
            </View>
            <View style={{height: 150}}/>
          </ScrollView>

          <TopBar/>
          <View style={{flex: 1}}/>
          <BottomBar/>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: 2000,
    height: 2000,
  },

  // Top Bar
  topBar: {
    flex: .15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    opacity: .75,
    position: 'absolute',
  },
  avatar: {
    width: 64,
    height: 64,
    marginLeft: '5%',
  },
  steps: {
    width: 25,
    height: 25,
    marginLeft: 25,
  },
  stepsCountWrapper: {
    marginLeft: 10,
    alignItems: 'center',
  },
  stepsCountText: {
    fontSize: 20,
  },
  stepsScaleText: {
  },
  buyAmountButton: {
    marginLeft: 130,
    width: 70,
    height: 50,
    backgroundColor: colors.orange2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyAmountBuyText: {
    color: colors.white,
    fontSize: 10,
  },
  buyAmountAmountText: {
    color: colors.white,
  },

  scroll: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 90,
  },
  // Generator
  generatorListWrapper: {
    marginLeft: 10,
  },
  generatorWrapper: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  generatorLeftWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  generatorRightWrapper: {
    flexDirection: 'column',
    marginLeft: 10,
  },

  // Icon
  iconContainer1: {
    height: 80,
    width: 80,
    backgroundColor: colors.blue3,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer2: {
    height: '90%',
    width: '90%',
    backgroundColor: colors.blue1,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer3: {
    height: '90%',
    width: '90%',
    backgroundColor: colors.blue2,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '80%',
    width: '80%',
  },

  // Icon Progress Bar
  iconProgressBarContainer: {
    marginTop: -20,

    width: 90,
    height: 25,
    backgroundColor: colors.blue3,
    borderRadius: 20,
    alignItems: 'center',
  },
  iconProgressBar: {
    marginTop: 2.5,
    width: 85,
    height: 20,
    backgroundColor: colors.green2,
    borderRadius: 19,
  },
  iconProgressBarText: {
    marginTop: -20,
    color: colors.white,
    textShadowColor: colors.black,
    textShadowRadius: 5,
  },

  // Step Progress Bar
  stepProgressBarWrapper: {
    alignItems: 'center',
    width: 200,
    height: 35,
  },
  stepProgressBarContainer1: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepProgressBarContainer2: {
    width: '99%',
    height: '95%',
    backgroundColor: colors.green1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepProgressBarContainer3: {
    width: '99%',
    height: '95%',
    backgroundColor: colors.white,
    borderRadius: 100,
  },
  stepProgressBar: {
    width: 200,
    height: '100%',
    backgroundColor: colors.green3,
    borderRadius: 100,
  },
  stepProgressBarText: {
    marginTop: -30,
    color: colors.black,
  },

  // Buy Button
  buyGeneratorButton1: {
    marginTop: 4,
    width: 200,
    height: 40,
    backgroundColor: colors.orange5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyGeneratorButton2: {
    width: '99%',
    height: '95%',
    backgroundColor: colors.orange3,
    borderRadius: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyGeneratorBuyAmountWrapper: {
    alignItems: 'center',
  },
  buyGeneratorBuyText: {
    color: colors.white,
  },
  buyGeneratorAmountText: {
    color: colors.white,
  },
  buyGeneratorPriceWrapper: {
    alignItems: 'center',
  },
  buyGeneratorPriceText: {
    color: colors.white,
    fontSize: 15,
  },
  buyGeneratorPriceScaleText: {
    fontSize: 10,
  },

  // Bottom Bar
  bottomBar: {
    flex: .09,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBarOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
    opacity: .5,
    position: 'absolute',
  },
  menuIcon: {
    color: colors.white,
  }


});
