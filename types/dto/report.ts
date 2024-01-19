import { ReportControl } from "./control";

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
  ANSWER: number;
  TSIC_CHG?: number;
}

export interface CompanyReport extends ReportControl {
  DES_TYPE?: string;
  TYPE?: number;
  M1?: string;
  M2?: string;
  M3?: string;
  R1?: number;
  R2?: number;
  R3?: number;
  TR?: number;
  SI?: number;
  ITR?: string;
  SI1?: number;
  SI2?: number;
  SI3?: number;
  SI4?: number;
  SI5?: number;
  SI6?: number;
  SI7?: number;
  SI8?: string;
  SI11?: string;
  SI22?: string;
  SI33?: string;
  SI44?: string;
  SI55?: string;
  SI66?: string;
  SI77?: string;
  F1?: string;
  F2?: string;
  F3?: string;
  F4?: string;
  F5?: string;
  CHG?: number;
  CIN?: string;
  CDE?: string;
  FAC?: string;
  FAC_1?: string;
  PRVS?: number;
  PIN?: string;
  PDE?: string;
  EMP?: number;
  STO: string | null;
  DAY: number | null;
  OP1?: number;
  OP2?: number;
  OP3?: number;
  OP4?: number;
  OP5?: number;
  OP6?: number;
  OP7?: number;
  OP8?: number;
  OP9?: number;
  OP10?: number;
  OP11?: number;
  OP12?: number;
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
  province: number;
  report: {
    updatedAt: string;
    P1: string;
    P2: string;
    P3: string;
    P4: string;
  }[];
}

export interface ProvinceGroup {
  id: number;
  name: string;
  totalCompany: number;
  notApprove: number;
}
