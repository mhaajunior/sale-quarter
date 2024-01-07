import { z } from "zod";

export const searchIdSchema = z.object({
  ID: z
    .string({ required_error: "กรุณากรอกเลขประจำสถานประกอบการที่จะค้นหา" })
    .length(15, "เลขประจำสถานประกอบการต้องมี 15 หลัก")
    .refine((data) => Number(data), "เลขประจำสถานประกอบการต้องเป็นตัวเลข"),
});

export type SearchForm = z.infer<typeof searchIdSchema>;
