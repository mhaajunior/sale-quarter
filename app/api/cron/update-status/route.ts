import { checkDateBetween, getThaiYear, quarterMap } from "@/lib/quarter";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "../../middleware";

// cronjob for update form submitted status
export const PATCH = async (req: NextRequest) => {
  const apiKey = req.headers.get("api-key");

  const fullYear = new Date().getFullYear();
  const item = quarterMap(fullYear);
  const now = new Date().toJSON().slice(0, 10);
  const month = new Date().getMonth();
  let currentYear = getThaiYear(fullYear).yearSlice;
  if (month === 0 || month === 1) {
    currentYear--;
  }

  if (!apiKey || !validateApiKey(apiKey)) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  let updateObj: any = {};
  for (const i of item) {
    if (checkDateBetween(now, i.cronRange[0], i.cronRange[1])) {
      switch (i.quarter) {
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
      switch (i.quarter) {
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
  }

  try {
    await prisma.reportStatus.updateMany({
      where: { year: currentYear },
      data: updateObj,
    });
    return NextResponse.json("เปลี่ยนสถานะเรียบร้อย");
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    throw e;
  }
};
