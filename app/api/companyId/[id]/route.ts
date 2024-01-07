import { yr } from "@/helpers/quarter";
import prisma from "@/prisma/db";
import { InitialControl, ReportControl } from "@/types/control";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const companyId = params.id;
  const quarter = Number(req.nextUrl.searchParams.get("quarter"));
  let obj: InitialControl | ReportControl | null = null;

  try {
    const control = await prisma.control.findUnique({
      where: { es_id: parseInt(companyId) },
    });
    if (control) {
      obj = { ...control, es_id: control.es_id.toString() };
    } else {
      return NextResponse.json("ไม่พบเลขประจำสถานประกอบการนี้", {
        status: 404,
      });
    }

    if (quarter) {
      const report = await prisma.report.findFirst({
        where: { ID: parseInt(companyId), YR: yr, QTR: quarter - 1 },
        select: {
          ID: true,
          REG: true,
          CWT: true,
          AMP: true,
          TAM: true,
          MUN: true,
          EA: true,
          VIL: true,
          TSIC_R: true,
          TSIC_L: true,
          SIZE_R: true,
          SIZE_L: true,
          NO: true,
          QTR: true,
          YR: true,
          ENU: true,
          TITLE: true,
          RANK: true,
          FIRSTNAME: true,
          LASTNAME: true,
          EST_TITLE: true,
          EST_NAME: true,
          ADD_NO: true,
          BUILDING: true,
          ROOM: true,
          STREET: true,
          BLK: true,
          SOI: true,
          SUB_DIST: true,
          DISTRICT: true,
          PROVINCE: true,
          POST_CODE: true,
          TEL_NO: true,
          E_MAIL: true,
          WEBSITE: true,
          SOCIAL: true,
          TSIC_CHG: true,
          LG: true,
          LG1: true,
          LG1_temp: true,
          LG2: true,
          LG3: true,
          LG4: true,
        },
      });
      if (report) {
        obj = {
          ...report,
          ID: report.ID.toString(),
        };
      } else {
        return NextResponse.json("กรุณาส่งแบบฟอร์มในไตรมาสก่อนหน้านี้ก่อน", {
          status: 400,
        });
      }
    }

    return NextResponse.json(obj);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
