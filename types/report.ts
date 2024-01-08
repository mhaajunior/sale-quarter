import { Identification } from "./identification";

export interface CompanyData {
  ID: string;
  TITLE: string;
  RANK: string;
  FIRSTNAME: string;
  LASTNAME: string;
  EST_TITLE: string;
  EST_NAME: string;
  ADD_NO: string;
  BUILDING: string;
  ROOM: string;
  STREET: string;
  BLK: string;
  SOI: string;
  SUB_DIST: string;
  DISTRICT: string;
  PROVINCE: string;
  POST_CODE: string;
  TEL_NO: string;
  E_MAIL: string;
  WEBSITE: string;
  SOCIAL: string;
  TSIC_CHG: number | null;
}

export interface CompanyReport extends Identification, CompanyData {
  LG: string | null;
  LG1: string | null;
  LG1_temp: string;
  LG2: string | null;
  LG3: string | null;
  LG4: string | null;
  DES_TYPE: string | null;
  TYPE: number | null;
  M1: string | null;
  M2: string | null;
  M3: string | null;
  R1: number | null;
  R2: number | null;
  R3: number | null;
  TR: number | null;
  SI: number | null;
  ITR: string | null;
  SI1: number | null;
  SI2: number | null;
  SI3: number | null;
  SI4: number | null;
  SI5: number | null;
  SI6: number | null;
  SI7: number | null;
  SI8: string | null;
  SI11: string | null;
  SI22: string | null;
  SI33: string | null;
  SI44: string | null;
  SI55: string | null;
  SI66: string | null;
  SI77: string | null;
  F1: string | null;
  F2: string | null;
  F3: string | null;
  F4: string | null;
  F5: string | null;
  CHG: number | null;
  CIN: string | null;
  CDE: string | null;
  FAC: string | null;
  FAC_1: string | null;
  PRVS: number | null;
  PIN: string | null;
  PDE: string | null;
  STO: string | null;
  DAY: number | null;
  OP1: number | null;
  OP2: number | null;
  OP3: number | null;
  OP4: number | null;
  OP5: number | null;
  OP6: number | null;
  OP7: number | null;
  OP8: number | null;
  OP9: number | null;
  OP10: number | null;
  OP11: number | null;
  OP12: number | null;
  P1: string | null;
  P2: string | null;
  P3: string | null;
  P4: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportStatus {
  id: number;
  ID: string;
  canCreateQtr1: boolean;
  canCreateQtr2: boolean;
  canCreateQtr3: boolean;
  canCreateQtr4: boolean;
  isSendQtr1: boolean;
  isSendQtr2: boolean;
  isSendQtr3: boolean;
  isSendQtr4: boolean;
  year: number;
  report: { updatedAt: string }[];
}
