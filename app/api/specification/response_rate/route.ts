import { verifyJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { validateUserRole } from "../../middleware";
import { Role } from "@/types/dto/role";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { numberWithCommas } from "@/lib/common";
import { logger } from "@/logger";
import moment from "moment";

interface ResponseData {
  total: number;
  uncountable: number;
  response: any;
}

interface Quarter {
  1: number;
  2: number;
  3: number;
  4: number;
}

// get data to display in response rate table
export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");
  const province = Number(req.nextUrl.searchParams.get("province"));
  const year = Number(req.nextUrl.searchParams.get("year"));

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
  }

  if (!validateUserRole(accessToken, [Role.SUBJECT, Role.SUPERVISOR])) {
    return NextResponse.json("ไม่สามารถเข้าถึงข้อมูลได้", { status: 401 });
  }

  if (!province || !year) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  try {
    let totalResQuarter: Quarter = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let uncountableResQuarter: Quarter = { 1: 0, 2: 0, 3: 0, 4: 0 };

    const quarter_total = await prisma.report.groupBy({
      by: ["QTR"],
      where: { YR: year, CWT: province },
      _count: { _all: true },
    });

    const uncountable_total = await prisma.report.groupBy({
      by: ["QTR"],
      where: { YR: year, CWT: province, ENU: { not: "01" } },
      _count: { _all: true },
    });

    for (const item of quarter_total) {
      totalResQuarter[item.QTR as keyof typeof totalResQuarter] =
        item._count._all;
    }

    for (const item of uncountable_total) {
      uncountableResQuarter[item.QTR as keyof typeof uncountableResQuarter] =
        item._count._all;
    }

    const report = await prisma.report.groupBy({
      by: ["QTR", "ENU"],
      where: { YR: year, CWT: province },
      _count: { _all: true },
      orderBy: [{ QTR: "asc" }, { ENU: "asc" }],
    });

    let responseQuarter: {
      1: ResponseData;
      2: ResponseData;
      3: ResponseData;
      4: ResponseData;
    } = {
      1: { total: 0, uncountable: 0, response: [] },
      2: { total: 0, uncountable: 0, response: [] },
      3: { total: 0, uncountable: 0, response: [] },
      4: { total: 0, uncountable: 0, response: [] },
    };

    for (const item of report) {
      const { QTR, ENU, _count } = item;
      responseQuarter[QTR as keyof typeof responseQuarter].total =
        totalResQuarter[QTR as keyof typeof totalResQuarter];
      responseQuarter[QTR as keyof typeof responseQuarter].uncountable =
        uncountableResQuarter[QTR as keyof typeof uncountableResQuarter];

      responseQuarter[QTR as keyof typeof responseQuarter].response[
        Number(ENU)
      ] = {
        count: numberWithCommas(_count._all),
        percent: (
          (_count._all / totalResQuarter[QTR as keyof typeof totalResQuarter]) *
          100
        ).toFixed(2),
      };
    }

    return NextResponse.json(responseQuarter);
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    logger.error(
      moment().format("HH:mm:ss"),
      "GET /api/specification/response_rate",
      req,
      e
    );
    throw e;
  }
};
