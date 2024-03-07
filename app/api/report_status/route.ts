import { verifyJwt } from "@/lib/jwt";
import prisma from "@/prisma/db";
import { searchIdSchema } from "@/types/schemas/searchSchema";
import { Prisma } from "@prisma/client";
import { Role } from "@/types/dto/role";
import { NextRequest, NextResponse } from "next/server";
import { getUserRole, validateUserRole } from "../middleware";

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
    let whereObj: any = { province, year };
    let whereObj2: any = { province, year };
    let whereObj3: any = { province, year };
    if (searchId) {
      whereObj.ID = { startsWith: searchId };
      whereObj2.ID = { startsWith: searchId };
    }

    const totalCount = await prisma.reportStatus.count({
      where: whereObj,
    });

    switch (quarter) {
      case 1:
        whereObj.isApproveQtr1 = false;
        whereObj3.isApproveQtr1 = false;
        break;
      case 2:
        whereObj.isApproveQtr2 = false;
        whereObj3.isApproveQtr1 = false;
        break;
      case 3:
        whereObj.isApproveQtr3 = false;
        whereObj3.isApproveQtr1 = false;
        break;
      case 4:
        whereObj.isApproveQtr4 = false;
        whereObj3.isApproveQtr1 = false;
        break;
      default:
        break;
    }

    const totalNotApproveCount = await prisma.reportStatus.count({
      where: whereObj3,
    });

    const notApproveCount = await prisma.reportStatus.count({
      where: whereObj,
    });

    if (option === 2) {
      whereObj2 = whereObj;
    }

    const reportStatus = await prisma.reportStatus.findMany({
      where: whereObj2,
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
    throw e;
  }
};
