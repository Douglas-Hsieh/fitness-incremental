import React, { memo } from "react"
import { StyleSheet, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import colors from "../../assets/colors/colors";

interface DescriptionProps {
  title: string;
  body: string;
}

export const Description = memo(({title, body}: DescriptionProps) => (
  <View style={styles.descriptionWrapper}>
    <Text style={styles.descriptionTitle}>{title}</Text>
    <Text style={styles.descriptionBody}>{body}</Text>
  </View>
))

const styles = EStyleSheet.create({
    descriptionWrapper: {
      marginTop: 10,
      width: '90%',
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    descriptionTitle: {
      fontFamily: 'oleo-script',
      color: colors.orange3,
    },
    descriptionBody: {
      marginTop: 5,
      textAlign: 'center',
      fontSize: 12,
    },
})