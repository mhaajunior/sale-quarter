import prisma from "./db";
import { join } from "path";
const continentData = require("./csvjson.json");

async function main() {
  continentData.map(async (continentItem: any) => {
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
    } = continentItem;
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
