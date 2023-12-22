import { z } from "zod";

export const createReportSchema = z.object({
  REG: z
    .number({
      required_error: "กรุณากรอก REG",
      invalid_type_error: "REG ที่กรอกไม่ถูกต้อง",
    })
    .min(1, "ค่า REG ที่กรอกไม่ถูกต้อง")
    .max(5, "ค่า REG ที่กรอกไม่ถูกต้อง"),
  CWT: z
    .number({
      required_error: "กรุณากรอก CWT",
      invalid_type_error: "CWT ที่กรอกไม่ถูกต้อง",
    })
    .min(10, "ค่า CWT ที่กรอกไม่ถูกต้อง")
    .max(96, "ค่า CWT ที่กรอกไม่ถูกต้อง"),
  AMP: z
    .number({
      required_error: "กรุณากรอก AMP",
      invalid_type_error: "AMP ที่กรอกไม่ถูกต้อง",
    })
    .min(1, "ค่า AMP ที่กรอกไม่ถูกต้อง")
    .max(50, "ค่า AMP ที่กรอกไม่ถูกต้อง"),
  TAM: z
    .number({
      required_error: "กรุณากรอก TAM",
      invalid_type_error: "TAM ที่กรอกไม่ถูกต้อง",
    })
    .min(1, "ค่า TAM ที่กรอกไม่ถูกต้อง")
    .max(99, "ค่า TAM ที่กรอกไม่ถูกต้อง"),
  MUN: z
    .number({
      required_error: "กรุณากรอก MUN",
      invalid_type_error: "MUN ที่กรอกไม่ถูกต้อง",
    })
    .min(1, "ค่า MUN ที่กรอกไม่ถูกต้อง")
    .max(2, "ค่า MUN ที่กรอกไม่ถูกต้อง"),
  EA: z
    .number({
      required_error: "กรุณากรอก EA",
      invalid_type_error: "EA ที่กรอกไม่ถูกต้อง",
    })
    .min(0, "ค่า EA ที่กรอกไม่ถูกต้อง")
    .max(9999, "ค่า EA ที่กรอกไม่ถูกต้อง"),
  VIL: z
    .number({
      required_error: "กรุณากรอก VIL",
      invalid_type_error: "VIL ที่กรอกไม่ถูกต้อง",
    })
    .min(0, "ค่า VIL ที่กรอกไม่ถูกต้อง")
    .max(99, "ค่า VIL ที่กรอกไม่ถูกต้อง"),
  TSIC_R: z
    .number({
      required_error: "กรุณากรอก TSIC_R",
      invalid_type_error: "TSIC_R ที่กรอกไม่ถูกต้อง",
    })
    .min(47111, "ค่า TSIC_R ที่กรอกไม่ถูกต้อง")
    .max(96309, "ค่า TSIC_R ที่กรอกไม่ถูกต้อง"),
  TSIC_L: z
    .number({
      required_error: "กรุณากรอก TSIC_L",
      invalid_type_error: "TSIC_L ที่กรอกไม่ถูกต้อง",
    })
    .min(47111, "ค่า TSIC_L ที่กรอกไม่ถูกต้อง")
    .max(96309, "ค่า TSIC_L ที่กรอกไม่ถูกต้อง"),
  SIZE_R: z
    .number({
      required_error: "กรุณากรอก SIZE_R",
      invalid_type_error: "SIZE_R ที่กรอกไม่ถูกต้อง",
    })
    .min(1, "ค่า SIZE_R ที่กรอกไม่ถูกต้อง")
    .max(12, "ค่า SIZE_R ที่กรอกไม่ถูกต้อง"),
  SIZE_L: z
    .number({
      required_error: "กรุณากรอก SIZE_L",
      invalid_type_error: "SIZE_L ที่กรอกไม่ถูกต้อง",
    })
    .min(1, "ค่า SIZE_L ที่กรอกไม่ถูกต้อง")
    .max(12, "ค่า SIZE_L ที่กรอกไม่ถูกต้อง"),
  NO: z
    .number({
      required_error: "กรุณากรอก NO",
      invalid_type_error: "NO ที่กรอกไม่ถูกต้อง",
    })
    .min(1, "ค่า NO ที่กรอกไม่ถูกต้อง")
    .max(5000, "ค่า NO ที่กรอกไม่ถูกต้อง"),
  QTR: z
    .number({
      required_error: "กรุณากรอก QTR",
      invalid_type_error: "QTR ที่กรอกไม่ถูกต้อง",
    })
    .min(1, "ค่า QTR ที่กรอกไม่ถูกต้อง")
    .max(4, "ค่า QTR ที่กรอกไม่ถูกต้อง"),
  YR: z
    .number({
      required_error: "กรุณากรอก YR",
      invalid_type_error: "YR ที่กรอกไม่ถูกต้อง",
    })
    .min(1, "ค่า YR ที่กรอกไม่ถูกต้อง"),
  ENU: z
    .number({
      required_error: "กรุณากรอก ENU",
      invalid_type_error: "ENU ที่กรอกไม่ถูกต้อง",
    })
    .min(1, "ค่า ENU ที่กรอกไม่ถูกต้อง")
    .max(11, "ค่า ENU ที่กรอกไม่ถูกต้อง"),
  TRADEMARK: z
    .string()
    .min(1, "กรุณากรอก TRADEMARK")
    .max(100, "TRADEMARK ที่กรอกยาวเกินกว่า 100 ตัวอักษร"),
  LG: z
    .number({
      required_error: "กรุณาเลือก LG",
      invalid_type_error: "ค่า LG ที่เลือกไม่ถูกต้อง",
    })
    .gte(1, "LG ที่เลือกไม่ถูกต้อง")
    .lte(6, "LG ที่เลือกไม่ถูกต้อง"),
  LG1: z.string().max(13, "LG1 ที่กรอกไม่ถูกต้อง").nullable().optional(),
  LG2: z.string().max(13, "LG2 ที่กรอกไม่ถูกต้อง").nullable().optional(),
  LG3: z.string().max(13, "LG3 ที่กรอกไม่ถูกต้อง").nullable().optional(),
  LG4: z
    .string()
    .max(60, "LG4 ที่กรอกยาวเกินกว่า 60 ตัวอักษร")
    .nullable()
    .optional(),
  TYPE: z
    .number({
      required_error: "กรุณาเลือก TYPE",
    })
    .gte(1, "TYPE ที่เลือกไม่ถูกต้อง")
    .lte(7, "TYPE ที่เลือกไม่ถูกต้อง"),
  M1: z.string(),
  M2: z.string(),
  M3: z.string(),
  R1_temp: z.string().max(15, "R1 ห้ามยาวกว่า 12 หลัก").optional(),
  R2_temp: z.string().max(15, "R2 ห้ามยาวกว่า 12 หลัก").optional(),
  R3_temp: z.string().max(15, "R3 ห้ามยาวกว่า 12 หลัก").optional(),
  R1: z.number().nonnegative().optional(),
  R2: z.number().nonnegative().optional(),
  R3: z.number().nonnegative().optional(),
  TR: z.number().max(999999999999).nonnegative().nullable().optional(),
  SI: z
    .number({
      required_error: "กรุณาเลือก SI",
      invalid_type_error: "ค่า SI ที่เลือกไม่ถูกต้อง",
    })
    .gte(1, "SI ที่เลือกไม่ถูกต้อง")
    .lte(2, "SI ที่เลือกไม่ถูกต้อง"),
  ITR: z
    .number({ invalid_type_error: "กรุณากรอก ITR" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI1: z.boolean().optional(),
  SI2: z.boolean().optional(),
  SI3: z.boolean().optional(),
  SI4: z.boolean().optional(),
  SI5: z.boolean().optional(),
  SI6: z.boolean().optional(),
  SI7: z.boolean().optional(),
  SI8: z.string().max(60, "SI8 ที่กรอกยาวเกินกว่า 60 ตัวอักษร").optional(),
  SI11: z
    .number({ invalid_type_error: "กรุณากรอก SI11" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI22: z
    .number({ invalid_type_error: "กรุณากรอก SI22" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI33: z
    .number({ invalid_type_error: "กรุณากรอก SI33" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI44: z
    .number({ invalid_type_error: "กรุณากรอก SI44" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI55: z
    .number({ invalid_type_error: "กรุณากรอก SI55" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI66: z
    .number({ invalid_type_error: "กรุณากรอก SI66" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI77: z
    .number({ invalid_type_error: "กรุณากรอก SI77" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  F1: z
    .number({ invalid_type_error: "กรุณากรอก F1" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  F2: z
    .number({ invalid_type_error: "กรุณากรอก F2" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  F3: z
    .number({ invalid_type_error: "กรุณากรอก F3" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  F4: z
    .number({ invalid_type_error: "กรุณากรอก F4" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  F5: z
    .number({ invalid_type_error: "กรุณากรอก F5" })
    .nonnegative("ค่า ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  CHG: z
    .number({
      required_error: "กรุณาเลือก CHG",
      invalid_type_error: "ค่า CHG ที่เลือกไม่ถูกต้อง",
    })
    .gte(1, "CHG ที่เลือกไม่ถูกต้อง")
    .lte(3, "CHG ที่เลือกไม่ถูกต้อง"),
  CIN: z
    .number({ invalid_type_error: "กรุณากรอก CIN" })
    .nonnegative("ค่า CIN ที่กรอกไม่ถูกต้อง")
    .lte(100, "CIN ที่กรอกไม่ถูกต้อง")
    .optional(),
  CDE: z
    .number({ invalid_type_error: "กรุณากรอก CDE" })
    .nonnegative("ค่า CDE ที่กรอกไม่ถูกต้อง")
    .lte(100, "CDE ที่กรอกไม่ถูกต้อง")
    .optional(),
  FAC: z
    .number({ invalid_type_error: "ค่า FAC ที่เลือกไม่ถูกต้อง" })
    .gte(1, "FAC ที่เลือกไม่ถูกต้อง")
    .lte(10, "FAC ที่เลือกไม่ถูกต้อง")
    .optional(),
  FAC_1: z
    .string()
    .max(100, "FAC_1 ที่กรอกยาวเกินกว่า 100 ตัวอักษร")
    .optional(),
  PRVS: z
    .number({
      required_error: "กรุณาเลือก PRVS",
      invalid_type_error: "ค่า PRVS ที่เลือกไม่ถูกต้อง",
    })
    .gte(1, "PRVS ที่เลือกไม่ถูกต้อง")
    .lte(3, "PRVS ที่เลือกไม่ถูกต้อง"),
  PIN: z
    .number({ invalid_type_error: "กรุณากรอก PIN" })
    .nonnegative("ค่า PIN ที่กรอกไม่ถูกต้อง")
    .lte(100, "PIN ที่กรอกไม่ถูกต้อง")
    .optional(),
  PDE: z
    .number({ invalid_type_error: "กรุณากรอก PDE" })
    .nonnegative("ค่า PDE ที่กรอกไม่ถูกต้อง")
    .lte(100, "PDE ที่กรอกไม่ถูกต้อง")
    .optional(),
  EMP: z
    .number({
      required_error: "กรุณากรอก EMP",
      invalid_type_error: "กรุณากรอก EMP",
    })
    .positive("ค่า EMP ที่กรอกไม่ถูกต้อง")
    .lte(9999, "PDE ที่กรอกต้องไม่ถึง 10,000 คน"),
  STO_temp: z.string().max(15, "STO ห้ามยาวกว่า 12 หลัก").optional(),
  STO: z.number().nonnegative().optional(),
  DAY: z
    .number({ invalid_type_error: "กรุณากรอก DAY" })
    .nonnegative()
    .lte(365, "DAY ห้ามเกิน 365 วัน")
    .optional(),
});

export type ReportForm = z.infer<typeof createReportSchema>;
