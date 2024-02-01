import { verifyJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { validateUserRole } from "../../middleware";
import { Role } from "@/types/dto/role";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

interface Data {
  NO: string;
  EST_NAME: string;
  TSIC_R: number;
  SIZE_R: string;
  TR: number[];
  STO: string[];
}

// get data to display in tabulation1 table
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
    const report = await prisma.report.findMany({
      where: { YR: year, CWT: province, ENU: { equals: "01" } },
      select: {
        NO: true,
        EST_NAME: true,
        TSIC_R: true,
        SIZE_R: true,
        TR: true,
        STO: true,
      },
      orderBy: [{ NO: "asc" }, { QTR: "asc" }],
    });

    let temp: any = {};
    for (const item of report) {
      const { NO, EST_NAME, TSIC_R, SIZE_R, TR, STO } = item;
      if (temp[NO]) {
        temp[NO].TR_arr.push(TR);
        temp[NO].STO_arr.push(STO);
        temp[NO].TSIC_R = TSIC_R;
        temp[NO].SIZE_R = SIZE_R;
      } else {
        temp[NO] = {
          NO,
          EST_NAME,
          TSIC_R,
          SIZE_R,
          TR_arr: [TR],
          STO_arr: [STO],
        };
      }
    }

    const res: Data[] = [];
    for (const [key, value] of Object.entries(temp)) {
      res.push({ ...(value as Data) });
    }

    return NextResponse.json(res);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
