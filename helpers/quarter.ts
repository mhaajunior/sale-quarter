import moment from "moment";

export const quarterMap = (year: number) => {
  return [
    {
      startDate: `${year}-01-01`,
      endDate: `${year}-03-31`,
      monthRange: ["ม.ค.", "ก.พ.", "มี.ค."],
      rangeVal: ["01", "02", "03"],
      formSubmittedRange: [`${year}-01-01`, `${year}-04-20`],
    },
    {
      startDate: `${year}-04-01`,
      endDate: `${year}-06-30`,
      monthRange: ["เม.ย.", "พ.ค.", "มิ.ย."],
      rangeVal: ["04", "05", "06"],
      formSubmittedRange: [`${year}-04-01`, `${year}-07-20`],
    },
    {
      startDate: `${year}-07-01`,
      endDate: `${year}-09-30`,
      monthRange: ["ก.ค.", "ส.ค.", "ก.ย."],
      rangeVal: ["07", "08", "09"],
      formSubmittedRange: [`${year}-07-01`, `${year}-10-20`],
    },
    {
      startDate: `${year}-10-01`,
      endDate: `${year}-12-31`,
      monthRange: ["ต.ค.", "พ.ย.", "ธ.ค."],
      rangeVal: ["10", "11", "12"],
      formSubmittedRange: [`${year}-10-01`, `${year + 1}-01-20`],
    },
  ];
};

export const calcQuarter = () => {
  const month = new Date().getMonth() + 1;
  const quarter = Math.ceil(month / 3);
  return quarter;
};

export const checkDateBetween = (
  date1: string,
  date2: string,
  date3: string
) => {
  return moment(date1).isBetween(date2, date3);
};
