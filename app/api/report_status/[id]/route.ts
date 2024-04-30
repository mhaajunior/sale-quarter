import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { logger } from "@/logger";
import moment from "moment";

// get access status of specific id in the quarter
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const companyId = params.id;
  const quarter = Number(req.nextUrl.searchParams.get("quarter"));
  const year = Number(req.nextUrl.searchParams.get("year"));

  if (!companyId || !quarter || !year) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  try {
    const reportStatus = await prisma.reportStatus.findUnique({
      where: { yearID: { ID: companyId, year } },
      select: {
        canCreateQtr1: true,
        canCreateQtr2: true,
        canCreateQtr3: true,
        canCreateQtr4: true,
      },
    });

    if (!reportStatus) {
      return NextResponse.json(false);
    }

    let status = null;
    switch (quarter) {
      case 1:
        status = reportStatus.canCreateQtr1;
        break;
      case 2:
        status = reportStatus.canCreateQtr2;
        break;
      case 3:
        status = reportStatus.canCreateQtr3;
        break;
      case 4:
        status = reportStatus.canCreateQtr4;
        break;
      default:
        break;
    }

    return NextResponse.json(status);
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    logger.error(
      moment().format("HH:mm:ss"),
      `GET /api/report_status/${companyId}`,
      req,
      e
    );
    throw e;
  }
};
