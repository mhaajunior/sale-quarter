const year = new Date().getFullYear();
export const thaiYear = year + 543;

const quarterMap = {
  1: {
    startDate: `${year}-01-01`,
    endDate: `${year}-03-31`,
    monthRange: ["ม.ค.", "ก.พ.", "มี.ค."],
    rangeVal: ["01", "02", "03"],
  },
  2: {
    startDate: `${year}-04-01`,
    endDate: `${year}-06-30`,
    monthRange: ["เม.ย.", "พ.ค.", "มิ.ย."],
    rangeVal: ["04", "05", "06"],
  },
  3: {
    startDate: `${year}-07-01`,
    endDate: `${year}-09-30`,
    monthRange: ["ก.ค.", "ส.ค.", "ก.ย."],
    rangeVal: ["07", "08", "09"],
  },
  4: {
    startDate: `${year}-10-01`,
    endDate: `${year}-12-31`,
    monthRange: ["ต.ค.", "พ.ย.", "ธ.ค."],
    rangeVal: ["10", "11", "12"],
  },
};

export const calcQuarter = () => {
  const month = new Date().getMonth();
  const quarter = Math.ceil(month / 3);
  return quarter;
};

export const getQuarterDate = () => {
  const quarter = calcQuarter();
  return quarterMap[quarter as keyof typeof quarterMap];
};
