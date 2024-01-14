import { verifyJwt } from "@/helpers/jwt";
import prisma from "@/prisma/db";
import { searchIdSchema } from "@/types/schemas/searchSchema";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get("accessToken");
  const body = await req.json();
  const { ID } = body.data;
  let hasControl = false;
  let reportStatus = null;

  if (accessToken) {
    if (!verifyJwt(accessToken)) {
      return NextResponse.json("unauthorized", { status: 401 });
    }
    if (!body.province) {
      return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
    }
  }

  const validation = searchIdSchema.safeParse(body.data);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    const control = await prisma.control.findUnique({
      where: { es_id: parseInt(ID) },
    });

    if (control) {
      hasControl = true;
      let whereObj: any = { ID };

      if (body.province) {
        whereObj.province = body.province;
      }

      reportStatus = await prisma.reportStatus.findMany({
        where: whereObj,
        orderBy: [{ year: "desc" }],
        include: {
          report: {
            select: { updatedAt: true },
            orderBy: { QTR: "asc" },
          },
        },
      });
    }
    return NextResponse.json({ hasControl, reportStatus });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
