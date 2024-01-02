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

export const assertThaiId = (thaiId: string): boolean => {
  const m = thaiId.match(/(\d{12})(\d)/);
  if (!m) {
    return false;
  }
  const digits = m[1].split("");
  const sum = digits.reduce((total: number, digit: string, i: number) => {
    return total + (13 - i) * +digit;
  }, 0);
  const lastDigit = `${(11 - (sum % 11)) % 10}`;
  const inputLastDigit = m[2];
  if (lastDigit !== inputLastDigit) {
    return false;
  }
  return true;
};
