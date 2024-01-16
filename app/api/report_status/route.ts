import { verifyJwt } from "@/helpers/jwt";
import prisma from "@/prisma/db";
import { searchIdSchema } from "@/types/schemas/searchSchema";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// find company id in search page and return status
export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get("accessToken");
  const body = await req.json();
  const { ID } = body.data;
  let hasControl = false;
  let reportStatus = null;

  if (accessToken) {
    if (!verifyJwt(accessToken)) {
      return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
    }
    if (!body.province) {
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
      let whereObj: any = { ID };

      if (body.province) {
        whereObj.province = body.province;
      }

      reportStatus = await prisma.reportStatus.findMany({
        where: whereObj,
        orderBy: [{ year: "desc" }],
        include: {
          report: {
            select: { updatedAt: true, P1: true, P2: true, P3: true, P4: true },
            orderBy: { QTR: "asc" },
          },
        },
      });
    }
    return NextResponse.json({ hasControl, reportStatus });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};

// get all company in the province and return form status for supervisor
export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get("accessToken");
  const quarter = Number(req.nextUrl.searchParams.get("quarter"));
  const year = Number(req.nextUrl.searchParams.get("year"));
  const province = Number(req.nextUrl.searchParams.get("province"));

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
  }

  if (!province || !quarter || !year) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  try {
    const reportStatus = await prisma.reportStatus.findMany({
      where: { province, year },
      orderBy: [{ ID: "asc" }],
      include: {
        report: {
          where: { QTR: quarter },
          select: { updatedAt: true, P1: true, P2: true, P3: true, P4: true },
        },
      },
    });

    return NextResponse.json(reportStatus);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
