import prisma from "./db";
import bcrypt from "bcrypt";
const interviewers = require("./data/interviewer.json");
const supervisors = require("./data/supervisor.json");
const subjects = require("./data/subject.json");
const admins = require("./data/admin.json");
const reports = require("./data/report4_66.json");

async function main() {
  for (let item of interviewers) {
    const hashPassword = await bcrypt.hash(item.staff_password.toString(), 10);
    await prisma.user.upsert({
      where: { username: item.staff_username.toString() },
      update: {
        password: hashPassword,
        fullname: item.staff_name.toString(),
        province: item.staff_prov,
      },
      create: {
        username: item.staff_username.toString(),
        password: hashPassword,
        fullname: item.staff_name.toString(),
        province: item.staff_prov,
        role: "INTERVIEWER",
      },
    });
  }
  for (let item of supervisors) {
    const hashPassword = await bcrypt.hash(item.staff_password.toString(), 10);
    await prisma.user.upsert({
      where: { username: item.staff_username.toString() },
      update: {
        password: hashPassword,
        fullname: item.staff_name.toString(),
        province: item.staff_prov,
      },
      create: {
        username: item.staff_username.toString(),
        password: hashPassword,
        fullname: item.staff_name.toString(),
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
  for (let item of reports) {
    const id = Number(item.id1);
    const sto = Number(item.sto) || 0;
    await prisma.tempTabulation.upsert({
      where: { ID: id.toString() },
      update: {},
      create: {
        ID: item.id1.toString(),
        TR: item.tr ? Number(item.tr) : 0,
        STO: sto.toString(),
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
