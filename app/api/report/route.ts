import { verifyJwt } from "@/lib/jwt";
import prisma from "@/prisma/db";
import { CompanyReport } from "@/types/dto/report";
import { createReportSchema } from "@/types/schemas/validationSchema";
import { Prisma } from "@prisma/client";
import { Role } from "@/types/dto/role";
import { NextRequest, NextResponse } from "next/server";
import {
  decrypt,
  encrypt,
  getUserName,
  getUserRole,
  validateUserRole,
} from "../middleware";
import { changeToNull } from "@/lib/common";

// create and edit report
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const accessToken = req.headers.get("authorization");
  const mode = req.headers.get("mode");
  let role = null;
  let lastEditor = "";

  const validation = createReportSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  if (!mode || !["create", "edit"].includes(mode)) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  if (accessToken) {
    if (!verifyJwt(accessToken)) {
      return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
    }
    role = getUserRole(accessToken);
    const name = getUserName(accessToken);
    if (role === Role.INTERVIEWER) {
      lastEditor = `${name} (เจ้าหน้าที่บันทึกข้อมูล)`;
    } else if (role === Role.SUPERVISOR) {
      lastEditor = `${name} (ผู้ตรวจ)`;
    } else if (role === Role.SUBJECT) {
      lastEditor = `${name} (ส่วนกลาง)`;
    }
  } else {
    lastEditor = "สถานประกอบการ";
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
    si1 = SI1 ? 1 : 0;
    si2 = SI2 ? 1 : 0;
    si3 = SI3 ? 1 : 0;
    si4 = SI4 ? 1 : 0;
    si5 = SI5 ? 1 : 0;
    si6 = SI6 ? 1 : 0;
    si7 = SI7 ? 1 : 0;
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
        AMP,
        TAM,
        MUN,
        EA,
        VIL,
        TSIC_R,
        SIZE_R,
        ENU,
        TITLE: changeToNull(TITLE),
        RANK: changeToNull(RANK),
        FIRSTNAME: encrypt(changeToNull(FIRSTNAME)),
        LASTNAME: encrypt(changeToNull(LASTNAME)),
        EST_TITLE: changeToNull(EST_TITLE),
        EST_NAME: changeToNull(EST_NAME),
        ADD_NO: changeToNull(ADD_NO),
        BUILDING: changeToNull(BUILDING),
        ROOM: changeToNull(ROOM),
        STREET: changeToNull(STREET),
        BLK: changeToNull(BLK),
        SOI: changeToNull(SOI),
        SUB_DIST: changeToNull(SUB_DIST),
        DISTRICT: changeToNull(DISTRICT),
        PROVINCE: changeToNull(PROVINCE),
        POST_CODE: changeToNull(POST_CODE),
        TEL_NO: changeToNull(TEL_NO),
        E_MAIL: changeToNull(E_MAIL),
        WEBSITE: changeToNull(WEBSITE),
        SOCIAL: changeToNull(SOCIAL),
        ANSWER,
        TSIC_CHG: TSIC_CHG || null,
        LG: LG || null,
        LG1: encrypt(changeToNull(LG1)),
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
        ITR: ITR || null,
        SI1: si1,
        SI2: si2,
        SI3: si3,
        SI4: si4,
        SI5: si5,
        SI6: si6,
        SI7: si7,
        SI8: SI8 || null,
        SI11: SI11 || null,
        SI22: SI22 || null,
        SI33: SI33 || null,
        SI44: SI44 || null,
        SI55: SI55 || null,
        SI66: SI66 || null,
        SI77: SI77 || null,
        F1: F1 || null,
        F2: F2 || null,
        F3: F3 || null,
        F4: F4 || null,
        F5: F5 || null,
        CHG: CHG || null,
        CIN: CIN || null,
        CDE: CDE || null,
        FAC: FAC || null,
        FAC_1: FAC_1 || null,
        PRVS: PRVS || null,
        PIN: PIN || null,
        PDE: PDE || null,
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
        lastEditor,
      },
      create: {
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
        TITLE: changeToNull(TITLE),
        RANK: changeToNull(RANK),
        FIRSTNAME: encrypt(changeToNull(FIRSTNAME)),
        LASTNAME: encrypt(changeToNull(LASTNAME)),
        EST_TITLE: changeToNull(EST_TITLE),
        EST_NAME: changeToNull(EST_NAME),
        ADD_NO: changeToNull(ADD_NO),
        BUILDING: changeToNull(BUILDING),
        ROOM: changeToNull(ROOM),
        STREET: changeToNull(STREET),
        BLK: changeToNull(BLK),
        SOI: changeToNull(SOI),
        SUB_DIST: changeToNull(SUB_DIST),
        DISTRICT: changeToNull(DISTRICT),
        PROVINCE: changeToNull(PROVINCE),
        POST_CODE: changeToNull(POST_CODE),
        TEL_NO: changeToNull(TEL_NO),
        E_MAIL: changeToNull(E_MAIL),
        WEBSITE: changeToNull(WEBSITE),
        SOCIAL: changeToNull(SOCIAL),
        ANSWER,
        TSIC_CHG,
        LG,
        LG1: encrypt(changeToNull(LG1)),
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
        SI1: si1,
        SI2: si2,
        SI3: si3,
        SI4: si4,
        SI5: si5,
        SI6: si6,
        SI7: si7,
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
        lastEditor,
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
          return NextResponse.json("ไตรมาสไม่ถูกต้อง", { status: 400 });
      }

      await prisma.reportStatus.update({
        where: {
          yearID: { ID, year: YR },
        },
        data: updateObj,
      });
    } else {
      let updateObj = {};
      switch (QTR) {
        case 1:
          updateObj = { isApproveQtr1: p4 ? true : false };
          break;
        case 2:
          updateObj = { isApproveQtr2: p4 ? true : false };
          break;
        case 3:
          updateObj = { isApproveQtr3: p4 ? true : false };
          break;
        case 4:
          updateObj = { isApproveQtr4: p4 ? true : false };
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
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    throw e;
  }
};

// get all data in province to download for subject
export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");
  const quarter = Number(req.nextUrl.searchParams.get("quarter"));
  const province = Number(req.nextUrl.searchParams.get("province"));
  const year = Number(req.nextUrl.searchParams.get("year"));

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
  }

  if (!validateUserRole(accessToken, [Role.SUPERVISOR, Role.SUBJECT])) {
    return NextResponse.json("ไม่สามารถเข้าถึงข้อมูลได้", { status: 401 });
  }

  if (!province || !quarter || !year) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  try {
    const report = await prisma.report.findMany({
      where: { CWT: province, YR: year, QTR: quarter },
      orderBy: [{ NO: "asc" }],
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
        WWKNSO: true,
        WWKNESDB: true,
      },
    });

    for (const item of report) {
      item.FIRSTNAME = decrypt(item.FIRSTNAME);
      item.LASTNAME = decrypt(item.LASTNAME);
      item.LG1 = decrypt(item.LG1);
    }

    return NextResponse.json(report);
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    throw e;
  }
};
