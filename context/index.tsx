"use client";

import { calcQuarter, getThaiYear, quarterMap } from "@/lib/quarter";
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
  const currentYear = getThaiYear(fullYear).yearSlice;
  const res = quarterMap(fullYear);
  const startDate = moment(res[calcQuarter() - 1].startDate);
  const now = moment();

  let qtr = 1;
  if (now >= startDate) {
    qtr = calcQuarter();
  }

  const [year, setYear] = useState(currentYear);
  const [quarter, setQuarter] = useState(qtr);

  return (
    <FilterContext.Provider value={{ year, quarter, setYear, setQuarter }}>
      {children}
    </FilterContext.Provider>
  );
}
