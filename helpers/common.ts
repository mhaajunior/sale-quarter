export const removeNonNumeric = (x: string) => x.replace(/[^0-9]/g, "");

export const numberWithCommas = (x: string | number) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const currencyToNumber = (x: string) => {
  if (!x) {
    return 0;
  }
  return parseFloat(x.replace(/,/g, ""));
};

export const isNumNull = (x: number | undefined) => {
  if (!x) {
    return 0;
  }
  return x;
};

export const between = (x: number, min: number, max: number) => {
  return x >= min && x <= max;
};
