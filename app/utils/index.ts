/// toFixed doesn't work for all cases to round up numbers
/// https://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places
export const round = (number: number, decimals = 1): number => {
  const roundedNum =  Math.round(Number(`${number}e${decimals}`));
  return Number(
    Number(`${roundedNum}e-${decimals}`).toFixed(decimals)
  );
};