"use client";

import { checkDateBetween, getThaiYear, quarterMap } from "@/lib/quarter";
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

  let qtr = 0;
  const res = quarterMap(fullYear);
  for (let i = 0; i < res.length; i++) {
    if (currentDate >= res[i].formSubmittedRange[0]) {
      qtr = i + 1;
    }
  }

  const [year, setYear] = useState(currentYear);
  const [quarter, setQuarter] = useState(qtr);

  return (
    <FilterContext.Provider value={{ year, quarter, setYear, setQuarter }}>
      {children}
    </FilterContext.Provider>
  );
}
