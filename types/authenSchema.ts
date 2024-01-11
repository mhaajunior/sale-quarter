import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมล"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});
