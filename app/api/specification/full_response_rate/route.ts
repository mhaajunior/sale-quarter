import { verifyJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { validateUserRole } from "../../middleware";
import { Role } from "@/types/dto/role";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { numberWithCommas } from "@/lib/common";
import { logger } from "@/logger";
import { mapProvinceToRegion } from "@/utils/province";

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
      by: ["REG", "CWT", "ENU"],
      where: { YR: year, QTR: quarter },
      _count: { _all: true },
      orderBy: [{ CWT: "asc" }, { ENU: "asc" }],
    });

    let totalProvince: any = {};
    let uncountableTotalProvince: any = {};
    let responseProvince: any = {};
    let responseRegion: any = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    const summaryRegion = [];

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

    // for (const [key, value] of Object.entries(responseProvince)) {
    //   for (const [key2, value2] of Object.entries(mapProvinceToRegion)) {
    //     if (value2.includes(Number(key))) {
    //       responseRegion[key2].push(value);
    //     }
    //   }
    // }

    // for (const [key, value] of Object.entries(responseRegion)) {
    //   let regionItem = {
    //     total: 0,
    //     uncountableCount: 0,
    //     uncountablePercent: "",
    //     enu1Count: 0,
    //     enu1Percent: "",
    //     enu2Count: 0,
    //     enu2Percent: "",
    //     enu3Count: 0,
    //     enu3Percent: "",
    //     enu4Count: 0,
    //     enu4Percent: "",
    //     enu5Count: 0,
    //     enu5Percent: "",
    //     enu6Count: 0,
    //     enu6Percent: "",
    //     enu7Count: 0,
    //     enu7Percent: "",
    //     enu8Count: 0,
    //     enu8Percent: "",
    //     enu9Count: 0,
    //     enu9Percent: "",
    //     enu10Count: 0,
    //     enu10Percent: "",
    //     enu11Count: 0,
    //     enu11Percent: "",
    //   };

    //   for (const item of value as any) {
    //     regionItem.total += item.total;
    //     regionItem.uncountableCount += item.uncountable;
    //     regionItem.enu1Count += item.response[1]
    //       ? Number(item.response[1].count)
    //       : 0;
    //     regionItem.enu2Count += item.response[2]
    //       ? Number(item.response[2].count)
    //       : 0;
    //     regionItem.enu3Count += item.response[3]
    //       ? Number(item.response[3].count)
    //       : 0;
    //     regionItem.enu4Count += item.response[4]
    //       ? Number(item.response[4].count)
    //       : 0;
    //     regionItem.enu5Count += item.response[5]
    //       ? Number(item.response[5].count)
    //       : 0;
    //     regionItem.enu6Count += item.response[6]
    //       ? Number(item.response[6].count)
    //       : 0;
    //     regionItem.enu7Count += item.response[7]
    //       ? Number(item.response[7].count)
    //       : 0;
    //     regionItem.enu8Count += item.response[8]
    //       ? Number(item.response[8].count)
    //       : 0;
    //     regionItem.enu9Count += item.response[9]
    //       ? Number(item.response[9].count)
    //       : 0;
    //     regionItem.enu10Count += item.response[10]
    //       ? Number(item.response[10].count)
    //       : 0;
    //     regionItem.enu11Count += item.response[11]
    //       ? Number(item.response[11].count)
    //       : 0;
    //   }
    //   regionItem.uncountablePercent = (
    //     (regionItem.uncountableCount / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu1Percent = (
    //     (regionItem.enu1Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu2Percent = (
    //     (regionItem.enu2Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu3Percent = (
    //     (regionItem.enu3Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu4Percent = (
    //     (regionItem.enu4Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu5Percent = (
    //     (regionItem.enu5Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu6Percent = (
    //     (regionItem.enu6Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu7Percent = (
    //     (regionItem.enu7Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu8Percent = (
    //     (regionItem.enu8Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu9Percent = (
    //     (regionItem.enu9Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu10Percent = (
    //     (regionItem.enu10Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   regionItem.enu11Percent = (
    //     (regionItem.enu11Count / regionItem.total) *
    //     100
    //   ).toFixed(2);
    //   summaryRegion.push(regionItem);
    // }

    // console.log(summaryRegion);

    return NextResponse.json(responseProvince);
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    logger.error(`GET /api/specification/full_response_rate ${e} ${req}`);
    throw e;
  }
};
