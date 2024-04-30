import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../../middleware";
import { logger } from "@/logger";
import moment from "moment";

// get related data from previous quarter to be new control for current quarter
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const companyId = params.id;
  const quarter = Number(req.nextUrl.searchParams.get("quarter"));
  const year = Number(req.nextUrl.searchParams.get("year"));
  let obj: any = null;

  try {
    const control = await prisma.control.findUnique({
      where: { es_id: parseInt(companyId) },
    });
    if (control) {
      const { firstname, lastname, regis_cid, regis_no, es_id } = control;

      obj = {
        ...control,
        es_id: es_id.toString(),
        firstname: decrypt(firstname),
        lastname: decrypt(lastname),
        regis_cid: decrypt(regis_cid),
        regis_no: decrypt(regis_no),
      };
    } else {
      return NextResponse.json("ไม่พบเลขประจำสถานประกอบการนี้", {
        status: 404,
      });
    }

    if (quarter && year) {
      const report = await prisma.report.findUnique({
        where: { uniqueReport: { ID: companyId, YR: year, QTR: quarter - 1 } },
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
        const qtr1Report = await prisma.report.findUnique({
          where: {
            uniqueReport: { ID: companyId, YR: year, QTR: 1 },
          },
          select: {
            TSIC_R: true,
            SIZE_R: true,
          },
        });

        report.TSIC_L = qtr1Report?.TSIC_R!;
        report.SIZE_L = qtr1Report?.SIZE_R!;

        for (const [key, value] of Object.entries(report)) {
          if (!value) {
            delete report[key as keyof typeof report];
          } else {
            if (["FIRSTNAME", "LASTNAME", "LG1"].includes(key)) {
              report[key as "FIRSTNAME" | "LASTNAME" | "LG1"] = decrypt(
                value as string
              );
            }
          }
        }
        obj = report;
      } else {
        return NextResponse.json("กรุณาส่งแบบฟอร์มในไตรมาสก่อนหน้านี้ก่อน", {
          status: 400,
        });
      }
    }

    return NextResponse.json(obj);
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    logger.error(
      moment().format("HH:mm:ss"),
      `GET /api/control/${companyId}`,
      req,
      e
    );
    throw e;
  }
};
