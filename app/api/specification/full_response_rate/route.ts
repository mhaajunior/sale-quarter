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

// get data to display in full response rate table
export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");
  const year = Number(req.nextUrl.searchParams.get("year"));
  const quarter = Number(req.nextUrl.searchParams.get("quarter"));

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
  }

  if (!validateUserRole(accessToken, [Role.SUBJECT, Role.SUPERVISOR])) {
    return NextResponse.json("ไม่สามารถเข้าถึงข้อมูลได้", { status: 401 });
  }

  if (!quarter || !year) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  try {
    const report = await prisma.report.groupBy({
      by: ["CWT", "ENU"],
      where: { YR: year, QTR: quarter },
      _count: { _all: true },
      orderBy: [{ CWT: "asc" }, { ENU: "asc" }],
    });

    console.log(report);

    let totalProvince: any = {};
    let uncountableTotalProvince: any = {};
    let responseRegion: any = {};
    let responseProvince: any = {};

    for (const item of report) {
      const { CWT, _count, ENU } = item;
      if (totalProvince.hasOwnProperty(CWT)) {
        totalProvince[CWT] += _count._all;
      } else {
        totalProvince[CWT] = _count._all;
      }

      if (Number(ENU) !== 1) {
        if (uncountableTotalProvince.hasOwnProperty(CWT)) {
          uncountableTotalProvince[CWT] += _count._all;
        } else {
          uncountableTotalProvince[CWT] = _count._all;
        }
      }
    }

    for (const item of report) {
      const { CWT, ENU, _count } = item;

      if (responseProvince.hasOwnProperty(CWT)) {
        responseProvince[CWT].response[Number(ENU)] = {
          count: numberWithCommas(_count._all),
          percent: ((_count._all / totalProvince[CWT]) * 100).toFixed(2),
        };
      } else {
        responseProvince[CWT] = {
          total: totalProvince[CWT],
          uncountable: uncountableTotalProvince[CWT],
          response: [],
        } as ResponseData;
        responseProvince[CWT].response[Number(ENU)] = {
          count: numberWithCommas(_count._all),
          percent: ((_count._all / totalProvince[CWT]) * 100).toFixed(2),
        };
      }
    }

    console.log(responseProvince);

    return NextResponse.json(responseProvince);
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    logger.error(
      `${moment().format(
        "HH:mm:ss"
      )} GET /api/specification/response_rate ${e} ${req}`
    );
    throw e;
  }
};
