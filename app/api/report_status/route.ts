import { verifyJwt } from "@/lib/jwt";
import prisma from "@/prisma/db";
import { searchIdSchema } from "@/types/schemas/searchSchema";
import { Prisma } from "@prisma/client";
import { Role } from "@/types/dto/role";
import { NextRequest, NextResponse } from "next/server";
import { getUserRole, validateUserRole } from "../middleware";
import { logger } from "@/logger";
import moment from "moment";

interface WhereObj {
  province: number;
  year: number;
  ID?: { startsWith: string };
  isApproveQtr1?: boolean;
  isApproveQtr2?: boolean;
  isApproveQtr3?: boolean;
  isApproveQtr4?: boolean;
}

// find company id in search page and return status
export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");
  const body = await req.json();
  const { ID } = body.data;
  let hasControl = false;
  let reportStatus = null;
  let role = null;

  if (accessToken) {
    if (!verifyJwt(accessToken)) {
      return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
    }

    role = getUserRole(accessToken);
    if (role === Role.INTERVIEWER && !body.province) {
      return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
    }
  }

  const validation = searchIdSchema.safeParse(body.data);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    const control = await prisma.control.findUnique({
      where: { es_id: parseInt(ID) },
    });

    if (control) {
      hasControl = true;
      let whereObj: any = { yearID: { ID, year: body.year } };

      if (body.province && role !== Role.SUBJECT) {
        whereObj.province = body.province;
      }

      reportStatus = await prisma.reportStatus.findUnique({
        where: whereObj,
        include: {
          report: {
            select: {
              lastEditor: true,
              createdAt: true,
              updatedAt: true,
              P1: true,
              P2: true,
              P3: true,
              P4: true,
            },
            orderBy: { QTR: "asc" },
          },
        },
      });
    }
    return NextResponse.json({ hasControl, reportStatus });
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    logger.error(
      `${moment().format("HH:mm:ss")} POST /api/report_status ${e} ${req}`
    );
    throw e;
  }
};

// get all company in the province and return form status for supervisor and subject
export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");
  const quarter = Number(req.nextUrl.searchParams.get("quarter"));
  const year = Number(req.nextUrl.searchParams.get("year"));
  const province = Number(req.nextUrl.searchParams.get("province"));
  const perPage = Number(req.nextUrl.searchParams.get("perPage"));
  const page = Number(req.nextUrl.searchParams.get("page"));
  const option = Number(req.nextUrl.searchParams.get("option"));
  const searchId = req.nextUrl.searchParams.get("searchId");

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
    let whereObjTotalCount: WhereObj = { province, year };
    let whereObjNotApproveCount: WhereObj = { province, year };
    let whereObjTotalNotApproveCount: WhereObj = { province, year };

    if (searchId) {
      whereObjTotalCount.ID = { startsWith: searchId };
      whereObjNotApproveCount.ID = { startsWith: searchId };
    }

    switch (quarter) {
      case 1:
        whereObjTotalNotApproveCount.isApproveQtr1 = false;
        whereObjNotApproveCount.isApproveQtr1 = false;
        if (option === 2) whereObjTotalCount.isApproveQtr1 = false;
        break;
      case 2:
        whereObjTotalNotApproveCount.isApproveQtr2 = false;
        whereObjNotApproveCount.isApproveQtr2 = false;
        if (option === 2) whereObjTotalCount.isApproveQtr2 = false;
        break;
      case 3:
        whereObjTotalNotApproveCount.isApproveQtr3 = false;
        whereObjNotApproveCount.isApproveQtr3 = false;
        if (option === 2) whereObjTotalCount.isApproveQtr3 = false;
        break;
      case 4:
        whereObjTotalNotApproveCount.isApproveQtr4 = false;
        whereObjNotApproveCount.isApproveQtr4 = false;
        if (option === 2) whereObjTotalCount.isApproveQtr4 = false;
        break;
      default:
        break;
    }

    const totalCount = await prisma.reportStatus.count({
      where: whereObjTotalCount,
    });

    const totalNotApproveCount = await prisma.reportStatus.count({
      where: whereObjTotalNotApproveCount,
    });

    const notApproveCount = await prisma.reportStatus.count({
      where: whereObjNotApproveCount,
    });

    const reportStatus = await prisma.reportStatus.findMany({
      where: whereObjTotalCount,
      orderBy: [{ no: "asc" }],
      include: {
        report: {
          where: { QTR: quarter },
          select: { updatedAt: true, P1: true, P2: true, P3: true, P4: true },
        },
      },
      skip: perPage * (page - 1),
      take: perPage,
    });

    return NextResponse.json({
      reportStatus: reportStatus,
      totalNotApproveCount,
      notApproveCount,
      totalCount,
    });
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    logger.error(
      `${moment().format("HH:mm:ss")} GET /api/report_status ${e} ${req}`
    );
    throw e;
  }
};

// change form access status for specific id for subject
export const PATCH = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");
  const body = await req.json();
  const { id, checked, year, quarter } = body;

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
  }

  if (!validateUserRole(accessToken, [Role.SUBJECT])) {
    return NextResponse.json("ไม่สามารถเข้าถึงข้อมูลได้", { status: 401 });
  }

  try {
    const found = await prisma.reportStatus.findUnique({
      where: { yearID: { ID: id, year } },
    });

    if (!found) {
      return NextResponse.json("ไม่พบข้อมูลของสถานประกอบการนี้", {
        status: 400,
      });
    }

    let updatedData: any = {};
    switch (quarter) {
      case 1:
        updatedData.canCreateQtr1 = checked;
        break;
      case 2:
        updatedData.canCreateQtr2 = checked;
        break;
      case 3:
        updatedData.canCreateQtr3 = checked;
        break;
      case 4:
        updatedData.canCreateQtr4 = checked;
        break;
      default:
        break;
    }

    await prisma.reportStatus.update({
      where: { yearID: { ID: id, year } },
      data: updatedData,
    });

    return NextResponse.json("เปลี่ยนสำเร็จ");
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    logger.error(
      `${moment().format("HH:mm:ss")} PATCH /api/report_status ${e} ${req}`
    );
    throw e;
  }
};
