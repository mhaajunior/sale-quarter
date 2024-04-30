import { verifyJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { validateUserRole } from "../../middleware";
import { Role } from "@/types/dto/role";
import prisma from "@/prisma/db";
import bcrypt from "bcrypt";
import { logger } from "@/logger";
import moment from "moment";

// create new user for admin
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
    const { username, password, title, name, surname, role, province } = body;

    const hashPassword = await bcrypt.hash(password.toString(), 10);

    await prisma.user.upsert({
      where: { username },
      update: {
        password: hashPassword,
        fullname: `${title}${name} ${surname}`,
        role,
        province: Number(province),
      },
      create: {
        username,
        password: hashPassword,
        fullname: `${title}${name} ${surname}`,
        role,
        province: Number(province),
      },
    });
    return NextResponse.json("เพิ่มผู้ใช้งานสำเร็จ");
  } catch (e) {
    logger.error(moment().format("HH:mm:ss"), "POST /api/user", req, e);
    throw e;
  }
};
