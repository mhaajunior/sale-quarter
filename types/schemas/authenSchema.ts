import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(1, "กรุณากรอกอีเมล"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});
