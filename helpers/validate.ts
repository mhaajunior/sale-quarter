import { ReportForm } from "@/types/validationSchemas";
import { currencyToNumber, isNumNull } from "./currency";

export const validateFormData = (data: ReportForm) => {
  console.log(data);
  const errData: any = {};

  if (data.R1_temp) data.R1 = currencyToNumber(data.R1_temp);
  if (data.R2_temp) data.R2 = currencyToNumber(data.R2_temp);
  if (data.R3_temp) data.R3 = currencyToNumber(data.R3_temp);
  if (data.STO_temp) data.STO = currencyToNumber(data.STO_temp);
  delete data.R1_temp;
  delete data.R2_temp;
  delete data.R3_temp;
  delete data.STO_temp;

  // check errors
  const {
    LG,
    LG1,
    LG2,
    LG3,
    LG4,
    TYPE,
    M1,
    M2,
    M3,
    R1,
    R2,
    R3,
    TR,
    SI,
    ITR,
    SI1,
    SI2,
    SI3,
    SI4,
    SI5,
    SI6,
    SI7,
    SI8,
    SI11,
    SI22,
    SI33,
    SI44,
    SI55,
    SI66,
    SI77,
    F1,
    F2,
    F3,
    F4,
    F5,
    CHG,
    CIN,
    CDE,
    FAC,
    FAC_1,
    PRVS,
    PIN,
    PDE,
    EMP,
    STO,
    DAY,
  } = data;

  // LG
  if (LG === 1 && !LG1) {
    errData.LG1 = { message: "กรุณากรอก LG1" };
  }
  if (LG === 2 && !LG2) {
    errData.LG2 = { message: "กรุณากรอก LG2" };
  }
  if (LG === 3 && !LG3) {
    errData.LG3 = { message: "กรุณากรอก LG3" };
  }
  if (LG === 6 && !LG4) {
    errData.LG4 = { message: "กรุณากรอก LG4" };
  }

  // SI
  if (SI === 2) {
    if (!(SI1 || SI2 || SI3 || SI4 || SI5 || SI6 || SI7)) {
      errData.SI_ALL = { message: "กรุณาเลือก SI1-SI7 อย่างน้อย 1 ข้อ" };
    }
    if (SI7 && !SI8) {
      errData.SI8 = { message: "กรุณากรอก SI8" };
    }
    if (
      isNumNull(SI11) +
        isNumNull(SI22) +
        isNumNull(SI33) +
        isNumNull(SI44) +
        isNumNull(SI55) +
        isNumNull(SI66) +
        isNumNull(SI77) !==
      100
    ) {
      errData.SI_PERCENTAGE = { message: "สัดส่วนที่กรอกต้องรวมกันได้ 100%" };
    }
    if (
      isNumNull(F1) +
        isNumNull(F2) +
        isNumNull(F3) +
        isNumNull(F4) +
        isNumNull(F5) !==
      100
    ) {
      errData.SI_FEE = { message: "ค่าธรรมเนียมที่กรอกต้องรวมกันได้ 100%" };
    }

    //FAC
    if (FAC === 10 && !FAC_1) {
      errData.FAC_1 = { message: "กรุณากรอก FAC_1" };
    }
  }
  console.log(errData);
  return errData;
};
