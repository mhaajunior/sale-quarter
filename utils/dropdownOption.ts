import { getThaiYear } from "@/lib/quarter";
import { SelectOption } from "@/types/dto/common";
import { Role } from "@/types/dto/role";
import { mapProvinceName } from "./province";

export const typeOption: SelectOption[] = [
  { label: "การขายปลีก", value: 1 },
  { label: "ที่พักแรม", value: 2 },
  { label: "การบริการอาหารและเครื่องดื่ม", value: 3 },
  {
    label:
      "การผลิตภาพยนตร์ วีดิทัศน์ และรายการโทรทัศน์ การบันทึกเสียงลงบนสื่อ การจัดผังรายการและการแพร่ภาพกระจายเสียง และกิจกรรมสำนักข่าว",
    value: 4,
  },
  {
    label:
      "การให้เช่าของใช้ส่วนบุคคลและของใช้ในครัวเรือน และกิจกรรมการคัดเลือกนักแสดงภาพยนตร์โทรทัศน์ และการแสดงอื่นๆ",
    value: 5,
  },
  { label: "กิจกรรมศิลปะ ความบันเทิง และนันทนาการ", value: 6 },
  {
    label:
      "การซ่อมของใช้ส่วนบุคคลและของใช้ในครัวเรือน และกิจกรรมการบริการส่วนบุคคลอื่นๆ",
    value: 7,
  },
];

export const answerOption: SelectOption[] = [
  { label: "สัมภาษณ์", value: 1 },
  { label: "เว็บแอปพลิเคชั่น", value: 2 },
];

export const titleOption: SelectOption[] = [
  { label: "นาย", value: "นาย" },
  { label: "นาง", value: "นาง" },
  { label: "นางสาว", value: "นางสาว" },
  { label: "ไม่ทราบ", value: "ไม่ทราบ" },
  { label: "ไม่มี", value: "-" },
];

export const estTitleOption: SelectOption[] = [
  { label: "ไม่มี", value: "-" },
  { label: "หสม.", value: "หสม." },
  { label: "หสน.", value: "หสน." },
  { label: "หจก.", value: "หจก." },
  { label: "บจก.", value: "บจก." },
];

export const addUserTitleOption: SelectOption[] = [
  { label: "นาย", value: "นาย" },
  { label: "นาง", value: "นาง" },
  { label: "นางสาว", value: "นางสาว" },
];

export const roleOption: SelectOption[] = [
  { label: "เจ้าหน้าที่บันทึกข้อมูล", value: Role.INTERVIEWER },
  { label: "ผู้ตรวจ", value: Role.SUPERVISOR },
  { label: "เจ้าหน้าที่ส่วนกลาง", value: Role.SUBJECT },
];

const provinceOption: SelectOption[] = [];
for (const [key, value] of Object.entries(mapProvinceName)) {
  provinceOption.push({ label: value, value: key });
}
export { provinceOption };
