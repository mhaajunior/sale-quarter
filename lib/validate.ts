import { ReportForm } from "@/types/schemas/validationSchema";
import { between, currencyToNumber } from "./common";
import { FormErrors } from "@/types/dto/common";
import { Role } from "@prisma/client";

export const validateFormData = (data: ReportForm) => {
  if (data.R1_temp) data.R1 = currencyToNumber(data.R1_temp);
  if (data.R2_temp) data.R2 = currencyToNumber(data.R2_temp);
  if (data.R3_temp) data.R3 = currencyToNumber(data.R3_temp);
  if (data.STO_temp) data.STO = currencyToNumber(data.STO_temp);

  return data;
};

export const checkErrorFromRole = (
  data: ReportForm,
  role: Role | undefined,
  mode: number
) => {
  let errData: FormErrors[] = [];
  const { TSIC_R, SIZE_R, TYPE, P1, P2, P3, P4 } = data;
  if (role) {
    if (!TSIC_R) {
      errData.push({
        label: ["TSIC_R"],
        message: "กรุณากรอก TSIC_R",
      });
    }

    if (!SIZE_R) {
      errData.push({
        label: ["SIZE_R"],
        message: "กรุณากรอก SIZE_R",
      });
    }

    if (!TYPE) {
      errData.push({
        label: ["TYPE"],
        message: "กรุณากรอก TYPE",
      });
    }

    if (role === Role.INTERVIEWER) {
      if (!(P1 || P2 || P3)) {
        errData.push({
          label: ["P1", "P2", "P3"],
          message: "กรุณากรอกรหัสเจ้าหน้าที่อย่างน้อย 1 ช่อง",
        });
      }
    } else if (role === Role.SUPERVISOR) {
      if (!P4) {
        errData.push({
          label: ["P4"],
          message: "กรุณากรอก P4",
        });
      }
    }
  }
  let res;
  if (mode === 1) {
    res = consistencyCheck1(data);
  } else {
    res = consistencyCheck2(data);
  }
  errData = [...errData, ...res];
  return errData;
};

export const consistencyCheck1 = (data: ReportForm) => {
  const errData: FormErrors[] = [];
  const { SIZE_R, EMP, TYPE, TSIC_R, STO_temp, DAY } = data;

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

  if (TSIC_R) {
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

    if (
      between(TSIC_R, 47111, 47991) &&
      (!STO_temp ||
        currencyToNumber(STO_temp) <= 0 ||
        [
          9, 99, 999, 9999, 99999, 999999, 9999999, 99999999, 999999999,
          9999999999, 99999999999, 999999999999,
        ].includes(currencyToNumber(STO_temp)))
    ) {
      errData.push({
        label: ["TSIC_R", "STO"],
        message: "TSIC_R กับ STO ไม่สอดคล้องกัน",
      });
    }

    if (between(TSIC_R, 55101, 96309) && STO_temp) {
      errData.push({
        label: ["TSIC_R", "STO"],
        message: "TSIC_R กับ STO ไม่สอดคล้องกัน",
      });
    }

    if (
      STO_temp &&
      currencyToNumber(STO_temp) > 0 &&
      between(TSIC_R, 47111, 47991) &&
      !DAY
    ) {
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
      STO_temp &&
      currencyToNumber(STO_temp) > 0 &&
      between(TSIC_R, 47111, 47991) &&
      !(DAY !== 1 && DAY !== 999)
    ) {
      errData.push({
        label: ["TSIC_R", "STO", "DAY"],
        message: "TSIC_R, STO กับ DAY ไม่สอดคล้องกัน",
      });
    }
  }

  if (TYPE) {
    if (TYPE !== 1) {
      if (STO_temp || DAY) {
        errData.push({
          label: ["TYPE", "STO", "DAY"],
          message: "ถ้า TYPE ไม่เป็นขายปลีก ห้ามมีค่า STO และ DAY",
        });
      }
    } else {
      if (!STO_temp || !DAY) {
        errData.push({
          label: ["TYPE", "STO", "DAY"],
          message: "ถ้า TYPE เป็นขายปลีก ต้องมีค่า STO และ DAY",
        });
      }
    }
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
