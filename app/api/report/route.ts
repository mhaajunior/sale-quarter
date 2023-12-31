import { padZero } from "@/helpers/common";
import prisma from "@/prisma/db";
import { CompanyReport } from "@/types/report";
import { createReportSchema } from "@/types/validationSchemas";
import { rangeCheck } from "@/utils/rangeCheck";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const mode = req.headers.get("mode");

  const validation = createReportSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const {
    ID,
    REG,
    CWT,
    AMP,
    TAM,
    MUN,
    EA,
    VIL,
    TSIC_R,
    TSIC_L,
    SIZE_R,
    SIZE_L,
    NO,
    QTR,
    YR,
    ENU,
    TITLE,
    RANK,
    FIRSTNAME,
    LASTNAME,
    EST_TITLE,
    EST_NAME,
    ADD_NO,
    BUILDING,
    ROOM,
    STREET,
    BLK,
    SOI,
    SUB_DIST,
    DISTRICT,
    PROVINCE,
    POST_CODE,
    TEL_NO,
    E_MAIL,
    WEBSITE,
    SOCIAL,
    TSIC_CHG,
    LG,
    LG1,
    LG1_temp,
    LG2,
    LG3,
    LG4,
    DES_TYPE,
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
    OP1,
    OP2,
    OP3,
    OP4,
    OP5,
    OP6,
    OP7,
    OP8,
    OP9,
    OP10,
    OP11,
    OP12,
    P1,
    P2,
    P3,
    P4,
  } = body as CompanyReport;

  let si1 = null;
  let si2 = null;
  let si3 = null;
  let si4 = null;
  let si5 = null;
  let si6 = null;
  let si7 = null;

  if (SI === 2) {
    if (SI1) {
      si1 = 1;
    } else {
      si1 = 0;
    }
    if (SI2) {
      si2 = 1;
    } else {
      si2 = 0;
    }
    if (SI3) {
      si3 = 1;
    } else {
      si3 = 0;
    }
    if (SI4) {
      si4 = 1;
    } else {
      si4 = 0;
    }
    if (SI5) {
      si5 = 1;
    } else {
      si5 = 0;
    }
    if (SI6) {
      si6 = 1;
    } else {
      si6 = 0;
    }
    if (SI7) {
      si7 = 1;
    } else {
      si7 = 0;
    }
  }

  try {
    await prisma.report.upsert({
      where: { uniqueReport: { ID, YR, QTR } },
      update: {
        AMP: padZero(AMP, rangeCheck.AMP),
        TAM: padZero(TAM, rangeCheck.TAM),
        MUN,
        EA: padZero(EA, rangeCheck.EA),
        VIL: padZero(VIL, rangeCheck.VIL),
        TSIC_R,
        SIZE_R: padZero(SIZE_R, rangeCheck.SIZE_R),
        ENU: padZero(ENU, rangeCheck.ENU),
        TITLE,
        RANK,
        FIRSTNAME,
        LASTNAME,
        EST_TITLE,
        EST_NAME,
        ADD_NO,
        BUILDING,
        ROOM,
        STREET,
        BLK,
        SOI,
        SUB_DIST,
        DISTRICT,
        PROVINCE,
        POST_CODE,
        TEL_NO,
        E_MAIL,
        WEBSITE,
        SOCIAL,
        TSIC_CHG,
        LG: LG && padZero(LG, rangeCheck.LG),
        LG1,
        LG1_temp,
        LG2,
        LG3,
        LG4,
        DES_TYPE,
        TYPE,
        M1,
        M2,
        M3,
        R1,
        R2,
        R3,
        TR,
        SI,
        ITR: ITR && padZero(ITR, rangeCheck.ITR),
        SI1: si1,
        SI2: si2,
        SI3: si3,
        SI4: si4,
        SI5: si5,
        SI6: si6,
        SI7: si7,
        SI8,
        SI11: SI11 && padZero(SI11, rangeCheck.SI11),
        SI22: SI22 && padZero(SI22, rangeCheck.SI22),
        SI33: SI33 && padZero(SI33, rangeCheck.SI33),
        SI44: SI44 && padZero(SI44, rangeCheck.SI44),
        SI55: SI55 && padZero(SI55, rangeCheck.SI55),
        SI66: SI66 && padZero(SI66, rangeCheck.SI66),
        SI77: SI77 && padZero(SI77, rangeCheck.SI77),
        F1: F1 && padZero(F1, rangeCheck.F1),
        F2: F2 && padZero(F2, rangeCheck.F2),
        F3: F3 && padZero(F3, rangeCheck.F3),
        F4: F4 && padZero(F4, rangeCheck.F4),
        F5: F5 && padZero(F5, rangeCheck.F5),
        CHG,
        CIN: CIN && padZero(CIN, rangeCheck.CIN),
        CDE: CDE && padZero(CDE, rangeCheck.CDE),
        FAC: FAC && padZero(FAC, rangeCheck.FAC),
        FAC_1,
        PRVS,
        PIN: PIN && padZero(PIN, rangeCheck.PIN),
        PDE: PDE && padZero(PDE, rangeCheck.PDE),
        EMP,
        STO: STO?.toString(),
        DAY,
        OP1,
        OP2,
        OP3,
        OP4,
        OP5,
        OP6,
        OP7,
        OP8,
        OP9,
        OP10,
        OP11,
        OP12,
        P1,
        P2,
        P3,
        P4,
      },
      create: {
        ID,
        REG,
        CWT,
        AMP: padZero(AMP, rangeCheck.AMP),
        TAM: padZero(TAM, rangeCheck.TAM),
        MUN,
        EA: padZero(EA, rangeCheck.EA),
        VIL: padZero(VIL, rangeCheck.VIL),
        TSIC_R,
        TSIC_L,
        SIZE_R: padZero(SIZE_R, rangeCheck.SIZE_R),
        SIZE_L: padZero(SIZE_L, rangeCheck.SIZE_L),
        NO: padZero(NO, rangeCheck.NO),
        QTR,
        YR,
        ENU: padZero(ENU, rangeCheck.ENU),
        TITLE,
        RANK,
        FIRSTNAME,
        LASTNAME,
        EST_TITLE,
        EST_NAME,
        ADD_NO,
        BUILDING,
        ROOM,
        STREET,
        BLK,
        SOI,
        SUB_DIST,
        DISTRICT,
        PROVINCE,
        POST_CODE,
        TEL_NO,
        E_MAIL,
        WEBSITE,
        SOCIAL,
        TSIC_CHG,
        LG: LG && padZero(LG, rangeCheck.LG),
        LG1,
        LG1_temp,
        LG2,
        LG3,
        LG4,
        DES_TYPE,
        TYPE,
        M1,
        M2,
        M3,
        R1,
        R2,
        R3,
        TR,
        SI,
        ITR: ITR && padZero(ITR, rangeCheck.ITR),
        SI1: si1,
        SI2: si2,
        SI3: si3,
        SI4: si4,
        SI5: si5,
        SI6: si6,
        SI7: si7,
        SI8,
        SI11: SI11 && padZero(SI11, rangeCheck.SI11),
        SI22: SI22 && padZero(SI22, rangeCheck.SI22),
        SI33: SI33 && padZero(SI33, rangeCheck.SI33),
        SI44: SI44 && padZero(SI44, rangeCheck.SI44),
        SI55: SI55 && padZero(SI55, rangeCheck.SI55),
        SI66: SI66 && padZero(SI66, rangeCheck.SI66),
        SI77: SI77 && padZero(SI77, rangeCheck.SI77),
        F1: F1 && padZero(F1, rangeCheck.F1),
        F2: F2 && padZero(F2, rangeCheck.F2),
        F3: F3 && padZero(F3, rangeCheck.F3),
        F4: F4 && padZero(F4, rangeCheck.F4),
        F5: F5 && padZero(F5, rangeCheck.F5),
        CHG,
        CIN: CIN && padZero(CIN, rangeCheck.CIN),
        CDE: CDE && padZero(CDE, rangeCheck.CDE),
        FAC: FAC && padZero(FAC, rangeCheck.FAC),
        FAC_1,
        PRVS,
        PIN: PIN && padZero(PIN, rangeCheck.PIN),
        PDE: PDE && padZero(PDE, rangeCheck.PDE),
        EMP,
        STO: STO?.toString(),
        DAY,
        OP1,
        OP2,
        OP3,
        OP4,
        OP5,
        OP6,
        OP7,
        OP8,
        OP9,
        OP10,
        OP11,
        OP12,
        P1,
        P2,
        P3,
        P4,
      },
    });

    if (mode === "create") {
      let updateObj = {};
      switch (QTR) {
        case 1:
          updateObj = { isSendQtr1: true };
          break;
        case 2:
          updateObj = { isSendQtr2: true };
          break;
        case 3:
          updateObj = { isSendQtr3: true };
          break;
        case 4:
          updateObj = { isSendQtr4: true };
          break;
        default:
          return NextResponse.json("ไตรมาสไม่ถูกต้แง", { status: 400 });
      }

      await prisma.reportStatus.update({
        where: {
          yearID: { ID, year: YR },
        },
        data: updateObj,
      });
    }

    return NextResponse.json("สร้างแบบฟอร์มสำเร็จ");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
