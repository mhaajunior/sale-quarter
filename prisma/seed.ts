import prisma from "./db";
import { join } from "path";
const controls = require("./csvjson.json");

async function main() {
  controls.map(async (control: any) => {
    const {
      es_id,
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
    } = control;
    const response = await prisma.control.create({
      data: {
        es_id,
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
      },
    });
    return response;
  });

  controls.map(async (control: any) => {
    const { es_id } = control;

    const response = await prisma.reportStatus.create({
      data: {
        ID: es_id.toString(),
        year: 67,
        canCreateQtr1: true,
        canCreateQtr2: false,
        canCreateQtr3: false,
        canCreateQtr4: false,
        isSendQtr1: false,
        isSendQtr2: false,
        isSendQtr3: false,
        isSendQtr4: false,
      },
    });
    return response;
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
