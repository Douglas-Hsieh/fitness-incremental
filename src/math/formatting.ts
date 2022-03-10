import moment from "moment";
import Scale from "../../assets/data/Scale";

export const numberToHumanFormat = (number: number, smallNumberFractionDigits: number = 2, fractionDigits: number = 3): [string, string] => {
  if (number === undefined) {
    return ['NaN', 'NaN'];
  }

  // e.g. number = 12,345 == 1.2345e+4
  const [coefficient, scale] = (number).toExponential().split('e').map(Number); // [1.2345, 4]
  const roundedDownDigits = (scale % 3);
  const roundedDownScale = scale - roundedDownDigits; // 4 - 1 == 3

  if (roundedDownScale < 0) {
    return ['0', '']
  }

  if (roundedDownScale === 0 || roundedDownScale === 3) {
    const coeffString = number.toFixed(smallNumberFractionDigits)
    const coeffStringWithCommas = coeffString.replace(/\B(?=(\d{3})+(?!\d))/g, ",")  // add commas
    return [coeffStringWithCommas, '']  // ['123,456', '']
  }

  // ['1.2345', 'million']
  return [(coefficient * Math.pow(10, roundedDownDigits)).toFixed(fractionDigits), Scale.get(roundedDownScale)!];
};

export const dateToYYYYMMDDFormat = (date: Date | string) => {
  return moment(date).format('YYYY-MM-DD')  // e.g. 2022-02-24
}

export const dateToDDDMMMMDFormat = (date: Date | string) => {
  return moment(date).format('ddd, MMMM D')  // e.g. Wed, February 23
}

export const secondsToHumanDateFormat = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  seconds = (seconds % 86400);
  const hours = Math.floor(seconds / 3600)
  seconds = (seconds % 3600)
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)
  const timeLeft = `${days}d ${hours}h ${minutes}m ${seconds}s`
  return timeLeft
}