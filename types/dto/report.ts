import { ReportControl } from "./control";

export interface CompanyData {
  ID: string;
  TITLE?: string;
  RANK?: string;
  FIRSTNAME?: string;
  LASTNAME?: string;
  EST_TITLE?: string;
  EST_NAME?: string;
  ADD_NO?: string;
  BUILDING?: string;
  ROOM?: string;
  STREET?: string;
  BLK?: string;
  SOI?: string;
  SUB_DIST?: string;
  DISTRICT?: string;
  PROVINCE?: string;
  POST_CODE?: string;
  TEL_NO?: string;
  E_MAIL?: string;
  WEBSITE?: string;
  SOCIAL?: string;
  ANSWER: number;
  TSIC_CHG?: number;
}

export interface CompanyReport extends ReportControl {
  DES_TYPE?: string;
  TYPE?: number;
  M1?: number;
  M2?: number;
  M3?: number;
  R1?: number;
  R2?: number;
  R3?: number;
  TR?: number;
  SI?: number;
  ITR?: number;
  SI1?: number;
  SI2?: number;
  SI3?: number;
  SI4?: number;
  SI5?: number;
  SI6?: number;
  SI7?: number;
  SI8?: string;
  SI11?: number;
  SI22?: number;
  SI33?: number;
  SI44?: number;
  SI55?: number;
  SI66?: number;
  SI77?: number;
  F1?: number;
  F2?: number;
  F3?: number;
  F4?: number;
  F5?: number;
  CHG?: number;
  CIN?: number;
  CDE?: number;
  FAC?: number;
  FAC_1?: string;
  PRVS?: number;
  PIN?: number;
  PDE?: number;
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
}

export interface ReportStatus {
  no: number;
  ID: string;
  canCreateQtr1: boolean;
  canCreateQtr2: boolean;
  canCreateQtr3: boolean;
  canCreateQtr4: boolean;
  isSendQtr1: boolean;
  isSendQtr2: boolean;
  isSendQtr3: boolean;
  isSendQtr4: boolean;
  isApproveQtr1: boolean;
  isApproveQtr2: boolean;
  isApproveQtr3: boolean;
  isApproveQtr4: boolean;
  year: number;
  province: number;
  province_name: string;
  report: {
    createdAt: string;
    updatedAt: string;
    lastEditor: string;
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

export interface TableProps {
  year: number;
  quarter: number;
  province: number | undefined;
  item: CompanyReport[];
}
