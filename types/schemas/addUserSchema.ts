import { hasNumber } from "@/lib/common";
import { z } from "zod";

export const addUserSchema = z.object({
  username: z
    .string()
    .min(1, "กรุณากรอกรหัสผู้ใช้")
    .length(7, "รหัสผู้ใช้ที่กรอกไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
  title: z.string({
    required_error: "กรุณาเลือกคำนำหน้านาม",
    invalid_type_error: "คำนำหน้านามไม่ถูกต้อง",
  }),
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .max(60, "ชื่อห้ามยาวเกินกว่า 60 ตัวอักษร")
    .refine((data) => !hasNumber(data), "ชื่อห้ามมีตัวเลข"),
  surname: z
    .string()
    .min(1, "กรุณากรอกนามสกุล")
    .max(60, "นามสกุลห้ามยาวเกินกว่า 60 ตัวอักษร")
    .refine((data) => !hasNumber(data), "นามสกุลห้ามมีตัวเลข"),
  role: z.string({
    required_error: "กรุณาเลือกบทบาท",
    invalid_type_error: "บทบาทไม่ถูกต้อง",
  }),
  province: z.string({
    required_error: "กรุณาเลือกจังหวัด",
    invalid_type_error: "จังหวัดไม่ถูกต้อง",
  }),
});

export type AddUserForm = z.infer<typeof addUserSchema>;
