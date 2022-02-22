import GoogleFit, { BucketUnit, Scopes } from "react-native-google-fit";

export const GOOGLE_FIT_AUTHORIZATION_OPTIONS = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_ACTIVITY_WRITE,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_BODY_WRITE,
    Scopes.FITNESS_LOCATION_READ,
  ],
}

export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR
export const WEEK = 7 * DAY

const SOURCE_ESTIMATED_STEPS = 'com.google.android.gms:estimated_steps'  // Google Fit app uses this source

export const getStepsBetween = async (start: Date, end: Date) => {

  const opt = {
    startDate: start.toISOString(), // required ISO8601Timestamp
    endDate: end.toISOString(), // required ISO8601Timestamp
    bucketUnit: BucketUnit.HOUR, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
    bucketInterval: 1, // optional - default 1. 
  };

  return await GoogleFit.getDailyStepCountSamples(opt)
    .then(stepsResponseList => {
      const stepsResponse = stepsResponseList.find(stepsResponse => stepsResponse.source === SOURCE_ESTIMATED_STEPS);

      if (stepsResponse === undefined) {
        throw new Error(`No steps response found for source ${SOURCE_ESTIMATED_STEPS}`)
      }

      let steps = 0
      if (stepsResponse.steps.length > 0) {
        steps = stepsResponse.steps.map(daySteps => daySteps.value).reduce((s1, s2) => s1 + s2)
      }
      console.log(`Steps between ${opt.startDate} and ${opt.endDate}:`, steps)

      return steps
    })
}