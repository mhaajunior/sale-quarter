import {
  assertThaiId,
  between,
  currencyToNumber,
  hasNumber,
  isNumNull,
} from "@/helpers/common";
import { calcQuarter, quarterMap } from "@/helpers/quarter";
import { TSIC_R_ARR } from "@/utils/tsicR";
import { z } from "zod";
import validator from "validator";

const quarter = quarterMap(new Date().getFullYear())[calcQuarter() - 1];

export const createReportSchema = z
  .object({
    ID: z
      .string({
        required_error: "ไม่มีเลขประจำสถานประกอบการ",
      })
      .length(15, "เลขประจำสถานประกอบการไม่ถูกต้อง"),
    REG: z
      .number({
        required_error: "กรุณากรอกภาค",
        invalid_type_error: "ภาคที่กรอกไม่ถูกต้อง",
      })
      .gte(1, "ภาคที่กรอกไม่ถูกต้อง")
      .lte(5, "ภาคที่กรอกไม่ถูกต้อง"),
    CWT: z
      .number({
        required_error: "กรุณากรอกจังหวัด",
        invalid_type_error: "จังหวัดที่กรอกไม่ถูกต้อง",
      })
      .gte(10, "จังหวัดที่กรอกไม่ถูกต้อง")
      .lte(96, "จังหวัดที่กรอกไม่ถูกต้อง"),
    AMP: z
      .number({
        required_error: "กรุณากรอกอำเภอ",
        invalid_type_error: "อำเภอที่กรอกไม่ถูกต้อง",
      })
      .gte(1, "อำเภอที่กรอกไม่ถูกต้อง")
      .lte(50, "อำเภอที่กรอกไม่ถูกต้อง"),
    TAM: z
      .number({
        required_error: "กรุณากรอกตำบล",
        invalid_type_error: "ตำบลที่กรอกไม่ถูกต้อง",
      })
      .gte(1, "ตำบลที่กรอกไม่ถูกต้อง")
      .lte(99, "ตำบลที่กรอกไม่ถูกต้อง"),
    MUN: z
      .number({
        required_error: "กรุณากรอกเขตการปกครอง",
        invalid_type_error: "เขตการปกครองที่กรอกไม่ถูกต้อง",
      })
      .gte(1, "เขตการปกครองที่กรอกไม่ถูกต้อง")
      .lte(2, "เขตการปกครองที่กรอกไม่ถูกต้อง"),
    EA: z
      .number({
        required_error: "กรุณากรอกเขตการแจงนับ",
        invalid_type_error: "เขตการแจงนับที่กรอกไม่ถูกต้อง",
      })
      .gte(0, "เขตการแจงนับที่กรอกไม่ถูกต้อง")
      .lte(9999, "เขตการแจงนับที่กรอกไม่ถูกต้อง"),
    VIL: z
      .number({
        required_error: "กรุณากรอกหมู่บ้าน",
        invalid_type_error: "หมู่บ้านที่กรอกไม่ถูกต้อง",
      })
      .gte(0, "หมู่บ้านที่กรอกไม่ถูกต้อง")
      .lte(99, "หมู่บ้านที่กรอกไม่ถูกต้อง"),
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
      .min(1, "กรุณากรอกคำนำหน้านาม")
      .max(10, "คำนำหน้านามห้ามยาวเกินกว่า 10 ตัวอักษร")
      .refine((data) => !hasNumber(data), "คำนำหน้านามห้ามมีตัวเลข"),
    RANK: z
      .string()
      .min(1, "กรุณากรอกยศ")
      .max(20, "ยศห้ามยาวเกินกว่า 20 ตัวอักษร")
      .refine((data) => !hasNumber(data), "ยศห้ามมีตัวเลข"),
    FIRSTNAME: z
      .string()
      .min(1, "กรุณากรอกชื่อ")
      .max(60, "ชื่อห้ามยาวเกินกว่า 60 ตัวอักษร")
      .refine((data) => !hasNumber(data), "ชื่อห้ามมีตัวเลข"),
    LASTNAME: z
      .string()
      .min(1, "กรุณากรอกนามสกุล")
      .max(60, "นามสกุลห้ามยาวเกินกว่า 60 ตัวอักษร")
      .refine((data) => !hasNumber(data), "นามสกุลห้ามมีตัวเลข"),
    EST_TITLE: z
      .string()
      .min(1, "กรุณากรอกคำนำหน้าชื่อสถานประกอบการ")
      .max(10, "คำนำหน้าชื่อสถานประกอบการห้ามยาวเกินกว่า 10 ตัวอักษร"),
    EST_NAME: z
      .string()
      .min(1, "กรุณากรอกชื่อสถานประกอบการ")
      .max(100, "ชื่อสถานประกอบการห้ามยาวเกินกว่า 100 ตัวอักษร"),
    ADD_NO: z
      .string()
      .min(1, "กรุณากรอกเลขที่")
      .max(10, "เลขที่ห้ามยาวเกินกว่า 10 ตัวอักษร"),
    BUILDING: z
      .string()
      .min(1, "กรุณากรอกชื่ออาคาร/หมู่บ้าน")
      .max(60, "ชื่ออาคาร/หมู่บ้านห้ามยาวเกินกว่า 60 ตัวอักษร"),
    ROOM: z
      .string()
      .min(1, "กรุณากรอกห้องเลขที่/ชั้นที่")
      .max(30, "ห้องเลขที่/ชั้นที่ห้ามยาวเกินกว่า 30 ตัวอักษร"),
    STREET: z
      .string()
      .min(1, "กรุณากรอกถนน")
      .max(50, "ถนนห้ามยาวเกินกว่า 50 ตัวอักษร"),
    BLK: z
      .string()
      .min(1, "กรุณากรอกตรอก")
      .max(30, "ตรอกห้ามยาวเกินกว่า 30 ตัวอักษร")
      .optional(),
    SOI: z
      .string()
      .min(1, "กรุณากรอกซอย")
      .max(30, "ซอยห้ามยาวเกินกว่า 30 ตัวอักษร"),
    SUB_DIST: z
      .string()
      .min(1, "กรุณากรอกตำบล/แขวง")
      .max(30, "ตำบล/แขวงห้ามยาวเกินกว่า 30 ตัวอักษร"),
    DISTRICT: z
      .string()
      .min(1, "กรุณากรอกอำเภอ/เขต")
      .max(30, "อำเภอ/เขตห้ามยาวเกินกว่า 30 ตัวอักษร"),
    PROVINCE: z
      .string()
      .min(1, "กรุณากรอกจังหวัด")
      .max(30, "จังหวัดห้ามยาวเกินกว่า 30 ตัวอักษร"),
    POST_CODE: z.union([
      z
        .string()
        .min(1, "กรุณากรอกรหัสไปรษณีย์")
        .regex(new RegExp("^\\d{5}$"), "รหัสไปรษณีย์ไม่ถูกต้อง"),
      z.literal("-"),
    ]),
    TEL_NO: z.union([
      z
        .string()
        .min(1, "กรุณากรอกหมายเลขโทรศัพท์")
        .refine(validator.isMobilePhone, "หมายเลขโทรศัพท์ไม่ถูกต้อง"),
      z.literal("-"),
    ]),
    E_MAIL: z.union([
      z
        .string()
        .min(1, "กรุณากรอกอีเมล")
        .max(30, "อีเมลห้ามยาวเกินกว่า 40 ตัวอักษร")
        .email("อีเมลไม่ถูกต้อง"),
      z.literal("-"),
    ]),
    WEBSITE: z
      .string()
      .min(1, "กรุณากรอก Website")
      .max(30, "Website ห้ามยาวเกินกว่า 30 ตัวอักษร"),
    SOCIAL: z
      .string()
      .min(1, "กรุณากรอก Social Media")
      .max(30, "Social Media ห้ามยาวเกินกว่า 30 ตัวอักษร"),
    DES_TYPE: z
      .string()
      .min(1, "กรุณากรอกรายละเอียดประเภทกิจการ")
      .max(60, "รายละเอียดประเภทกิจการห้ามยาวเกินกว่า 60 ตัวอักษร")
      .optional(),
    TSIC_CHG: z.union([
      z
        .number({ invalid_type_error: "กรุณากรอกรหัส TSIC นอกข่ายการสำรวจฯ" })
        .refine(
          (data) => between(data, 10111, 99009),
          "รหัส TSIC นอกข่ายการสำรวจฯไม่ถูกต้อง"
        )
        .optional(),
      z.literal(null),
    ]),
    LG: z
      .number({ invalid_type_error: "กรุณาเลือกรูปแบบการจัดตั้งตามกฎหมาย" })
      .gte(1, "รูปแบบการจัดตั้งตามกฎหมายไม่ถูกต้อง")
      .lte(10, "รูปแบบการจัดตั้งตามกฎหมายไม่ถูกต้อง")
      .optional(),
    LG1: z
      .string()
      .min(1, "กรุณากรอกข้อมูลในช่องนี้")
      .length(13, "ข้อมูลในช่องนี้ต้องมี 13 หลัก")
      .refine((data) => Number(data), "ข้อมูลในช่องนี้ต้องเป็นตัวเลข")
      .optional(),
    LG1_temp: z.string().length(1).optional(),
    LG2: z
      .string()
      .min(1, "กรุณากรอกข้อมูลในช่องนี้")
      .length(13, "ข้อมูลในช่องนี้ต้องมี 13 หลัก")
      .refine((data) => Number(data), "ข้อมูลในช่องนี้ต้องเป็นตัวเลข")
      .optional(),
    LG3: z
      .string()
      .min(1, "กรุณากรอกข้อมูลในช่องนี้")
      .length(13, "ข้อมูลในช่องนี้ต้องมี 13 หลัก")
      .refine((data) => Number(data), "ข้อมูลในช่องนี้ต้องเป็นตัวเลข")
      .optional(),
    LG4: z
      .string()
      .min(1, "กรุณากรอกข้อมูลในช่องนี้")
      .max(60, "ข้อมูลในช่องนี้ห้ามเกิน 60 ตัวอักษร")
      .optional(),
    TYPE: z
      .number({ invalid_type_error: "กรุณาเลือกประเภทกิจการ" })
      .gte(1, "กรุณาเลือกประเภทกิจการ")
      .lte(7, "ประเภทกิจการไม่ถูกต้อง")
      .optional(),
    M1: z.string().default(quarter.rangeVal[0]),
    M2: z.string().default(quarter.rangeVal[1]),
    M3: z.string().default(quarter.rangeVal[2]),
    R1_temp: z
      .string()
      .min(1, "กรุณากรอกยอดขายหรือรายรับในเดือนนี้")
      .max(15, "ยอดขายหรือรายรับห้ามเกินกว่า 12 หลัก")
      .refine(
        (data) => Number(currencyToNumber(data)),
        "ยอดขายหรือรายรับต้องเป็นตัวเลข"
      )
      .optional(),
    R2_temp: z
      .string()
      .min(1, "กรุณากรอกยอดขายหรือรายรับในเดือนนี้")
      .max(15, "ยอดขายหรือรายรับห้ามเกินกว่า 12 หลัก")
      .refine(
        (data) => Number(currencyToNumber(data)),
        "ยอดขายหรือรายรับต้องเป็นตัวเลข"
      )
      .optional(),
    R3_temp: z
      .string()
      .min(1, "กรุณากรอกยอดขายหรือรายรับในเดือนนี้")
      .max(15, "ยอดขายหรือรายรับห้ามเกินกว่า 12 หลัก")
      .refine(
        (data) => Number(currencyToNumber(data)),
        "ยอดขายหรือรายรับต้องเป็นตัวเลข"
      )
      .optional(),
    TR_temp: z
      .string()
      .min(1, "กรุณากรอกยอดขายหรือรายรับที่รวมทั้ง 3 เดือน")
      .max(15, "ยอดขายหรือรายรับห้ามเกินกว่า 12 หลัก")
      .refine(
        (data) => Number(currencyToNumber(data)),
        "ยอดขายหรือรายรับต้องเป็นตัวเลข"
      )
      .optional(),
    R1: z.number().max(999999999999).nonnegative().optional(),
    R2: z.number().max(999999999999).nonnegative().optional(),
    R3: z.number().max(999999999999).nonnegative().optional(),
    TR: z.number().max(999999999999).nonnegative().nullable().optional(),
    SI: z
      .number({ invalid_type_error: "กรุณาเลือกตัวเลือกในข้อ 6" })
      .gte(1, "ตัวเลือกที่เลือกไม่ถูกต้อง")
      .lte(2, "ตัวเลือกที่เลือกไม่ถูกต้อง")
      .optional(),
    ITR: z
      .number({ invalid_type_error: "กรุณากรอกร้อยละ" })
      .int("ร้อยละที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("ร้อยละที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "ร้อยละที่กรอกต้องห้ามเกิน 100")
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
      .min(1, "กรุณากรอกข้อมูลในช่องนี้")
      .max(60, "ข้อมูลในช่องนี้ห้ามเกินกว่า 60 ตัวอักษร")
      .optional(),
    SI11: z
      .number({ invalid_type_error: "กรุณากรอกสัดส่วน" })
      .int("สัดส่วนที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("สัดส่วนที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "สัดส่วนที่กรอกต้องห้ามเกิน 100")
      .optional(),
    SI22: z
      .number({ invalid_type_error: "กรุณากรอกสัดส่วน" })
      .int("สัดส่วนที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("สัดส่วนที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "สัดส่วนที่กรอกต้องห้ามเกิน 100")
      .optional(),
    SI33: z
      .number({ invalid_type_error: "กรุณากรอกสัดส่วน" })
      .int("สัดส่วนที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("สัดส่วนที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "สัดส่วนที่กรอกต้องห้ามเกิน 100")
      .optional(),
    SI44: z
      .number({ invalid_type_error: "กรุณากรอกสัดส่วน" })
      .int("สัดส่วนที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("สัดส่วนที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "สัดส่วนที่กรอกต้องห้ามเกิน 100")
      .optional(),
    SI55: z
      .number({ invalid_type_error: "กรุณากรอกสัดส่วน" })
      .int("สัดส่วนที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("สัดส่วนที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "สัดส่วนที่กรอกต้องห้ามเกิน 100")
      .optional(),
    SI66: z
      .number({ invalid_type_error: "กรุณากรอกสัดส่วน" })
      .int("สัดส่วนที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("สัดส่วนที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "สัดส่วนที่กรอกต้องห้ามเกิน 100")
      .optional(),
    SI77: z
      .number({ invalid_type_error: "กรุณากรอกสัดส่วน" })
      .int("สัดส่วนที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("สัดส่วนที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "สัดส่วนที่กรอกต้องห้ามเกิน 100")
      .optional(),
    F1: z
      .number({ invalid_type_error: "กรุณากรอกค่าธรรมเนียม" })
      .int("ค่าธรรมเนียมที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("ค่าธรรมเนียมที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "ค่าธรรมเนียมที่กรอกต้องห้ามเกิน 100")
      .optional(),
    F2: z
      .number({ invalid_type_error: "กรุณากรอกค่าธรรมเนียม" })
      .int("ค่าธรรมเนียมที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("ค่าธรรมเนียมที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "ค่าธรรมเนียมที่กรอกต้องห้ามเกิน 100")
      .optional(),
    F3: z
      .number({ invalid_type_error: "กรุณากรอกค่าธรรมเนียม" })
      .int("ค่าธรรมเนียมที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("ค่าธรรมเนียมที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "ค่าธรรมเนียมที่กรอกต้องห้ามเกิน 100")
      .optional(),
    F4: z
      .number({ invalid_type_error: "กรุณากรอกค่าธรรมเนียม" })
      .int("ค่าธรรมเนียมที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("ค่าธรรมเนียมที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "ค่าธรรมเนียมที่กรอกต้องห้ามเกิน 100")
      .optional(),
    F5: z
      .number({ invalid_type_error: "กรุณากรอกค่าธรรมเนียม" })
      .int("ค่าธรรมเนียมที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("ค่าธรรมเนียมที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "ค่าธรรมเนียมที่กรอกต้องห้ามเกิน 100")
      .optional(),
    CHG: z
      .number({ invalid_type_error: "กรุณาเลือกตัวเลือกในข้อ 7" })
      .gte(1, "ตัวเลือกที่เลือกไม่ถูกต้อง")
      .lte(3, "ตัวเลือกที่เลือกไม่ถูกต้อง")
      .optional(),
    CIN: z
      .number({ invalid_type_error: "กรุณากรอกร้อยละ" })
      .int("ร้อยละที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("ร้อยละที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "ร้อยละที่กรอกต้องห้ามเกิน 100")
      .optional(),
    CDE: z.coerce
      .number({ invalid_type_error: "กรุณากรอกร้อยละ" })
      .int("ร้อยละที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("ร้อยละที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "ร้อยละที่กรอกต้องห้ามเกิน 100")
      .optional(),
    FAC: z
      .number({ invalid_type_error: "กรุณาเลือกตัวเลือกในข้อ 8" })
      .gte(1, "ตัวเลือกที่เลือกไม่ถูกต้อง")
      .lte(10, "ตัวเลือกที่เลือกไม่ถูกต้อง")
      .optional(),
    FAC_1: z
      .string()
      .min(1, "กรุณากรอกข้อมูลในช่องนี้")
      .max(100, "ข้อมูลในช่องนี้ห้ามเกินกว่า 100 ตัวอักษร")
      .optional(),
    PRVS: z
      .number({ invalid_type_error: "กรุณาเลือกตัวเลือกในข้อ 9" })
      .gte(1, "ตัวเลือกที่เลือกไม่ถูกต้อง")
      .lte(3, "ตัวเลือกที่เลือกไม่ถูกต้อง")
      .optional(),
    PIN: z
      .number({ invalid_type_error: "กรุณากรอกร้อยละ" })
      .int("ร้อยละที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("ร้อยละที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "ร้อยละที่กรอกต้องห้ามเกิน 100")
      .optional(),
    PDE: z
      .number({ invalid_type_error: "กรุณากรอกร้อยละ" })
      .int("ร้อยละที่กรอกต้องเป็นจำนวนเต็ม")
      .positive("ร้อยละที่กรอกต้องเป็นจำนวนบวก")
      .lte(100, "ร้อยละที่กรอกต้องห้ามเกิน 100")
      .optional(),
    EMP: z
      .number({ invalid_type_error: "กรุณากรอกจำนวนคนทำงาน" })
      .int("จำนวนคนทำงานต้องเป็นจำนวนเต็ม")
      .positive("จำนวนคนทำงานต้องเป็นจำนวนบวก")
      .lte(9999, "จำนวนคนทำงานต้องน้อยกว่า 10,000 คน")
      .optional(),
    STO_temp: z
      .union([
        z
          .string()
          .max(15, "มูลค่าสินค่าคงเหลือห้ามเกินกว่า 12 หลัก")
          .refine(
            (data) => Number(currencyToNumber(data)),
            "มูลค่าสินค่าคงเหลือต้องเป็นตัวเลข"
          ),
        z.literal(""),
      ])
      .optional(),
    STO: z.number().max(999999999999).nonnegative().optional(),
    DAY: z.union([
      z.coerce
        .number({ invalid_type_error: "จำนวนวันต้องเป็นตัวเลข" })
        .int("จำนวนวันต้องเป็นจำนวนเต็ม")
        .nonnegative("จำนวนวันห้ามเป็นลบ")
        .lte(365, "จำนวนวันห้ามเกิน 365 วัน")
        .nullable(),
      z.literal(null),
    ]),
    OP1: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP2: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP3: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP4: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP5: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP6: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP7: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP8: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP9: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP10: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP11: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    OP12: z
      .number({ invalid_type_error: "กรุณาเลือกความคิดเห็นในข้อนี้" })
      .gte(1, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .lte(5, "ความคิดเห็นที่เลือกไม่ถูกต้อง")
      .optional(),
    P1: z.union([z.string().length(7, "รหัสที่กรอกไม่ถูกต้อง"), z.literal("")]),
    P2: z.union([z.string().length(7, "รหัสที่กรอกไม่ถูกต้อง"), z.literal("")]),
    P3: z.union([z.string().length(7, "รหัสที่กรอกไม่ถูกต้อง"), z.literal("")]),
    P4: z.union([z.string().length(7, "รหัสที่กรอกไม่ถูกต้อง"), z.literal("")]),
  })
  .superRefine(
    (
      {
        LG1,
        LG1_temp,
        TR,
        TR_temp,
        SI,
        SI1,
        SI2,
        SI3,
        SI4,
        SI5,
        SI6,
        SI7,
        SI11,
        SI22,
        SI33,
        SI44,
        SI55,
        SI66,
        SI77,
        CHG,
        FAC,
      },
      ctx
    ) => {
      if (LG1 && LG1_temp === "1") {
        if (!assertThaiId(LG1)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "เลขบัตรประชาชนที่กรอกไม่ถูกต้อง",
            path: ["LG1"],
          });
        }
      }

      if (CHG !== 1 && !FAC) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "กรุณาเลือกตัวเลือกในข้อ 8",
          path: ["FAC"],
        });
      }

      if (currencyToNumber(TR_temp as string) !== TR) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "จำนวนรวมทั้ง 3 เดือนที่กรอกไม่ถูกต้อง",
          path: ["TR_temp"],
        });
      }

      if (SI === 2) {
        if (!(SI1 || SI2 || SI3 || SI4 || SI5 || SI6 || SI7)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "กรุณาเลือกตัวเลือกในข้อ 6.2 อย่างน้อย 1 ข้อ",
            path: ["SI7"],
          });
        } else {
          if (
            isNumNull(SI11) +
              isNumNull(SI22) +
              isNumNull(SI33) +
              isNumNull(SI44) +
              isNumNull(SI55) +
              isNumNull(SI66) +
              isNumNull(SI77) !==
            100
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "สัดส่วนที่กรอกในข้อ 6.2 ต้องรวมกันได้ 100%",
              path: ["SI7"],
            });
          }
        }
      }

      return ctx;
    }
  );

export type ReportForm = z.infer<typeof createReportSchema>;
