import { ReportForm } from "@/types/validationSchemas";
import { assertThaiId, between, currencyToNumber, isNumNull } from "./common";
import { FormErrors } from "@/types/form";

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

export const consistencyCheck1 = (data: ReportForm) => {
  const errData: FormErrors[] = [];
  const {
    SIZE_R,
    EMP,
    TYPE,
    TSIC_R,
    STO,
    DAY,
    SI,
    SI1,
    SI2,
    SI3,
    SI4,
    SI5,
    SI6,
    SI7,
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
    LG1,
    LG1_temp,
  } = data;

  if (LG1 && LG1_temp === "1") {
    if (!assertThaiId(LG1)) {
      errData.push({ label: ["LG1"], message: "LG1 ที่กรอกไม่ถูกต้อง" });
    }
  }

  if (SI === 2) {
    if (!(SI1 || SI2 || SI3 || SI4 || SI5 || SI6 || SI7)) {
      errData.push({
        label: ["SI_ALL"],
        message: "กรุณาเลือก SI1-SI7 อย่างน้อย 1 ข้อ",
      });
    } else {
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
        errData.push({
          label: ["SI_PERCENTAGE"],
          message: "สัดส่วนที่กรอกต้องรวมกันได้ 100%",
        });
      }
      if (
        isNumNull(F1) +
          isNumNull(F2) +
          isNumNull(F3) +
          isNumNull(F4) +
          isNumNull(F5) !==
        100
      ) {
        errData.push({
          label: ["SI_FEE"],
          message: "ค่าธรรมเนียมที่กรอกต้องรวมกันได้ 100%",
        });
      }
    }
  }

  if (
    EMP &&
    ((SIZE_R === 1 && !between(EMP, 1, 5)) ||
      (SIZE_R === 2 && !between(EMP, 6, 10)) ||
      (SIZE_R === 3 && !between(EMP, 11, 15)) ||
      (SIZE_R === 4 && !between(EMP, 16, 20)) ||
      (SIZE_R === 5 && !between(EMP, 21, 25)) ||
      (SIZE_R === 6 && !between(EMP, 26, 30)) ||
      (SIZE_R === 7 && !between(EMP, 31, 50)) ||
      (SIZE_R === 8 && !between(EMP, 51, 100)) ||
      (SIZE_R === 9 && !between(EMP, 101, 200)) ||
      (SIZE_R === 10 && !between(EMP, 201, 500)) ||
      (SIZE_R === 11 && !between(EMP, 501, 1000)) ||
      (SIZE_R === 12 && EMP <= 1000))
  ) {
    errData.push({
      label: ["SIZE_R", "EMP"],
      message: "SIZE_R กับ EMP ไม่สอดคล้องกัน",
    });
  }

  if (
    (TYPE === 1 && !between(TSIC_R, 47111, 47991)) ||
    (TYPE === 2 && !between(TSIC_R, 55101, 55909)) ||
    (TYPE === 3 && !between(TSIC_R, 56101, 56302)) ||
    (TYPE === 4 && !between(TSIC_R, 59111, 63912)) ||
    (TYPE === 5 && !between(TSIC_R, 77210, 78101)) ||
    (TYPE === 6 && !between(TSIC_R, 90001, 93299)) ||
    (TYPE === 7 && !between(TSIC_R, 95210, 96309))
  ) {
    errData.push({
      label: ["TYPE", "TSIC_R"],
      message: "TYPE กับ TSIC_R ไม่สอดคล้องกัน",
    });
  }

  if (between(TSIC_R, 47111, 47991) && (!STO || STO <= 0)) {
    errData.push({
      label: ["TSIC_R", "STO"],
      message: "TSIC_R กับ STO ไม่สอดคล้องกัน",
    });
  }

  if (
    between(TSIC_R, 47111, 47991) &&
    (!STO ||
      [
        9, 99, 999, 9999, 99999, 999999, 9999999, 99999999, 999999999,
        9999999999, 99999999999, 999999999999,
      ].includes(STO))
  ) {
    errData.push({
      label: ["TSIC_R", "STO"],
      message: "TSIC_R กับ STO ไม่สอดคล้องกัน",
    });
  }

  if (between(TSIC_R, 55101, 96309) && STO) {
    errData.push({
      label: ["TSIC_R", "STO"],
      message: "TSIC_R กับ STO ไม่สอดคล้องกัน",
    });
  }

  if (STO && STO > 0 && between(TSIC_R, 47111, 47991) && !DAY) {
    errData.push({
      label: ["TSIC_R", "STO", "DAY"],
      message: "TSIC_R, STO กับ DAY ไม่สอดคล้องกัน",
    });
  }

  if (between(TSIC_R, 55101, 96309) && DAY) {
    errData.push({
      label: ["TSIC_R", "DAY"],
      message: "TSIC_R กับ DAY ไม่สอดคล้องกัน",
    });
  }

  if (
    STO &&
    STO > 0 &&
    between(TSIC_R, 47111, 47991) &&
    !(DAY !== 1 && DAY !== 999)
  ) {
    errData.push({
      label: ["TSIC_R", "STO", "DAY"],
      message: "TSIC_R, STO กับ DAY ไม่สอดคล้องกัน",
    });
  }

  return errData;
};

export const consistencyCheck2 = (data: ReportForm) => {
  const errData: FormErrors[] = [];
  const { SIZE_R, TSIC_R, TSIC_L, SIZE_L } = data;

  if (TSIC_R !== TSIC_L) {
    errData.push({
      label: ["TSIC_R", "TSIC_L"],
      message: "TSIC_R กับ TSIC_L ต้องเท่ากัน",
    });
  }

  if (SIZE_R !== SIZE_L) {
    errData.push({
      label: ["SIZE_R", "SIZE_L"],
      message: "SIZE_R กับ SIZE_L ต้องเท่ากัน",
    });
  }

  return errData;
};
