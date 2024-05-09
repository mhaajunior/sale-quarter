import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../../middleware";
import { logger } from "@/logger";

// get all report data when user want to edit report
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
      if (value !== 0 && !value) {
        delete report[key as keyof typeof report];
      } else {
        if (["FIRSTNAME", "LASTNAME", "LG1"].includes(key)) {
          report[key as "FIRSTNAME" | "LASTNAME" | "LG1"] = decrypt(
            value as string
          );
        }
      }
    }
    return NextResponse.json(report);
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    logger.error(`GET /api/report/${companyId} ${e} ${req}`);
    throw e;
  }
};
