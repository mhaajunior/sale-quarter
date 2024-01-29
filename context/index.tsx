"use client";

import { getThaiYear } from "@/lib/quarter";
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
  const [year, setYear] = useState(
    getThaiYear(new Date().getFullYear()).yearSlice
  );
  const [quarter, setQuarter] = useState(1);

  return (
    <FilterContext.Provider value={{ year, quarter, setYear, setQuarter }}>
      {children}
    </FilterContext.Provider>
  );
}
