import { yr } from "@/helpers/quarter";
import prisma from "@/prisma/db";
import { searchIdSchema } from "@/types/searchSchema";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { ID } = body;
  let hasControl = false;
  let report = null;

  const validation = searchIdSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    const control = await prisma.control.findUnique({
      where: { es_id: parseInt(ID) },
    });
    if (control) {
      hasControl = true;
      report = await prisma.report.findMany({
        where: { ID: parseInt(ID), YR: yr },
        orderBy: { QTR: "asc" },
      });
    }
    return NextResponse.json({ hasControl, report });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
