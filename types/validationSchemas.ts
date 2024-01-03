import {
  assertThaiId,
  between,
  currencyToNumber,
  hasNumber,
  isNumNull,
} from "@/helpers/common";
import { getQuarterDate } from "@/helpers/quarter";
import { TSIC_R_ARR } from "@/utils/tsicR";
import { z } from "zod";
import validator from "validator";

const quarter = getQuarterDate();

export const createReportSchema = z.object({
  REG: z
    .number({
      required_error: "กรุณากรอก REG",
      invalid_type_error: "REG ที่กรอกไม่ถูกต้อง",
    })
    .gte(1, "REG ที่กรอกไม่ถูกต้อง")
    .lte(5, "REG ที่กรอกไม่ถูกต้อง"),
  CWT: z
    .number({
      required_error: "กรุณากรอก CWT",
      invalid_type_error: "CWT ที่กรอกไม่ถูกต้อง",
    })
    .gte(10, "CWT ที่กรอกไม่ถูกต้อง")
    .lte(96, "CWT ที่กรอกไม่ถูกต้อง"),
  AMP: z
    .number({
      required_error: "กรุณากรอก AMP",
      invalid_type_error: "AMP ที่กรอกไม่ถูกต้อง",
    })
    .gte(1, "AMP ที่กรอกไม่ถูกต้อง")
    .lte(50, "AMP ที่กรอกไม่ถูกต้อง"),
  TAM: z
    .number({
      required_error: "กรุณากรอก TAM",
      invalid_type_error: "TAM ที่กรอกไม่ถูกต้อง",
    })
    .gte(1, "TAM ที่กรอกไม่ถูกต้อง")
    .lte(99, "TAM ที่กรอกไม่ถูกต้อง"),
  MUN: z
    .number({
      required_error: "กรุณากรอก MUN",
      invalid_type_error: "MUN ที่กรอกไม่ถูกต้อง",
    })
    .gte(1, "MUN ที่กรอกไม่ถูกต้อง")
    .lte(2, "MUN ที่กรอกไม่ถูกต้อง"),
  EA: z
    .number({
      required_error: "กรุณากรอก EA",
      invalid_type_error: "EA ที่กรอกไม่ถูกต้อง",
    })
    .gte(0, "EA ที่กรอกไม่ถูกต้อง")
    .lte(9999, "EA ที่กรอกไม่ถูกต้อง"),
  VIL: z
    .number({
      required_error: "กรุณากรอก VIL",
      invalid_type_error: "VIL ที่กรอกไม่ถูกต้อง",
    })
    .gte(0, "VIL ที่กรอกไม่ถูกต้อง")
    .lte(99, "VIL ที่กรอกไม่ถูกต้อง"),
  TSIC_R: z
    .number({
      required_error: "กรุณากรอก TSIC_R",
      invalid_type_error: "TSIC_R ที่กรอกไม่ถูกต้อง",
    })
    .gte(47111, "TSIC_R ที่กรอกไม่ถูกต้อง")
    .lte(96309, "TSIC_R ที่กรอกไม่ถูกต้อง")
    .refine((data) => TSIC_R_ARR.includes(data), "TSIC_R ที่กรอกไม่ถูกต้อง"),
  TSIC_L: z
    .number({
      required_error: "กรุณากรอก TSIC_L",
      invalid_type_error: "TSIC_L ที่กรอกไม่ถูกต้อง",
    })
    .gte(47111, "TSIC_L ที่กรอกไม่ถูกต้อง")
    .lte(96309, "TSIC_L ที่กรอกไม่ถูกต้อง")
    .refine((data) => TSIC_R_ARR.includes(data), "TSIC_L ที่กรอกไม่ถูกต้อง"),
  SIZE_R: z
    .number({
      required_error: "กรุณากรอก SIZE_R",
      invalid_type_error: "SIZE_R ที่กรอกไม่ถูกต้อง",
    })
    .gte(1, "SIZE_R ที่กรอกไม่ถูกต้อง")
    .lte(12, "SIZE_R ที่กรอกไม่ถูกต้อง"),
  SIZE_L: z
    .number({
      required_error: "กรุณากรอก SIZE_L",
      invalid_type_error: "SIZE_L ที่กรอกไม่ถูกต้อง",
    })
    .gte(1, "SIZE_L ที่กรอกไม่ถูกต้อง")
    .lte(12, "SIZE_L ที่กรอกไม่ถูกต้อง"),
  NO: z
    .number({
      required_error: "กรุณากรอก NO",
      invalid_type_error: "NO ที่กรอกไม่ถูกต้อง",
    })
    .gte(1, "NO ที่กรอกไม่ถูกต้อง")
    .lte(5000, "NO ที่กรอกไม่ถูกต้อง"),
  QTR: z
    .number({
      required_error: "กรุณากรอก QTR",
      invalid_type_error: "QTR ที่กรอกไม่ถูกต้อง",
    })
    .gte(1, "QTR ที่กรอกไม่ถูกต้อง")
    .lte(4, "QTR ที่กรอกไม่ถูกต้อง"),
  YR: z.number({
    required_error: "กรุณากรอก YR",
    invalid_type_error: "YR ที่กรอกไม่ถูกต้อง",
  }),
  ENU: z
    .number({
      required_error: "กรุณากรอก ENU",
      invalid_type_error: "ENU ที่กรอกไม่ถูกต้อง",
    })
    .gte(1, "ENU ที่กรอกไม่ถูกต้อง")
    .lte(11, "ENU ที่กรอกไม่ถูกต้อง"),
  TITLE: z
    .string()
    .min(1, "กรุณากรอก TITLE")
    .max(10, "TITLE ที่กรอกยาวเกินกว่า 10 ตัวอักษร")
    .refine((data) => !hasNumber(data), "TITLE ที่กรอกไม่ถูกต้อง"),
  FIRSTNAME: z
    .string()
    .min(1, "กรุณากรอก FIRSTNAME")
    .max(60, "FIRSTNAME ที่กรอกยาวเกินกว่า 60 ตัวอักษร")
    .refine((data) => !hasNumber(data), "FIRSTNAME ที่กรอกไม่ถูกต้อง"),
  LASTNAME: z
    .string()
    .min(1, "กรุณากรอก LASTNAME")
    .max(60, "LASTNAME ที่กรอกยาวเกินกว่า 60 ตัวอักษร")
    .refine((data) => !hasNumber(data), "LASTNAME ที่กรอกไม่ถูกต้อง"),
  TRADEMARK: z
    .string()
    .min(1, "กรุณากรอก TRADEMARK")
    .max(100, "TRADEMARK ที่กรอกยาวเกินกว่า 100 ตัวอักษร"),
  ADD_NO: z
    .string()
    .max(10, "ADD_NO ที่กรอกยาวเกินกว่า 10 ตัวอักษร")
    .optional(),
  BLK: z.string().max(30, "BLK ที่กรอกยาวเกินกว่า 30 ตัวอักษร").optional(),
  STREET: z
    .string()
    .max(50, "STREET ที่กรอกยาวเกินกว่า 50 ตัวอักษร")
    .optional(),
  TAMBOL: z
    .string()
    .max(30, "TAMBOL ที่กรอกยาวเกินกว่า 30 ตัวอักษร")
    .optional(),
  AMPHOR: z
    .string()
    .max(30, "AMPHOR ที่กรอกยาวเกินกว่า 30 ตัวอักษร")
    .optional(),
  POST_CODE: z.union([
    z.string().regex(new RegExp("^\\d{5}$"), "POST_CODE ที่กรอกไม่ถูกต้อง"),
    z.literal(""),
  ]),
  TEL_NO: z.union([
    z.string().refine(validator.isMobilePhone, "TEL_NO ที่กรอกไม่ถูกต้อง"),
    z.literal(""),
  ]),
  FAX_NO: z.union([
    z.string().refine(validator.isMobilePhone, "FAX_NO ที่กรอกไม่ถูกต้อง"),
    z.literal(""),
  ]),
  E_MAIL: z.union([
    z
      .string()
      .email("E_MAIL ที่กรอกไม่ถูกต้อง")
      .max(40, "E_MAIL ที่กรอกยาวเกินกว่า 40 ตัวอักษร"),
    z.literal(""),
  ]),
  DES_TYPE: z
    .string()
    .min(1, "กรุณากรอก DES_TYPE")
    .max(60, "DES_TYPE ที่กรอกยาวเกินกว่า 60 ตัวอักษร"),
  TSIC_CHG: z.union([
    z
      .number({ invalid_type_error: "กรุณากรอก TSIC_CHG" })
      .refine(
        (data) => between(data, 10111, 99009),
        "TSIC_CHG ที่กรอกไม่ถูกต้อง"
      )
      .optional(),
    z.literal(""),
  ]),
  LG: z
    .number({ invalid_type_error: "กรุณาเลือก LG" })
    .gte(1, "LG ที่เลือกไม่ถูกต้อง")
    .lte(6, "LG ที่เลือกไม่ถูกต้อง")
    .optional(),
  LG1: z
    .string()
    .min(1, "กรุณากรอก LG1")
    .length(13, "LG1 ที่กรอกไม่ถูกต้อง")
    .refine((data) => Number(data), "LG1 ที่กรอกไม่ถูกต้อง")
    .optional(),
  LG1_temp: z.enum(["1", "2"]).optional(),
  LG2: z
    .string()
    .min(1, "กรุณากรอก LG2")
    .length(13, "LG2 ที่กรอกไม่ถูกต้อง")
    .refine((data) => Number(data), "LG2 ที่กรอกไม่ถูกต้อง")
    .optional(),
  LG3: z
    .string()
    .min(1, "กรุณากรอก LG3")
    .length(13, "LG3 ที่กรอกไม่ถูกต้อง")
    .refine((data) => Number(data), "LG3 ที่กรอกไม่ถูกต้อง")
    .optional(),
  LG4: z
    .string()
    .min(1, "กรุณากรอก LG4")
    .max(60, "LG4 ที่กรอกยาวเกินกว่า 60 ตัวอักษร")
    .optional(),
  TYPE: z
    .number({ invalid_type_error: "กรุณาเลือก TYPE" })
    .gte(1, "กรุณาเลือก TYPE")
    .lte(7, "TYPE ที่เลือกไม่ถูกต้อง")
    .optional(),
  M1: z.string().default(quarter.rangeVal[0]),
  M2: z.string().default(quarter.rangeVal[1]),
  M3: z.string().default(quarter.rangeVal[2]),
  R1_temp: z
    .string()
    .min(1, "กรุณากรอก R1")
    .max(15, "R1 ห้ามยาวกว่า 12 หลัก")
    .refine((data) => Number(currencyToNumber(data)), "R1 ที่กรอกไม่ถูกต้อง")
    .optional(),
  R2_temp: z
    .string()
    .min(1, "กรุณากรอก R2")
    .max(15, "R2 ห้ามยาวกว่า 12 หลัก")
    .refine((data) => Number(currencyToNumber(data)), "R2 ที่กรอกไม่ถูกต้อง")
    .optional(),
  R3_temp: z
    .string()
    .min(1, "กรุณากรอก R3")
    .max(15, "R3 ห้ามยาวกว่า 12 หลัก")
    .refine((data) => Number(currencyToNumber(data)), "R3 ที่กรอกไม่ถูกต้อง")
    .optional(),
  R1: z.number().max(999999999999).nonnegative().optional(),
  R2: z.number().max(999999999999).nonnegative().optional(),
  R3: z.number().max(999999999999).nonnegative().optional(),
  TR: z.number().max(999999999999).nonnegative().nullable().optional(),
  SI: z
    .number({ invalid_type_error: "กรุณาเลือก SI" })
    .gte(1, "SI ที่เลือกไม่ถูกต้อง")
    .lte(2, "SI ที่เลือกไม่ถูกต้อง")
    .optional(),
  ITR: z
    .number({ invalid_type_error: "กรุณากรอก ITR" })
    .positive("ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI1: z.boolean().optional(),
  SI2: z.boolean().optional(),
  SI3: z.boolean().optional(),
  SI4: z.boolean().optional(),
  SI5: z.boolean().optional(),
  SI6: z.boolean().optional(),
  SI7: z.boolean().optional(),
  SI8: z
    .string()
    .min(1, "กรุณากรอก SI8")
    .max(60, "SI8 ที่กรอกยาวเกินกว่า 60 ตัวอักษร")
    .optional(),
  SI11: z
    .number({ invalid_type_error: "กรุณากรอก SI11" })
    .positive("SI11 ที่กรอกไม่ถูกต้อง")
    .lte(100, "SI11 ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI22: z
    .number({ invalid_type_error: "กรุณากรอก SI22" })
    .positive("ITR ที่กรอกไม่ถูกต้อง")
    .lte(100, "ITR ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI33: z
    .number({ invalid_type_error: "กรุณากรอก SI33" })
    .positive("SI33 ที่กรอกไม่ถูกต้อง")
    .lte(100, "SI33 ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI44: z
    .number({ invalid_type_error: "กรุณากรอก SI44" })
    .positive("SI44 ที่กรอกไม่ถูกต้อง")
    .lte(100, "SI44 ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI55: z
    .number({ invalid_type_error: "กรุณากรอก SI55" })
    .positive("SI55 ที่กรอกไม่ถูกต้อง")
    .lte(100, "SI55 ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI66: z
    .number({ invalid_type_error: "กรุณากรอก SI66" })
    .positive("SI66 ที่กรอกไม่ถูกต้อง")
    .lte(100, "SI66 ที่กรอกไม่ถูกต้อง")
    .optional(),
  SI77: z
    .number({ invalid_type_error: "กรุณากรอก SI77" })
    .positive("SI77 ที่กรอกไม่ถูกต้อง")
    .lte(100, "SI77 ที่กรอกไม่ถูกต้อง")
    .optional(),
  F1: z
    .number({ invalid_type_error: "กรุณากรอก F1" })
    .positive("F1 ที่กรอกไม่ถูกต้อง")
    .lte(100, "F1 ที่กรอกไม่ถูกต้อง")
    .optional(),
  F2: z
    .number({ invalid_type_error: "กรุณากรอก F2" })
    .positive("F2 ที่กรอกไม่ถูกต้อง")
    .lte(100, "F2 ที่กรอกไม่ถูกต้อง")
    .optional(),
  F3: z
    .number({ invalid_type_error: "กรุณากรอก F3" })
    .positive("F3 ที่กรอกไม่ถูกต้อง")
    .lte(100, "F3 ที่กรอกไม่ถูกต้อง")
    .optional(),
  F4: z
    .number({ invalid_type_error: "กรุณากรอก F4" })
    .positive("F4 ที่กรอกไม่ถูกต้อง")
    .lte(100, "F4 ที่กรอกไม่ถูกต้อง")
    .optional(),
  F5: z
    .number({ invalid_type_error: "กรุณากรอก F5" })
    .positive("F5 ที่กรอกไม่ถูกต้อง")
    .lte(100, "F5 ที่กรอกไม่ถูกต้อง")
    .optional(),
  CHG: z
    .number({ invalid_type_error: " กรุณาเลือก CHG" })
    .gte(1, "CHG ที่เลือกไม่ถูกต้อง")
    .lte(3, "CHG ที่เลือกไม่ถูกต้อง")
    .optional(),
  CIN: z
    .number({ invalid_type_error: "กรุณากรอก CIN" })
    .positive("CIN ที่กรอกไม่ถูกต้อง")
    .lte(100, "CIN ที่กรอกไม่ถูกต้อง")
    .optional(),
  CDE: z
    .number({ invalid_type_error: "กรุณากรอก CDE" })
    .positive("CDE ที่กรอกไม่ถูกต้อง")
    .lte(100, "CDE ที่กรอกไม่ถูกต้อง")
    .optional(),
  FAC: z
    .number({ invalid_type_error: "กรุณาเลือก FAC" })
    .gte(1, "FAC ที่เลือกไม่ถูกต้อง")
    .lte(10, "FAC ที่เลือกไม่ถูกต้อง")
    .optional(),
  FAC_1: z
    .string()
    .min(1, "กรุณากรอก FAC_1")
    .max(100, "FAC_1 ที่กรอกยาวเกินกว่า 100 ตัวอักษร")
    .optional(),
  PRVS: z
    .number({ invalid_type_error: "กรุณาเลือก PRVS" })
    .gte(1, "PRVS ที่เลือกไม่ถูกต้อง")
    .lte(3, "PRVS ที่เลือกไม่ถูกต้อง")
    .optional(),
  PIN: z
    .number({ invalid_type_error: "กรุณากรอก PIN" })
    .positive("PIN ที่กรอกไม่ถูกต้อง")
    .lte(100, "PIN ที่กรอกไม่ถูกต้อง")
    .optional(),
  PDE: z
    .number({ invalid_type_error: "กรุณากรอก PDE" })
    .positive("PDE ที่กรอกไม่ถูกต้อง")
    .lte(100, "PDE ที่กรอกไม่ถูกต้อง")
    .optional(),
  EMP: z
    .number({ invalid_type_error: "กรุณากรอก EMP" })
    .positive("EMP ที่กรอกไม่ถูกต้อง")
    .lte(9999, "PDE ที่กรอกต้องไม่ถึง 10,000 คน")
    .optional(),
  STO_temp: z
    .string()
    .min(1, "กรุณากรอก STO")
    .max(15, "STO ห้ามยาวกว่า 12 หลัก")
    .refine((data) => Number(currencyToNumber(data)), "STO ที่กรอกไม่ถูกต้อง")
    .optional(),
  STO: z.number().max(999999999999).nonnegative().optional(),
  DAY: z
    .number({ invalid_type_error: "กรุณากรอก DAY" })
    .nonnegative("DAY ที่กรอกไม่ถูกต้อง")
    .lte(365, "DAY ห้ามเกิน 365 วัน")
    .optional(),
  P1: z.string().min(1, "กรุณากรอก P1").length(7, "P1 ที่กรอกไม่ถูกต้อง"),
  P2: z.string().min(1, "กรุณากรอก P2").length(7, "P2 ที่กรอกไม่ถูกต้อง"),
  P3: z.string().min(1, "กรุณากรอก P3").length(7, "P3 ที่กรอกไม่ถูกต้อง"),
  P4: z.string().min(1, "กรุณากรอก P4").length(7, "P4 ที่กรอกไม่ถูกต้อง"),
});

export type ReportForm = z.infer<typeof createReportSchema>;
