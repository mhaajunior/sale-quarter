"use client";

import { checkDateBetween, getThaiYear } from "@/lib/quarter";
import moment from "moment";
import {
  Dispatch,
  SetStateAction,
  createContext,
  PropsWithChildren,
  useState,
} from "react";

export interface FilterContent {
  year: number;
  quarter: number;
  setYear: Dispatch<SetStateAction<number>>;
  setQuarter: Dispatch<SetStateAction<number>>;
}

export const FilterContext = createContext<FilterContent>({
  year: getThaiYear(new Date().getFullYear()).yearSlice,
  quarter: 1,
  setYear: (year) => {},
  setQuarter: (quarter) => {},
});

export default function FilterProvider({ children }: PropsWithChildren) {
  const fullYear = new Date().getFullYear();
  const startDate = `${fullYear}-01-01`;
  const lastDate = `${fullYear}-03-31`;
  let currentYear = getThaiYear(fullYear).yearSlice;
  const currentDate = moment().format("YYYY-MM-DD");
  if (checkDateBetween(currentDate, startDate, lastDate)) {
    currentYear--;
  }

  let qtr;
  if (checkDateBetween(currentDate, `${fullYear}-02-01`, `${fullYear}-04-30`)) {
    qtr = 1;
  } else if (
    checkDateBetween(currentDate, `${fullYear}-05-01`, `${fullYear}-07-31`)
  ) {
    qtr = 2;
  } else if (
    checkDateBetween(currentDate, `${fullYear}-08-01`, `${fullYear}-10-31`)
  ) {
    qtr = 3;
  } else {
    qtr = 4;
  }

  const [year, setYear] = useState(currentYear);
  const [quarter, setQuarter] = useState(qtr);

  return (
    <FilterContext.Provider value={{ year, quarter, setYear, setQuarter }}>
      {children}
    </FilterContext.Provider>
  );
}
