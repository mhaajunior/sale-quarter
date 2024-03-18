import { ReportForm } from "@/types/schemas/validationSchema";
import { between, currencyToNumber } from "./common";
import { FormErrors } from "@/types/dto/common";
import { Role } from "@/types/dto/role";

export const cleansingFormData = (data: ReportForm) => {
  if (data.R1_temp) data.R1 = currencyToNumber(data.R1_temp);
  if (data.R2_temp) data.R2 = currencyToNumber(data.R2_temp);
  if (data.R3_temp) data.R3 = currencyToNumber(data.R3_temp);
  if (data.STO_temp) data.STO = currencyToNumber(data.STO_temp);

  return data;
};

export const checkErrorFromRole = (
  data: ReportForm,
  role: Role,
  username: string,
  mode: number
) => {
  let errData: FormErrors[] = [];
  const { TSIC_R, SIZE_R, P1, P2, P3, P4 } = data;
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

      if (P4 !== username) {
        errData.push({
          label: ["P4"],
          message: "กรุณากรอก P4 ให้ถูกต้อง",
        });
      }
    }
  }
  let res: FormErrors[] = [];
  if (role) {
    if (mode === 1) {
      res = consistencyCheck1(data);
    } else {
      res = consistencyCheck2(data);
    }
  }
  errData = [...errData, ...res];
  return errData;
};

export const consistencyCheck1 = (data: ReportForm) => {
  const errData: FormErrors[] = [];
  const { SIZE_R, EMP, TYPE, TSIC_R, STO_temp, DAY } = data;

  if (EMP) {
    const str = `Err SIZE_R = ${SIZE_R}, `;
    if (between(EMP, 1, 5) && Number(SIZE_R) !== 1) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 01",
      });
    } else if (between(EMP, 6, 10) && Number(SIZE_R) !== 2) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 02",
      });
    } else if (between(EMP, 11, 15) && Number(SIZE_R) !== 3) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 03 ",
      });
    } else if (between(EMP, 16, 20) && Number(SIZE_R) !== 4) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 04 ",
      });
    } else if (between(EMP, 21, 25) && Number(SIZE_R) !== 5) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 05 ",
      });
    } else if (between(EMP, 26, 30) && Number(SIZE_R) !== 6) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 06 ",
      });
    } else if (between(EMP, 31, 50) && Number(SIZE_R) !== 7) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 07 ",
      });
    } else if (between(EMP, 51, 100) && Number(SIZE_R) !== 8) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 08 ",
      });
    } else if (between(EMP, 101, 200) && Number(SIZE_R) !== 9) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 09 ",
      });
    } else if (between(EMP, 201, 500) && Number(SIZE_R) !== 10) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 10 ",
      });
    } else if (between(EMP, 501, 1000) && Number(SIZE_R) !== 11) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 11 ",
      });
    } else if (EMP > 1000 && Number(SIZE_R) !== 12) {
      errData.push({
        label: ["SIZE_R", "EMP"],
        message: str + "Err EMP = 12 ",
      });
    }
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
  } else {
    errData.push({
      label: ["TYPE"],
      message: "กรุณากรอก TYPE",
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
