import Scale from "../../assets/data/Scale";


export const numberToHumanFormat = (number: number, smallNumberFractionDigits: number = 2, fractionDigits: number = 3): [string, string] => {
  if (number === undefined) {
    return ['NaN', 'NaN'];
  }

  // e.g. number = 12,345 == 1.2345e+4
  const [coefficient, scale] = (number).toExponential().split('e').map(Number); // [1.2345, 4]
  const roundedDownDigits = (scale % 3);
  const roundedDownScale = scale - roundedDownDigits; // 4 - 1 == 3

  if (roundedDownScale === 0 || roundedDownScale === 3) {
    const coeffString = number.toFixed(smallNumberFractionDigits)
    const coeffStringWithCommas = coeffString.replace(/\B(?=(\d{3})+(?!\d))/g, ",")  // add commas
    return [coeffStringWithCommas, '']  // ['123,456', '']
  }

  // ['1.2345', 'million']
  return [(coefficient * Math.pow(10, roundedDownDigits)).toFixed(fractionDigits), Scale.get(roundedDownScale)!];
};
