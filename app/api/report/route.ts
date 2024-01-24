import { padZero } from "@/lib/common";
import { verifyJwt } from "@/lib/jwt";
import prisma from "@/prisma/db";
import { CompanyReport } from "@/types/dto/report";
import { createReportSchema } from "@/types/schemas/validationSchema";
import { rangeCheck } from "@/utils/rangeCheck";
import { Prisma, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserRole, validateUserRole } from "../middleware";

// create and edit report
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const accessToken = req.headers.get("authorization");
  const mode = req.headers.get("mode");
  let role = null;

  const validation = createReportSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  if (accessToken) {
    role = getUserRole(accessToken);
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
    ANSWER,
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
  let p4 = P4;

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
    if (mode === "edit" && role !== Role.SUPERVISOR && role !== Role.SUBJECT) {
      const report = await prisma.report.findUnique({
        where: {
          uniqueReport: { ID, YR, QTR },
        },
        select: {
          P4: true,
        },
      });

      if (report?.P4) {
        p4 = null;
      }
    }

    await prisma.report.upsert({
      where: { uniqueReport: { ID, YR, QTR } },
      update: {
        AMP: padZero(AMP, rangeCheck.AMP),
        TAM: padZero(TAM, rangeCheck.TAM),
        MUN: MUN,
        EA: padZero(EA, rangeCheck.EA),
        VIL: padZero(VIL, rangeCheck.VIL),
        TSIC_R,
        SIZE_R: (SIZE_R && padZero(SIZE_R, rangeCheck.SIZE_R)) || null,
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
        ANSWER,
        TSIC_CHG: TSIC_CHG || null,
        LG: (LG && padZero(LG, rangeCheck.LG)) || null,
        LG1: LG1 || null,
        LG1_temp,
        LG2: LG2 || null,
        LG3: LG3 || null,
        LG4: LG4 || null,
        DES_TYPE: DES_TYPE || null,
        TYPE: TYPE || null,
        M1: M1 || null,
        M2: M2 || null,
        M3: M3 || null,
        R1: R1 || null,
        R2: R2 || null,
        R3: R3 || null,
        TR: TR || null,
        SI: SI || null,
        ITR: (ITR && padZero(ITR, rangeCheck.ITR)) || null,
        SI1: si1,
        SI2: si2,
        SI3: si3,
        SI4: si4,
        SI5: si5,
        SI6: si6,
        SI7: si7,
        SI8: SI8 || null,
        SI11: (SI11 && padZero(SI11, rangeCheck.SI11)) || null,
        SI22: (SI22 && padZero(SI22, rangeCheck.SI22)) || null,
        SI33: (SI33 && padZero(SI33, rangeCheck.SI33)) || null,
        SI44: (SI44 && padZero(SI44, rangeCheck.SI44)) || null,
        SI55: (SI55 && padZero(SI55, rangeCheck.SI55)) || null,
        SI66: (SI66 && padZero(SI66, rangeCheck.SI66)) || null,
        SI77: (SI77 && padZero(SI77, rangeCheck.SI77)) || null,
        F1: (F1 && padZero(F1, rangeCheck.F1)) || null,
        F2: (F2 && padZero(F2, rangeCheck.F2)) || null,
        F3: (F3 && padZero(F3, rangeCheck.F3)) || null,
        F4: (F4 && padZero(F4, rangeCheck.F4)) || null,
        F5: (F5 && padZero(F5, rangeCheck.F5)) || null,
        CHG: CHG || null,
        CIN: (CIN && padZero(CIN, rangeCheck.CIN)) || null,
        CDE: (CDE && padZero(CDE, rangeCheck.CDE)) || null,
        FAC: (FAC && padZero(FAC, rangeCheck.FAC)) || null,
        FAC_1: FAC_1 || null,
        PRVS: PRVS || null,
        PIN: (PIN && padZero(PIN, rangeCheck.PIN)) || null,
        PDE: (PDE && padZero(PDE, rangeCheck.PDE)) || null,
        EMP: EMP || null,
        STO: STO?.toString() || null,
        DAY: DAY || null,
        OP1: OP1 || null,
        OP2: OP2 || null,
        OP3: OP3 || null,
        OP4: OP4 || null,
        OP5: OP5 || null,
        OP6: OP6 || null,
        OP7: OP7 || null,
        OP8: OP8 || null,
        OP9: OP9 || null,
        OP10: OP10 || null,
        OP11: OP11 || null,
        OP12: OP12 || null,
        P1,
        P2,
        P3,
        P4: p4,
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
        SIZE_R: SIZE_R && padZero(SIZE_R, rangeCheck.SIZE_R),
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
        ANSWER,
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

// get all data in province for subject
export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");
  const quarter = Number(req.nextUrl.searchParams.get("quarter"));
  const province = Number(req.nextUrl.searchParams.get("province"));
  const year = Number(req.nextUrl.searchParams.get("year"));

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
  }

  if (!validateUserRole(accessToken, [Role.SUBJECT])) {
    return NextResponse.json("ไม่สามารถเข้าถึงข้อมูลได้", { status: 401 });
  }

  if (!province || !quarter || !year) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  try {
    const report = await prisma.report.findMany({
      where: { CWT: province, YR: year, QTR: quarter },
      orderBy: [{ ID: "asc" }],
      select: {
        ID: true,
        REG: true,
        CWT: true,
        AMP: true,
        TAM: true,
        MUN: true,
        EA: true,
        VIL: true,
        TSIC_R: true,
        TSIC_L: true,
        SIZE_R: true,
        SIZE_L: true,
        NO: true,
        QTR: true,
        YR: true,
        ENU: true,
        TITLE: true,
        RANK: true,
        FIRSTNAME: true,
        LASTNAME: true,
        EST_TITLE: true,
        EST_NAME: true,
        ADD_NO: true,
        BUILDING: true,
        ROOM: true,
        STREET: true,
        BLK: true,
        SOI: true,
        SUB_DIST: true,
        DISTRICT: true,
        PROVINCE: true,
        POST_CODE: true,
        TEL_NO: true,
        E_MAIL: true,
        WEBSITE: true,
        SOCIAL: true,
        ANSWER: true,
        TSIC_CHG: true,
        LG: true,
        LG1: true,
        LG2: true,
        LG3: true,
        LG4: true,
        DES_TYPE: true,
        TYPE: true,
        M1: true,
        M2: true,
        M3: true,
        R1: true,
        R2: true,
        R3: true,
        TR: true,
        SI: true,
        ITR: true,
        SI1: true,
        SI2: true,
        SI3: true,
        SI4: true,
        SI5: true,
        SI6: true,
        SI7: true,
        SI8: true,
        SI11: true,
        SI22: true,
        SI33: true,
        SI44: true,
        SI55: true,
        SI66: true,
        SI77: true,
        F1: true,
        F2: true,
        F3: true,
        F4: true,
        F5: true,
        CHG: true,
        CIN: true,
        CDE: true,
        FAC: true,
        FAC_1: true,
        PRVS: true,
        PIN: true,
        PDE: true,
        EMP: true,
        STO: true,
        DAY: true,
        OP1: true,
        OP2: true,
        OP3: true,
        OP4: true,
        OP5: true,
        OP6: true,
        OP7: true,
        OP8: true,
        OP9: true,
        OP10: true,
        OP11: true,
        OP12: true,
        P1: true,
        P2: true,
        P3: true,
        P4: true,
      },
    });

    return NextResponse.json(report);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
