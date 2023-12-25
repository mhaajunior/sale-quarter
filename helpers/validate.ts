import { ReportForm } from "@/types/validationSchemas";
import { between, currencyToNumber, isNumNull } from "./common";

export const validateFormData = (data: ReportForm) => {
  if (data.R1_temp) data.R1 = currencyToNumber(data.R1_temp);
  if (data.R2_temp) data.R2 = currencyToNumber(data.R2_temp);
  if (data.R3_temp) data.R3 = currencyToNumber(data.R3_temp);
  if (data.STO_temp) data.STO = currencyToNumber(data.STO_temp);
  delete data.R1_temp;
  delete data.R2_temp;
  delete data.R3_temp;
  delete data.STO_temp;

  if (data.CHG === 1) {
    delete data.FAC;
    delete data.FAC_1;
  }

  if (data.SI === 1) {
    delete data.ITR;
    delete data.SI1;
    delete data.SI2;
    delete data.SI3;
    delete data.SI4;
    delete data.SI5;
    delete data.SI6;
    delete data.SI7;
    delete data.SI8;
    delete data.SI11;
    delete data.SI22;
    delete data.SI33;
    delete data.SI44;
    delete data.SI55;
    delete data.SI66;
    delete data.SI77;
    delete data.F1;
    delete data.F2;
    delete data.F3;
    delete data.F4;
    delete data.F5;
  }

  return consistencyCheck(data);
};

export const consistencyCheck = (data: ReportForm) => {
  const errData: any = {};
  const {
    SIZE_R,
    EMP,
    TYPE,
    TSIC_R,
    TR,
    R1,
    R2,
    R3,
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
    LG,
    CHG,
    PRVS,
  } = data;

  if (!LG) {
    errData.LG = { message: "กรุณากรอก LG" };
  }
  if (!TYPE) {
    errData.TYPE = { message: "กรุณากรอก TYPE" };
  }
  if (!SI) {
    errData.SI = { message: "กรุณากรอก SI" };
  }
  if (!CHG) {
    errData.CHG = { message: "กรุณากรอก CHG" };
  }
  if (!PRVS) {
    errData.PRVS = { message: "กรุณากรอก PRVS" };
  }

  if (SI === 2) {
    if (!(SI1 || SI2 || SI3 || SI4 || SI5 || SI6 || SI7)) {
      errData.SI_ALL = { message: "กรุณาเลือก SI1-SI7 อย่างน้อย 1 ข้อ" };
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
    errData.SIZE_R = { message: "SIZE_R กับ EMP ไม่สอดคล้องกัน" };
    errData.EMP = { message: "SIZE_R กับ EMP ไม่สอดคล้องกัน" };
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
    errData.TYPE = { message: "TYPE กับ TSIC_R ไม่สอดคล้องกัน" };
    errData.TSIC_R = { message: "TYPE กับ TSIC_R ไม่สอดคล้องกัน" };
  }

  if (TR && TR !== isNumNull(R1) + isNumNull(R2) + isNumNull(R3)) {
    errData.TR = { message: "TR ไม่ถูกต้อง" };
  }

  if (between(TSIC_R, 47111, 47991) && (!STO || STO <= 0)) {
    errData.TSIC_R = { message: "TSIC_R กับ STO ไม่สอดคล้องกัน" };
    errData.STO = { message: "TSIC_R กับ STO ไม่สอดคล้องกัน" };
  }

  if (
    between(TSIC_R, 47111, 47991) &&
    (!STO ||
      [
        9, 99, 999, 9999, 99999, 999999, 9999999, 99999999, 999999999,
        9999999999, 99999999999, 999999999999,
      ].includes(STO))
  ) {
    errData.TSIC_R = { message: "TSIC_R กับ STO ไม่สอดคล้องกัน" };
    errData.STO = { message: "TSIC_R กับ STO ไม่สอดคล้องกัน" };
  }

  if (between(TSIC_R, 55101, 96309) && STO) {
    errData.TSIC_R = { message: "TSIC_R กับ STO ไม่สอดคล้องกัน" };
    errData.STO = { message: "TSIC_R กับ STO ไม่สอดคล้องกัน" };
  }

  if (STO && STO > 0 && between(TSIC_R, 47111, 47991) && !DAY) {
    errData.TSIC_R = { message: "TSIC_R, STO กับ DAY ไม่สอดคล้องกัน" };
    errData.STO = { message: "TSIC_R, STO กับ DAY ไม่สอดคล้องกัน" };
    errData.DAY = { message: "TSIC_R, STO กับ DAY ไม่สอดคล้องกัน" };
  }

  if (between(TSIC_R, 55101, 96309) && DAY) {
    errData.TSIC_R = { message: "TSIC_R กับ DAY ไม่สอดคล้องกัน" };
    errData.DAY = { message: "TSIC_R กับ DAY ไม่สอดคล้องกัน" };
  }

  if (
    STO &&
    STO > 0 &&
    between(TSIC_R, 47111, 47991) &&
    !(DAY !== 1 && DAY !== 999)
  ) {
    errData.TSIC_R = { message: "TSIC_R, STO กับ DAY ไม่สอดคล้องกัน" };
    errData.STO = { message: "TSIC_R, STO กับ DAY ไม่สอดคล้องกัน" };
    errData.DAY = { message: "TSIC_R, STO กับ DAY ไม่สอดคล้องกัน" };
  }

  return errData;
};
