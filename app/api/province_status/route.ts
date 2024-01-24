import { verifyJwt } from "@/lib/jwt";
import prisma from "@/prisma/db";
import { ProvinceGroup } from "@/types/dto/report";
import { Prisma, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { validateUserRole } from "../middleware";

// get all province report status for subject
export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");
  const quarter = Number(req.nextUrl.searchParams.get("quarter"));
  const year = Number(req.nextUrl.searchParams.get("year"));

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
  }

  if (!validateUserRole(accessToken, [Role.SUBJECT])) {
    return NextResponse.json("ไม่สามารถเข้าถึงข้อมูลได้", { status: 401 });
  }

  if (!quarter || !year) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  try {
    const report = await prisma.report.groupBy({
      by: ["CWT"],
      where: { YR: year, QTR: quarter, P4: { not: null } },
      orderBy: [{ CWT: "asc" }],
      _count: { P4: true },
    });
    let countObj: any = {};
    for (const item of report) {
      countObj[item.CWT] = item._count.P4;
    }

    let provinceStatus: {
      1: ProvinceGroup[];
      2: ProvinceGroup[];
      3: ProvinceGroup[];
      4: ProvinceGroup[];
      5: ProvinceGroup[];
    } = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    const province_count = await prisma.reportStatus.groupBy({
      by: ["province", "province_name", "region"],
      where: { year },
      _count: { province: true },
    });

    for (const item of province_count) {
      provinceStatus[item.region as keyof typeof provinceStatus].push({
        id: item.province,
        name: item.province_name,
        totalCompany: item._count.province,
        notApprove: item._count.province - (countObj[item.province] || 0),
      });
    }

    return NextResponse.json(provinceStatus);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
