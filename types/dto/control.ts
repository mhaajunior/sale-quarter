import { Identification } from "./identification";
import { CompanyData } from "./report";

export interface InitialControl {
  no: string;
  es_id: string;
  tsic_code: number;
  size12: string;
  initial: string | null;
  firstname: string | null;
  lastname: string | null;
  comp_name: string | null;
  district: number;
  ea: string;
  vil: string;
  house_no: string;
  street: string | null;
  soi: string | null;
  building: string | null;
  tam: string;
  tam_name: string;
  amp: string;
  amp_name: string;
  tel_no: string | null;
  e_mail: string | null;
  econ_fm: number;
  regis_cid: string | null;
  regis_no: string | null;
  cwt: number;
  cwt_name: string;
  reg: number;
}

export interface ReportControl extends Identification, CompanyData {
  LG?: number;
  LG1?: string;
  LG1_temp: string;
  LG2?: string;
  LG3?: string;
  LG4?: string;
}

export interface ControlTable {
  key: string;
  id: string;
  name: string;
  count: number;
}
