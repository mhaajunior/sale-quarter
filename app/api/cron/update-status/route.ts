import { checkDateBetween, getThaiYear, quarterMap } from "@/lib/quarter";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "../../middleware";
// import { logger } from "@/logger";
import moment from "moment";

// cronjob for update form submitted status
export const PATCH = async (req: NextRequest) => {
  const apiKey = req.headers.get("api-key");

  const fullYear = new Date().getFullYear();
  const now = new Date().toJSON().slice(0, 10);
  const month = new Date().getMonth();
  let currentYear = getThaiYear(fullYear).yearSlice;
  let quarter = 1;
  if (month === 0 || month === 1) {
    quarter = 4;
    currentYear--;
  } else if (month === 3 || month === 4) {
    quarter = 1;
  } else if (month === 6 || month === 8) {
    quarter = 2;
  } else if (month === 9 || month === 10) {
    quarter = 3;
  }

  if (!apiKey || !validateApiKey(apiKey)) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  const item = quarterMap(fullYear)[quarter - 1];
  let updateObj: any = {};

  if (checkDateBetween(now, item.cronRange[0], item.cronRange[1])) {
    switch (quarter) {
      case 1:
        updateObj.canCreateQtr1 = true;
        break;
      case 2:
        updateObj.canCreateQtr2 = true;
        break;
      case 3:
        updateObj.canCreateQtr3 = true;
        break;
      case 4:
        updateObj.canCreateQtr4 = true;
        break;
      default:
        break;
    }
  } else {
    switch (quarter) {
      case 1:
        updateObj.canCreateQtr1 = false;
        break;
      case 2:
        updateObj.canCreateQtr2 = false;
        break;
      case 3:
        updateObj.canCreateQtr3 = false;
        break;
      case 4:
        updateObj.canCreateQtr4 = false;
        break;
      default:
        break;
    }
  }
  const updateSql = `${Object.keys(updateObj)} = ${
    Object.values(updateObj) ? 1 : 0
  }`;

  try {
    await prisma.$executeRawUnsafe(`
      UPDATE reportStatus
      SET ${updateSql} 
      WHERE year = ${currentYear}
    `);

    // logger.info(
    //   moment().format("HH:mm:ss"),
    //   "PATCH /api/cron/update-status",
    //   req,
    //   "update success"
    // );
    return NextResponse.json("เปลี่ยนสถานะเรียบร้อย");
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    // logger.error(
    //   moment().format("HH:mm:ss"),
    //   "PATCH /api/cron/update-status",
    //   req,
    //   e
    // );
    throw e;
  }
};
