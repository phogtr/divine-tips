export const rounding = (value: number, places = 2) => {
  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
};
