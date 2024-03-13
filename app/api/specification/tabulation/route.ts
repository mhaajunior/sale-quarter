import { verifyJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { validateUserRole } from "../../middleware";
import { Role } from "@/types/dto/role";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import moment from "moment";

interface Data {
  NO: string;
  EST_NAME: string;
  TSIC_R: number;
  SIZE_R: string;
  TR_arr: number[];
  STO_arr: string[];
  TR_chg: number[];
  STO_chg: number[];
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
      where: { YR: year, CWT: province },
      select: {
        ID: true,
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
      const { ID, NO, EST_NAME, TSIC_R, SIZE_R, TR, STO } = item;
      if (temp[ID]) {
        temp[ID].TR_arr.push(TR || 0);
        temp[ID].STO_arr.push(Number(STO) || 0);
        temp[ID].TSIC_R = TSIC_R;
        temp[ID].SIZE_R = SIZE_R;
      } else {
        temp[ID] = {
          NO,
          EST_NAME,
          TSIC_R,
          SIZE_R,
          TR_arr: [TR || 0],
          STO_arr: [Number(STO) || 0],
        };
      }
    }

    const res: Data[] = [];
    for (const [key, value] of Object.entries(temp)) {
      const val = value as Data;
      const TR_chg: number[] = [];
      const STO_chg: number[] = [];

      // calculate change rate for tabulation 2
      const { TR_arr, STO_arr } = val;
      if (TR_arr.length > 0 && STO_arr.length > 0) {
        for (let i = 0; i < TR_arr.length; i++) {
          let prevReport: any = {};
          if (i === 0) {
            // QTR = 1
            const startDate = moment("2025-04-01");
            const now = moment();

            if (now >= startDate) {
              prevReport = await prisma.report.findUnique({
                where: {
                  uniqueReport: { ID: key, YR: year - 1, QTR: 4 },
                  CWT: province,
                },
                select: { ID: true, TR: true, STO: true },
              });
            } else {
              prevReport = await prisma.tempTabulation.findUnique({
                where: { ID: key },
              });
            }
          } else {
            // QTR = 2-4
            prevReport = await prisma.report.findUnique({
              where: {
                uniqueReport: { ID: key, YR: year, QTR: i },
                CWT: province,
              },
              select: { ID: true, TR: true, STO: true },
            });
          }
          const prevTr = prevReport?.TR || 0;
          const prevSto = Number(prevReport?.STO) || 0;
          const percentTrChg = ((TR_arr[i] - prevTr) / prevTr) * 100;
          const percentStoChg =
            ((Number(STO_arr[i]) - prevSto) / prevSto) * 100;
          TR_chg.push(percentTrChg);
          STO_chg.push(percentStoChg);
        }
      }

      res.push({ ...val, TR_chg, STO_chg });
    }

    return NextResponse.json(res);
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    throw e;
  }
};
