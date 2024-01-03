import { ReportForm } from "@/types/validationSchemas";
import { currencyToNumber } from "./common";

export const validateFormData = (data: ReportForm) => {
  if (data.R1_temp) data.R1 = currencyToNumber(data.R1_temp);
  if (data.R2_temp) data.R2 = currencyToNumber(data.R2_temp);
  if (data.R3_temp) data.R3 = currencyToNumber(data.R3_temp);
  if (data.STO_temp) data.STO = currencyToNumber(data.STO_temp);
  delete data.R1_temp;
  delete data.R2_temp;
  delete data.R3_temp;
  delete data.STO_temp;
  delete data.LG1_temp;

  return data;
};
