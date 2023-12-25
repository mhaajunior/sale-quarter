import { TSIC_R_ARR } from "@/utils/tsicR";
import { z } from "zod";

export const createReportSchema = z
  .object({
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
      .lte(96309, "TSIC_R ที่กรอกไม่ถูกต้อง"),
    TSIC_L: z
      .number({
        required_error: "กรุณากรอก TSIC_L",
        invalid_type_error: "TSIC_L ที่กรอกไม่ถูกต้อง",
      })
      .gte(47111, "TSIC_L ที่กรอกไม่ถูกต้อง")
      .lte(96309, "TSIC_L ที่กรอกไม่ถูกต้อง"),
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
    YR: z
      .number({
        required_error: "กรุณากรอก YR",
        invalid_type_error: "YR ที่กรอกไม่ถูกต้อง",
      })
      .gte(1, "YR ที่กรอกไม่ถูกต้อง"),
    ENU: z
      .number({
        required_error: "กรุณากรอก ENU",
        invalid_type_error: "ENU ที่กรอกไม่ถูกต้อง",
      })
      .gte(1, "ENU ที่กรอกไม่ถูกต้อง")
      .lte(11, "ENU ที่กรอกไม่ถูกต้อง"),
    TRADEMARK: z
      .string()
      .min(1, "กรุณากรอก TRADEMARK")
      .max(100, "TRADEMARK ที่กรอกยาวเกินกว่า 100 ตัวอักษร"),
    LG: z
      .number({
        required_error: "กรุณาเลือก LG",
        invalid_type_error: "กรุณาเลือก LG",
      })
      .gte(1, "LG ที่เลือกไม่ถูกต้อง")
      .lte(6, "LG ที่เลือกไม่ถูกต้อง")
      .optional(),
    LG1: z
      .string()
      .min(1, "กรุณากรอก LG1")
      .length(13, "LG1 ที่กรอกไม่ถูกต้อง")
      .optional(),
    LG2: z
      .string()
      .min(1, "กรุณากรอก LG2")
      .length(13, "LG2 ที่กรอกไม่ถูกต้อง")
      .optional(),
    LG3: z
      .string()
      .min(1, "กรุณากรอก LG3")
      .length(13, "LG3 ที่กรอกไม่ถูกต้อง")
      .optional(),
    LG4: z
      .string()
      .min(1, "กรุณากรอก LG4")
      .max(60, "LG4 ที่กรอกยาวเกินกว่า 60 ตัวอักษร")
      .optional(),
    TYPE: z
      .number({
        required_error: "กรุณาเลือก TYPE",
      })
      .gte(1, "TYPE ที่เลือกไม่ถูกต้อง")
      .lte(7, "TYPE ที่เลือกไม่ถูกต้อง")
      .optional(),
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
        invalid_type_error: "SI ที่เลือกไม่ถูกต้อง",
      })
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
      .number({
        required_error: "กรุณาเลือก CHG",
        invalid_type_error: "CHG ที่เลือกไม่ถูกต้อง",
      })
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
      .number({ invalid_type_error: "FAC ที่เลือกไม่ถูกต้อง" })
      .gte(1, "FAC ที่เลือกไม่ถูกต้อง")
      .lte(10, "FAC ที่เลือกไม่ถูกต้อง")
      .optional(),
    FAC_1: z
      .string()
      .min(1, "กรุณากรอก FAC_1")
      .max(100, "FAC_1 ที่กรอกยาวเกินกว่า 100 ตัวอักษร")
      .optional(),
    PRVS: z
      .number({
        required_error: "กรุณาเลือก PRVS",
        invalid_type_error: "PRVS ที่เลือกไม่ถูกต้อง",
      })
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
      .number({
        required_error: "กรุณากรอก EMP",
        invalid_type_error: "กรุณากรอก EMP",
      })
      .positive("EMP ที่กรอกไม่ถูกต้อง")
      .lte(9999, "PDE ที่กรอกต้องไม่ถึง 10,000 คน")
      .optional(),
    STO_temp: z.string().max(15, "STO ห้ามยาวกว่า 12 หลัก").optional(),
    STO: z.number().nonnegative().optional(),
    DAY: z
      .number({ invalid_type_error: "กรุณากรอก DAY" })
      .nonnegative("DAY ที่กรอกไม่ถูกต้อง")
      .lte(365, "DAY ห้ามเกิน 365 วัน")
      .optional(),
    P1: z.string().max(7, "P1 ห้ามยาวกว่า 7 หลัก").optional(),
    P2: z.string().max(7, "P2 ห้ามยาวกว่า 7 หลัก").optional(),
    P3: z.string().max(7, "P3 ห้ามยาวกว่า 7 หลัก").optional(),
    P4: z.string().max(7, "P4 ห้ามยาวกว่า 7 หลัก").optional(),
  })
  .superRefine(
    (
      { TSIC_R, LG1, LG2, LG3, ENU, LG, TYPE, SI, CHG, PRVS },
      refinementContext
    ) => {
      if (ENU == 1) {
        if (!LG) {
          return refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: "กรุณากรอก LG",
            path: ["LG"],
          });
        }
        if (!TYPE) {
          return refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: "กรุณากรอก TYPE",
            path: ["TYPE"],
          });
        }
        if (!SI) {
          return refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: "กรุณากรอก SI",
            path: ["SI"],
          });
        }
        if (!CHG) {
          return refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: "กรุณากรอก CHG",
            path: ["CHG"],
          });
        }
        if (!PRVS) {
          return refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: "กรุณากรอก PRVS",
            path: ["PRVS"],
          });
        }
      }

      if (!TSIC_R_ARR.includes(TSIC_R)) {
        return refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: "TSIC_R ที่กรอกไม่ถูกต้อง",
          path: ["TSIC_R"],
        });
      }

      if (LG1 && !Number(LG1)) {
        return refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: "LG1 ที่กรอกไม่ถูกต้อง",
          path: ["LG1"],
        });
      }

      if (LG2 && !Number(LG2)) {
        return refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: "LG2 ที่กรอกไม่ถูกต้อง",
          path: ["LG2"],
        });
      }

      if (LG3 && !Number(LG3)) {
        return refinementContext.addIssue({
          code: z.ZodIssueCode.custom,
          message: "LG3 ที่กรอกไม่ถูกต้อง",
          path: ["LG3"],
        });
      }
    }
  );

export type ReportForm = z.infer<typeof createReportSchema>;
