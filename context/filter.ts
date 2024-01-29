import { createContext } from "react";

const FilterContext = createContext({
  quarter: null,
  year: null,
  provinceId: null,
  provinceName: null,
});

export default FilterContext;
