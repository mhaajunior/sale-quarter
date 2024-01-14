import { Role } from "@prisma/client";
import prisma from "./db";
// import { join } from "path";
import bcrypt from "bcrypt";
const controls = require("./data/control.json");
const interviewers = require("./data/interviewer.json");
const supervisors = require("./data/supervisor.json");
const subjects = require("./data/subject.json");
const admins = require("./data/admin.json");

async function main() {
  for (let item of controls) {
    const {
      no,
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
    } = item;
    await prisma.reportStatus.upsert({
      where: { yearID: { ID: es_id.toString(), year: 67 } },
      update: {},
      create: {
        ID: es_id.toString(),
        year: 67,
        province: cwt,
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

    await prisma.control.upsert({
      where: { es_id },
      update: {},
      create: {
        no,
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
  }

  for (let item of interviewers) {
    const hashPassword = await bcrypt.hash(item.staff_password.toString(), 10);
    await prisma.user.upsert({
      where: { username: item.staff_username.toString() },
      update: {},
      create: {
        username: item.staff_username.toString(),
        password: hashPassword,
        fullname: item.staff_name,
        province: item.staff_prov,
        role: Role.INTERVIEWER,
      },
    });
  }

  for (let item of supervisors) {
    const hashPassword = await bcrypt.hash(item.staff_password.toString(), 10);
    await prisma.user.upsert({
      where: { username: item.staff_username.toString() },
      update: {},
      create: {
        username: item.staff_username.toString(),
        password: hashPassword,
        fullname: item.staff_name,
        province: item.staff_prov,
        role: Role.SUPERVISOR,
      },
    });
  }

  for (let item of subjects) {
    const hashPassword = await bcrypt.hash(item.password.toString(), 10);
    await prisma.user.upsert({
      where: { username: item.username.toString() },
      update: {},
      create: {
        username: item.username.toString(),
        password: hashPassword,
        fullname: item.fullname,
        province: 10,
        role: Role.SUBJECT,
      },
    });
  }

  for (let item of admins) {
    const hashPassword = await bcrypt.hash(item.password.toString(), 10);
    await prisma.user.upsert({
      where: { username: item.username.toString() },
      update: {},
      create: {
        username: item.username.toString(),
        password: hashPassword,
        fullname: item.fullname,
        province: 10,
        role: Role.ADMIN,
      },
    });
  }
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
