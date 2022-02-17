import React, { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import colors from "../../assets/colors/colors";

interface GeneratorIconProps {
  image: any,
  hasOverlay: boolean,
}

export const GeneratorIcon = memo(({image, hasOverlay}: GeneratorIconProps) => {
  return (
    <>
      <View style={styles.iconContainer1}>
        <View style={styles.iconContainer2}>
          <View style={styles.iconContainer3}>
            <Image source={image} style={styles.icon}/>
          </View>
        </View>
      </View>
      {hasOverlay &&
        <View style={styles.overlay}/>
      }
    </>
)})

const ICON_HEIGHT = 80
const ICON_WIDTH = 80
const ICON_BORDER_RADIUS = 60

const styles = StyleSheet.create({
  iconContainer1: {
    height: ICON_HEIGHT,
    width: ICON_WIDTH,
    backgroundColor: colors.blue3,
    borderRadius: ICON_BORDER_RADIUS,
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
  overlay: {
    position: 'absolute',
    height: ICON_HEIGHT,
    width: ICON_WIDTH,
    borderRadius: ICON_BORDER_RADIUS,
    backgroundColor: colors.black,
    opacity: .5,
  },
})