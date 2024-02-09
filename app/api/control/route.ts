import { verifyJwt } from "@/lib/jwt";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { validateUserRole } from "../middleware";
import { Role } from "@/types/dto/role";

// upload control for admin
export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");
  const body = await req.json();

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
  }

  if (!validateUserRole(accessToken, [Role.ADMIN])) {
    return NextResponse.json("ไม่สามารถเข้าถึงข้อมูลได้", { status: 401 });
  }

  if (!body) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  try {
    for (const item of body) {
      const {
        es_id,
        no,
        tsic_code,
        size12,
        initial,
        firstname,
        lastname,
        comp_name,
        district,
        ea,
        vil,
        house_no,
        street,
        soi,
        building,
        tam,
        tam_name,
        amp,
        amp_name,
        tel_no,
        e_mail,
        econ_fm,
        regis_cid,
        regis_no,
        cwt,
        cwt_name,
        reg,
      } = item;

      await prisma.control.upsert({
        where: { es_id },
        update: {
          no: Number(no),
          tsic_code,
          size12: Number(size12),
          initial,
          firstname,
          lastname,
          comp_name: comp_name.toString(),
          district,
          ea: Number(ea),
          vil: Number(vil),
          house_no: house_no.toString(),
          street: street.toString(),
          soi: soi.toString(),
          building: building.toString(),
          tam: Number(tam),
          tam_name: tam_name.toString(),
          amp: Number(amp),
          amp_name: amp_name.toString(),
          tel_no: tel_no.toString(),
          e_mail: e_mail.toString(),
          econ_fm,
          regis_cid: regis_cid.toString(),
          regis_no: regis_no.toString(),
          cwt,
          cwt_name: cwt_name.toString(),
          reg,
        },
        create: {
          no: Number(no),
          es_id,
          tsic_code,
          size12: Number(size12),
          initial,
          firstname,
          lastname,
          comp_name: comp_name.toString(),
          district,
          ea: Number(ea),
          vil: Number(vil),
          house_no: house_no.toString(),
          street: street.toString(),
          soi: soi.toString(),
          building: building.toString(),
          tam: Number(tam),
          tam_name: tam_name.toString(),
          amp: Number(amp),
          amp_name: amp_name.toString(),
          tel_no: tel_no.toString(),
          e_mail: e_mail.toString(),
          econ_fm,
          regis_cid: regis_cid.toString(),
          regis_no: regis_no.toString(),
          cwt,
          cwt_name: cwt_name.toString(),
          reg,
        },
      });
    }

    return NextResponse.json("อัพโหลดสำเร็จ");
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e);
    }
    throw e;
  }
};
