import { verifyJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { validateUserRole } from "../../middleware";
import { Role } from "@/types/dto/role";
import { reportField } from "@/utils/formField";
import prisma from "@/prisma/db";
import { logger } from "@/logger";

// upload report for admin
export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");
  const body = await req.json();

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
  }

  if (!validateUserRole(accessToken, [Role.ADMIN])) {
    return NextResponse.json("ไม่สามารถเข้าถึงข้อมูลได้", { status: 401 });
  }

  if (!body || body.length === 0) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  try {
    for (const item of body) {
      let count = 0;
      for (const [key, value] of Object.entries(item)) {
        if (reportField.includes(key)) {
          count++;
        }
      }
      if (count !== 100) {
        return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
      }
      const { ID, QTR, YR, WWKNSO, WWKNESDB } = item;
      await prisma.report.update({
        where: { uniqueReport: { ID, YR, QTR } },
        data: { WWKNSO, WWKNESDB },
      });
    }

    return NextResponse.json("อัพโหลดสำเร็จ");
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    logger.error(`POST /api/admin/report ${e} ${req}`);
    throw e;
  }
};
