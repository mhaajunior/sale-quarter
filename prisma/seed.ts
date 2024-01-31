import prisma from "./db";
import bcrypt from "bcrypt";
const controls_10 = require("./data/control/ctrl_66_cwt10.json");
const controls_11 = require("./data/control/ctrl_66_cwt11.json");
const controls_12 = require("./data/control/ctrl_66_cwt12.json");
const controls_30 = require("./data/control/ctrl_66_cwt30.json");
const controls_31 = require("./data/control/ctrl_66_cwt31.json");
const controls_32 = require("./data/control/ctrl_66_cwt32.json");
const controls_48 = require("./data/control/ctrl_66_cwt48.json");
const controls_49 = require("./data/control/ctrl_66_cwt49.json");
const controls_50 = require("./data/control/ctrl_66_cwt50.json");
const controls_51 = require("./data/control/ctrl_66_cwt51.json");
const controls_65 = require("./data/control/ctrl_66_cwt65.json");
const controls_66 = require("./data/control/ctrl_66_cwt66.json");
const controls_67 = require("./data/control/ctrl_66_cwt67.json");
const controls_70 = require("./data/control/ctrl_66_cwt70.json");
const controls_71 = require("./data/control/ctrl_66_cwt71.json");
const controls_77 = require("./data/control/ctrl_66_cwt77.json");
const controls_80 = require("./data/control/ctrl_66_cwt80.json");
const controls_81 = require("./data/control/ctrl_66_cwt81.json");
const controls_94 = require("./data/control/ctrl_66_cwt94.json");
const controls_95 = require("./data/control/ctrl_66_cwt95.json");
const controls_96 = require("./data/control/ctrl_66_cwt96.json");
const interviewers = require("./data/interviewer.json");
const supervisors = require("./data/supervisor.json");
const subjects = require("./data/subject.json");
const admins = require("./data/admin.json");

const controlArr = [
  controls_10,
  controls_11,
  controls_12,
  controls_30,
  controls_31,
  controls_32,
  controls_48,
  controls_49,
  controls_50,
  controls_51,
  controls_65,
  controls_66,
  controls_67,
  controls_70,
  controls_71,
  controls_77,
  controls_80,
  controls_81,
  controls_94,
  controls_95,
  controls_96,
];

async function main() {
  for (let control of controlArr) {
    for (let item of control) {
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
          region: reg,
          province: cwt,
          province_name: cwt_name,
          canCreateQtr1: true,
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
      await prisma.control.upsert({
        where: { yearID: { es_id, yr: 67 } },
        update: {},
        create: {
          no: no.toString(),
          es_id,
          tsic_code,
          size12: size12.toString(),
          initial,
          firstname,
          lastname,
          comp_name: comp_name.toString(),
          district,
          ea: ea.toString(),
          vil: vil.toString(),
          house_no: house_no.toString(),
          street: street.toString(),
          soi: soi.toString(),
          building: building.toString(),
          tam: tam.toString(),
          tam_name: tam_name.toString(),
          amp: amp.toString(),
          amp_name: amp_name.toString(),
          tel_no: tel_no.toString(),
          e_mail: e_mail.toString(),
          econ_fm,
          regis_cid: regis_cid.toString(),
          regis_no: regis_no.toString(),
          cwt,
          cwt_name: cwt_name.toString(),
          reg,
          yr: 67,
        },
      });
    }
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
        role: "INTERVIEWER",
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
        role: "SUPERVISOR",
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
        role: "SUBJECT",
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
        role: "ADMIN",
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
