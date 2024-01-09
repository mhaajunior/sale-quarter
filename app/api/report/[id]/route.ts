import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const companyId = params.id;
  const quarter = Number(req.nextUrl.searchParams.get("quarter"));
  const year = Number(req.nextUrl.searchParams.get("year"));

  try {
    const report = await prisma.report.findUnique({
      where: { uniqueReport: { ID: companyId, YR: year, QTR: quarter } },
    });
    if (!report) {
      return NextResponse.json("เลขประจำสถานประกอบการไม่ถูกต้อง", {
        status: 400,
      });
    }

    for (const [key, value] of Object.entries(report)) {
      if (!value) {
        delete report[key as keyof typeof report];
      }
    }
    return NextResponse.json(report);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
