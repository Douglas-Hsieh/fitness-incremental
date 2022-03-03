// TODO: Unused atm. Supposed to be a view listing each day's stats

import moment from "moment"
import React, { useEffect, useState } from "react"
import { Text, View } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { StepsResponse } from "react-native-google-fit"
import colors from "../../assets/colors/colors"
import { getDailyStepsBetween } from "../google-fit/google-fit"
import { dateToDDDMMMMDFormat } from "../math/formatting"
import { Button } from "./Button"
import { DeterminateProgress } from "./DeterminateProgress"

interface DailyStepsDetailsProps {
  date: Date;
  targetSteps: number;
  distance: number;
  calories: number;
}

export const DailyStepsDetails = ({date, targetSteps, distance, calories}: DailyStepsDetailsProps) => {
  const [dailySteps, setDailySteps] = useState<StepsResponse['steps']>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [steps, setSteps] = useState<number>(0)

  useEffect(() => {
    const oneWeekBefore = new Date(Date.now() - (7 * 86400000));
    const now = new Date();
    getDailyStepsBetween(oneWeekBefore, now).then(dailySteps => setDailySteps(dailySteps))
  }, [])

  useEffect(() => {
    const dateKey = moment(selectedDate).format('YYYY-MM-DD')
    const ds = dailySteps.find(steps => steps.date === dateKey)
    if (ds) {
      setSteps(ds.value)
    }
  }, [selectedDate, dailySteps])

  let dateText = dateToDDDMMMMDFormat(date)
  const today = dateToDDDMMMMDFormat(new Date())
  if (today === dateText) {
    dateText = 'Today'
  }

  const progress = steps / targetSteps

  return (
    <View style={styles.dailyStepDetails}>
      <Text>Steps</Text>
      <Text style={styles.stepsText}>{steps}/{targetSteps}</Text>
      <View style={styles.progressBar}>
        <DeterminateProgress progress={progress}/>
      </View>
      <Button text={'Claim'} onPress={() => {}}/>
    </View>
  )
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  dailyStepDetails: {
    marginTop: 10,
    backgroundColor: colors.white,
    width: '90%',
    height: '30%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',    
  },
  dateText: {

  },
  stepsText: {
    fontSize: '1.5rem',
  },
  progressBar: {
    width: '80%',
    height: 50,
  },
  progressBarNumbers: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },

  milesAndCalories: {
    flexDirection: 'column',
  },

})