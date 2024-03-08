import { verifyJwt } from "@/lib/jwt";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { encrypt, validateUserRole } from "../middleware";
import { Role } from "@/types/dto/role";
import { controlAttr } from "@/utils/control";
import { getThaiYear } from "@/lib/quarter";
import { mapProvinceName } from "@/utils/province";
import { ControlTable } from "@/types/dto/control";
import { padZero } from "@/lib/common";

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

  if (!body || body.length === 0) {
    return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
  }

  try {
    for (const item of body) {
      let count = 0;
      for (const [key, value] of Object.entries(item)) {
        if (controlAttr.includes(key)) {
          count++;
        }
      }
      if (count !== 28) {
        return NextResponse.json("ข้อมูลไม่ถูกต้อง", { status: 400 });
      }
      // var encrypted = CryptoES.AES.encrypt(
      //   "Message",
      //   process.env.NEXT_PUBLIC_PASSPHRASE as string
      // );
      // console.log(encrypted.toString());
      // var decrypted = CryptoES.AES.decrypt(
      //   encrypted,
      //   process.env.NEXT_PUBLIC_PASSPHRASE as string
      // );
      // console.log(decrypted.toString(CryptoES.enc.Utf8));

      const {
        es_id,
        no,
        tsic_code,
        size12,
        name_title,
        firstname,
        lastname,
        initial,
        comp_name,
        mun,
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
          no: padZero(no, 4),
          tsic_code: Number(tsic_code),
          size12: padZero(size12, 2),
          name_title,
          firstname: encrypt(firstname),
          lastname: encrypt(lastname),
          initial,
          comp_name: comp_name.toString(),
          mun: Number(mun),
          ea: padZero(ea, 4),
          vil: padZero(vil, 2),
          house_no: house_no.toString(),
          street: street.toString(),
          soi: soi.toString(),
          building: building.toString(),
          tam: padZero(tam, 2),
          tam_name: tam_name.toString(),
          amp: padZero(amp, 2),
          amp_name: amp_name.toString(),
          tel_no: tel_no.toString(),
          e_mail: e_mail.toString(),
          econ_fm: Number(econ_fm),
          regis_cid: encrypt(regis_cid),
          regis_no: encrypt(regis_no),
          cwt: Number(cwt),
          cwt_name: cwt_name.toString(),
          reg: Number(reg),
        },
        create: {
          no: padZero(no, 4),
          es_id,
          tsic_code: Number(tsic_code),
          size12: padZero(size12, 2),
          name_title,
          firstname: encrypt(firstname),
          lastname: encrypt(lastname),
          initial,
          comp_name: comp_name.toString(),
          mun: Number(mun),
          ea: padZero(ea, 4),
          vil: padZero(vil, 2),
          house_no: house_no.toString(),
          street: street.toString(),
          soi: soi.toString(),
          building: building.toString(),
          tam: padZero(tam, 2),
          tam_name: tam_name.toString(),
          amp: padZero(tam, 2),
          amp_name: amp_name.toString(),
          tel_no: tel_no.toString(),
          e_mail: e_mail.toString(),
          econ_fm: Number(econ_fm),
          regis_cid: encrypt(regis_cid),
          regis_no: encrypt(regis_no),
          cwt: Number(cwt),
          cwt_name: cwt_name.toString(),
          reg: Number(reg),
        },
      });

      const fullYear = new Date().getFullYear();
      const currentYear = getThaiYear(fullYear).yearSlice;

      await prisma.reportStatus.upsert({
        where: { yearID: { ID: es_id.toString(), year: currentYear } },
        update: {
          region: Number(reg),
          province: Number(cwt),
          province_name: cwt_name,
          canCreateQtr1: true, //pending edit
          canCreateQtr2: false,
          canCreateQtr3: false,
          canCreateQtr4: false,
          isSendQtr1: false,
          isSendQtr2: false,
          isSendQtr3: false,
          isSendQtr4: false,
          isApproveQtr1: false,
          isApproveQtr2: false,
          isApproveQtr3: false,
          isApproveQtr4: false,
        },
        create: {
          ID: es_id.toString(),
          year: currentYear,
          region: Number(reg),
          province: Number(cwt),
          province_name: cwt_name,
          canCreateQtr1: true, //pending edit,
          canCreateQtr2: false,
          canCreateQtr3: false,
          canCreateQtr4: false,
          isSendQtr1: false,
          isSendQtr2: false,
          isSendQtr3: false,
          isSendQtr4: false,
          isApproveQtr1: false,
          isApproveQtr2: false,
          isApproveQtr3: false,
          isApproveQtr4: false,
        },
      });
    }

    return NextResponse.json("อัพโหลดสำเร็จ");
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    throw e;
  }
};

//get total control by province for admin
export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get("authorization");

  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json("ยังไม่ได้เข้าสู่ระบบ", { status: 401 });
  }

  if (!validateUserRole(accessToken, [Role.ADMIN])) {
    return NextResponse.json("ไม่สามารถเข้าถึงข้อมูลได้", { status: 401 });
  }

  try {
    const controls = await prisma.control.groupBy({
      by: "cwt",
      _count: { es_id: true },
      orderBy: { cwt: "asc" },
    });

    let temp: any = {};
    const res: ControlTable[] = [];

    for (const control of controls) {
      temp[control.cwt] = control._count.es_id;
    }

    for (const [key, value] of Object.entries(mapProvinceName)) {
      res.push({ key, id: key, name: value, count: temp[key] || 0 });
    }

    return NextResponse.json(res);
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log(e);
    // }
    throw e;
  }
};
