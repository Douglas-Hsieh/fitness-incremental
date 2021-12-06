import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet} from "react-native";

export const StatsScreen = () => {
  const [steps, setSteps] = useState<number>();

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>{steps}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
