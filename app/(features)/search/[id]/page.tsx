"use client";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import Title from "@/components/Title";
import {
  between,
  currencyToNumber,
  numberWithCommas,
  removeNonNumeric,
} from "@/lib/common";
import { quarterMap } from "@/lib/quarter";
import { checkErrorFromRole, cleansingFormData } from "@/lib/validate";
import {
  ReportForm,
  createReportSchema,
} from "@/types/schemas/validationSchema";
import {
  typeOption,
  answerOption,
  titleOption,
  estTitleOption,
} from "@/utils/dropdownOption";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Col, FloatButton, Modal, Radio, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import _ from "lodash";
import { FormErrors } from "@/types/dto/common";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { errorHandler } from "@/lib/errorHandler";
import { InitialControl, ReportControl } from "@/types/dto/control";
import Loading from "@/components/Loading";
import { IoChevronBack } from "react-icons/io5";
import Swal from "sweetalert2";
import { CompanyReport } from "@/types/dto/report";
import useClientSession from "@/hooks/use-client-session";
import { Role } from "@/types/dto/role";
import Portal from "@/components/Portal";

const FormPage = () => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormdata] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<FormErrors[]>([]);
  const [si1, setSi1] = useState<boolean | undefined>();
  const [si2, setSi2] = useState<boolean | undefined>();
  const [si3, setSi3] = useState<boolean | undefined>();
  const [si4, setSi4] = useState<boolean | undefined>();
  const [si5, setSi5] = useState<boolean | undefined>();
  const [si6, setSi6] = useState<boolean | undefined>();
  const [si7, setSi7] = useState<boolean | undefined>();
  const [denied, setDenied] = useState<{ isDenied: boolean; code?: number }>({
    isDenied: false,
  });
  const [notFound, setNotFound] = useState(false);
  const params = useParams();
  const router = useRouter();
  const session = useClientSession();
  const searchParams = useSearchParams();
  const yr = Number(searchParams.get("yr"));
  const qtr = Number(searchParams.get("qtr"));
  const mode = searchParams.get("mode");
  const provinceId = Number(searchParams.get("pvid")) || session?.user.province;
  const quarterData = quarterMap(Number("25" + yr.toString()) - 543)[qtr - 1];

  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReportForm>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      ID: params.id.toString(),
      R1_temp: "",
      R2_temp: "",
      R3_temp: "",
      TR_temp: "",
      LG1_temp: "1",
      QTR: qtr,
      YR: yr,
      ENU: "01",
      M1: quarterData?.rangeVal[0],
      M2: quarterData?.rangeVal[1],
      M3: quarterData?.rangeVal[2],
    },
  });

  const r1 = watch("R1_temp");
  const r2 = watch("R2_temp");
  const r3 = watch("R3_temp");
  const tr_temp = watch("TR_temp");
  const tr = watch("TR");
  const si = watch("SI");
  const chg = watch("CHG");
  const sto = watch("STO_temp");
  const enu = watch("ENU");
  const lg1_temp = watch("LG1_temp");

  useEffect(() => {
    if (
      !qtr ||
      !between(qtr, 1, 4) ||
      !mode ||
      !["create", "edit"].includes(mode) ||
      !yr
    ) {
      setNotFound(true);
      return;
    }

    if (session && session.user.role === Role.SUPERVISOR) {
      if (mode === "create") {
        setDenied({ isDenied: true, code: 3 });
        return;
      }
    }

    if (mode === "create") {
      if (qtr === 1) {
        getIdenFromControl();
      } else {
        getIdenFromPrevQtr();
      }
    } else if (mode === "edit") {
      getQuarterReport();
    }
  }, []);

  useEffect(() => {
    setValue("SI1", si1);
  }, [si1]);

  useEffect(() => {
    setValue("SI2", si2);
  }, [si2]);

  useEffect(() => {
    setValue("SI3", si3);
  }, [si3]);

  useEffect(() => {
    setValue("SI4", si4);
  }, [si4]);

  useEffect(() => {
    setValue("SI5", si5);
  }, [si5]);

  useEffect(() => {
    setValue("SI6", si6);
  }, [si6]);

  useEffect(() => {
    setValue("SI7", si7);
  }, [si7]);

  useEffect(() => {
    if (chg === 1) {
      setValue("FAC", undefined);
      setValue("FAC_1", undefined);
    }
  }, [chg]);

  useEffect(() => {
    const R1 = currencyToNumber(r1 as string);
    const R2 = currencyToNumber(r2 as string);
    const R3 = currencyToNumber(r3 as string);
    const TR = currencyToNumber(tr_temp as string);
    if (R1 || R2 || R3 || TR) {
      if (R1)
        setValue("R1_temp", numberWithCommas(removeNonNumeric(r1 as string)));
      if (R2)
        setValue("R2_temp", numberWithCommas(removeNonNumeric(r2 as string)));
      if (R3)
        setValue("R3_temp", numberWithCommas(removeNonNumeric(r3 as string)));
      if (TR)
        setValue(
          "TR_temp",
          numberWithCommas(removeNonNumeric(tr_temp as string))
        );
      setValue("TR", R1 + R2 + R3);
    } else {
      setValue("TR", 0);
    }
  }, [r1, r2, r3, tr_temp]);

  useEffect(() => {
    if (sto)
      setValue("STO_temp", numberWithCommas(removeNonNumeric(sto as string)));
  }, [sto]);

  const getAccessStatus = async () => {
    try {
      const res = await axios.get(`/api/report_status/${params.id}`, {
        params: {
          quarter: qtr,
          year: yr,
        },
      });

      if (res.status === 200) {
        return res.data;
      }
    } catch (err: any) {
      errorHandler(err);
    }
  };

  const getIdenFromControl = async () => {
    try {
      setLoading(true);
      if (await getAccessStatus()) {
        const res = await axios.get(`/api/control/${params.id}`);
        if (res.status === 200) {
          if (res.data) {
            const {
              amp,
              amp_name,
              building,
              comp_name,
              cwt,
              cwt_name,
              district,
              e_mail,
              ea,
              econ_fm,
              firstname,
              house_no,
              initial,
              lastname,
              no,
              reg,
              regis_cid,
              regis_no,
              size12,
              soi,
              street,
              tam,
              tam_name,
              tel_no,
              tsic_code,
              vil,
            } = res.data as InitialControl;
            setValue("AMP", amp);
            setValue("DISTRICT", amp_name);
            setValue("BUILDING", building || "-");
            setValue("EST_NAME", comp_name || "-");
            setValue("CWT", cwt);
            setValue("PROVINCE", cwt_name);
            setValue("MUN", district);
            setValue("E_MAIL", e_mail || "-");
            setValue("EA", ea);
            setValue("LG", econ_fm);
            setValue("FIRSTNAME", firstname || "-");
            setValue("ADD_NO", house_no);
            setValue("TITLE", initial || "-");
            setValue("LASTNAME", lastname || "-");
            setValue("NO", no);
            setValue("REG", reg);
            setValue("SIZE_L", size12);
            setValue("SOI", soi || "-");
            setValue("STREET", street || "-");
            setValue("TAM", tam);
            setValue("SUB_DIST", tam_name);
            setValue("TEL_NO", tel_no || "-");
            setValue("TSIC_L", tsic_code);
            setValue("VIL", vil);
            if (regis_cid) {
              if (econ_fm === 1) {
                setValue("LG1_temp", "1");
                setValue("LG1", regis_cid);
              }
            } else if (regis_no) {
              switch (econ_fm) {
                case 1:
                  setValue("LG1_temp", "2");
                  setValue("LG1", regis_no);
                  break;
                case 2:
                  setValue("LG2", regis_no);
                  break;
                case 3:
                  setValue("LG3", regis_no);
                  break;
                default:
                  break;
              }
            }
          } else {
            setNotFound(true);
          }
        }
      } else {
        setDenied({ isDenied: true, code: 1 });
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        setNotFound(true);
      } else if (err.response.status === 400) {
        setDenied({ isDenied: true, code: 2 });
      } else {
        errorHandler(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const getIdenFromPrevQtr = async () => {
    try {
      setLoading(true);
      if (await getAccessStatus()) {
        const res = await axios.get(`/api/control/${params.id}`, {
          params: { quarter: qtr, year: yr },
        });

        if (res.status === 200) {
          if (res.data) {
            const {
              REG,
              CWT,
              AMP,
              TAM,
              MUN,
              EA,
              VIL,
              TSIC_R,
              TSIC_L,
              SIZE_R,
              SIZE_L,
              NO,
              ENU,
              TITLE,
              RANK,
              FIRSTNAME,
              LASTNAME,
              EST_TITLE,
              EST_NAME,
              ADD_NO,
              BUILDING,
              ROOM,
              STREET,
              BLK,
              SOI,
              SUB_DIST,
              DISTRICT,
              PROVINCE,
              POST_CODE,
              TEL_NO,
              E_MAIL,
              WEBSITE,
              SOCIAL,
              TSIC_CHG,
              LG,
              LG1,
              LG1_temp,
              LG2,
              LG3,
              LG4,
            } = res.data as ReportControl;
            setValue("REG", REG);
            setValue("CWT", CWT);
            setValue("AMP", AMP);
            setValue("TAM", TAM);
            setValue("MUN", MUN);
            setValue("EA", EA);
            setValue("VIL", VIL);
            setValue("TSIC_R", TSIC_R);
            setValue("TSIC_L", TSIC_L);
            setValue("SIZE_R", SIZE_R);
            setValue("SIZE_L", SIZE_L);
            setValue("NO", NO);
            setValue("ENU", ENU);
            setValue("TITLE", TITLE);
            setValue("RANK", RANK);
            setValue("FIRSTNAME", FIRSTNAME);
            setValue("LASTNAME", LASTNAME);
            setValue("EST_TITLE", EST_TITLE);
            setValue("EST_NAME", EST_NAME);
            setValue("ADD_NO", ADD_NO);
            setValue("BUILDING", BUILDING);
            setValue("ROOM", ROOM);
            setValue("STREET", STREET);
            setValue("BLK", BLK);
            setValue("SOI", SOI);
            setValue("SUB_DIST", SUB_DIST);
            setValue("DISTRICT", DISTRICT);
            setValue("PROVINCE", PROVINCE);
            setValue("POST_CODE", POST_CODE);
            setValue("TEL_NO", TEL_NO);
            setValue("E_MAIL", E_MAIL);
            setValue("WEBSITE", WEBSITE);
            setValue("SOCIAL", SOCIAL);
            setValue("TSIC_CHG", TSIC_CHG);
            if (LG) {
              setValue("LG", LG);
              switch (LG) {
                case 1:
                  setValue("LG1_temp", LG1_temp);
                  setValue("LG1", LG1);
                  break;
                case 2:
                  setValue("LG2", LG2);
                  break;
                case 3:
                  setValue("LG3", LG3);
                  break;
                case 10:
                  setValue("LG4", LG4);
                  break;
                default:
                  break;
              }
            }
          } else {
            setNotFound(true);
          }
        }
      } else {
        setDenied({ isDenied: true, code: 1 });
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        setNotFound(true);
      } else if (err.response.status === 400) {
        setDenied({ isDenied: true, code: 2 });
      } else {
        errorHandler(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const getQuarterReport = async () => {
    try {
      setLoading(true);
      if (await getAccessStatus()) {
        const res = await axios.get(`/api/report/${params.id}`, {
          params: { quarter: qtr, year: yr },
        });

        if (res.status === 200) {
          if (res.data) {
            const {
              REG,
              CWT,
              AMP,
              TAM,
              MUN,
              EA,
              VIL,
              TSIC_R,
              TSIC_L,
              SIZE_R,
              SIZE_L,
              NO,
              ENU,
              TITLE,
              RANK,
              FIRSTNAME,
              LASTNAME,
              EST_TITLE,
              EST_NAME,
              ADD_NO,
              BUILDING,
              ROOM,
              STREET,
              BLK,
              SOI,
              SUB_DIST,
              DISTRICT,
              PROVINCE,
              POST_CODE,
              TEL_NO,
              E_MAIL,
              WEBSITE,
              SOCIAL,
              ANSWER,
              TSIC_CHG,
              LG,
              LG1,
              LG1_temp,
              LG2,
              LG3,
              LG4,
              DES_TYPE,
              TYPE,
              R1,
              R2,
              R3,
              TR,
              SI,
              ITR,
              SI1,
              SI2,
              SI3,
              SI4,
              SI5,
              SI6,
              SI7,
              SI8,
              SI11,
              SI22,
              SI33,
              SI44,
              SI55,
              SI66,
              SI77,
              F1,
              F2,
              F3,
              F4,
              F5,
              CHG,
              CIN,
              CDE,
              FAC,
              FAC_1,
              PRVS,
              PIN,
              PDE,
              EMP,
              STO,
              DAY,
              OP1,
              OP2,
              OP3,
              OP4,
              OP5,
              OP6,
              OP7,
              OP8,
              OP9,
              OP10,
              OP11,
              OP12,
              P1,
              P2,
              P3,
              P4,
            } = res.data as CompanyReport;
            setValue("REG", REG);
            setValue("CWT", CWT);
            setValue("AMP", AMP);
            setValue("TAM", TAM);
            setValue("MUN", MUN);
            setValue("EA", EA);
            setValue("VIL", VIL);
            setValue("TSIC_R", TSIC_R);
            setValue("TSIC_L", TSIC_L);
            setValue("SIZE_R", SIZE_R);
            setValue("SIZE_L", SIZE_L);
            setValue("NO", NO);
            setValue("ENU", ENU);
            setValue("TITLE", TITLE);
            setValue("RANK", RANK);
            setValue("FIRSTNAME", FIRSTNAME);
            setValue("LASTNAME", LASTNAME);
            setValue("EST_TITLE", EST_TITLE);
            setValue("EST_NAME", EST_NAME);
            setValue("ADD_NO", ADD_NO);
            setValue("BUILDING", BUILDING);
            setValue("ROOM", ROOM);
            setValue("STREET", STREET);
            setValue("BLK", BLK);
            setValue("SOI", SOI);
            setValue("SUB_DIST", SUB_DIST);
            setValue("DISTRICT", DISTRICT);
            setValue("PROVINCE", PROVINCE);
            setValue("POST_CODE", POST_CODE);
            setValue("TEL_NO", TEL_NO);
            setValue("E_MAIL", E_MAIL);
            setValue("WEBSITE", WEBSITE);
            setValue("SOCIAL", SOCIAL);
            setValue("ANSWER", ANSWER);
            setValue("TSIC_CHG", TSIC_CHG);
            setValue("TYPE", TYPE);
            setValue("DES_TYPE", DES_TYPE);
            setValue("R1_temp", R1?.toString());
            setValue("R2_temp", R2?.toString());
            setValue("R3_temp", R3?.toString());
            setValue("TR_temp", TR?.toString());
            setValue("SI", SI);
            setValue("ITR", ITR);
            setValue("SI1", SI1 === 1 ? true : false);
            setValue("SI2", SI2 === 1 ? true : false);
            setValue("SI3", SI3 === 1 ? true : false);
            setValue("SI4", SI4 === 1 ? true : false);
            setValue("SI5", SI5 === 1 ? true : false);
            setValue("SI6", SI6 === 1 ? true : false);
            setValue("SI7", SI7 === 1 ? true : false);
            setValue("SI8", SI8);
            setValue("SI11", SI11);
            setValue("SI22", SI22);
            setValue("SI33", SI33);
            setValue("SI44", SI44);
            setValue("SI55", SI55);
            setValue("SI66", SI66);
            setValue("SI77", SI77);
            setValue("F1", F1);
            setValue("F2", F2);
            setValue("F3", F3);
            setValue("F4", F4);
            setValue("F5", F5);
            setValue("CHG", CHG);
            setValue("CIN", CIN);
            setValue("CDE", CDE);
            setValue("FAC", FAC);
            setValue("FAC_1", FAC_1);
            setValue("PRVS", PRVS);
            setValue("PIN", PIN);
            setValue("PDE", PDE);
            setValue("EMP", EMP);
            setValue("STO_temp", STO || "");
            setValue("DAY", DAY);
            setValue("OP1", OP1);
            setValue("OP2", OP2);
            setValue("OP3", OP3);
            setValue("OP4", OP4);
            setValue("OP5", OP5);
            setValue("OP6", OP6);
            setValue("OP7", OP7);
            setValue("OP8", OP8);
            setValue("OP9", OP9);
            setValue("OP10", OP10);
            setValue("OP11", OP11);
            setValue("OP12", OP12);
            setValue("P1", P1 || "");
            setValue("P2", P2 || "");
            setValue("P3", P3 || "");
            setValue("P4", P4 || "");
            if (LG) {
              setValue("LG", LG);
              switch (LG) {
                case 1:
                  setValue("LG1_temp", LG1_temp);
                  setValue("LG1", LG1);
                  break;
                case 2:
                  setValue("LG2", LG2);
                  break;
                case 3:
                  setValue("LG3", LG3);
                  break;
                case 10:
                  setValue("LG4", LG4);
                  break;
                default:
                  break;
              }
            }
          } else {
            setNotFound(true);
          }
        }
      } else {
        setDenied({ isDenied: true, code: 1 });
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        setNotFound(true);
      } else if (err.response.status === 400) {
        setDenied({ isDenied: true, code: 2 });
      } else {
        errorHandler(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit((data) => {
    let err: FormErrors[] = [];
    if (Number(data.ENU) === 1) {
      err = checkErrorFromRole(data, session?.user.role, 1);
    } else {
      err = checkErrorFromRole(data, session?.user.role, 2);
    }
    if (err.length > 0) {
      setFormErrors(err);
      toast.error("ตรวจพบข้อมูลที่ไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง");
      window.scrollTo(0, 0);
      return;
    } else {
      setFormdata(data);
      setModalOpen(true);
    }
  });

  const submitFormData = async () => {
    try {
      setModalOpen(false);
      setLoading(true);
      const result = cleansingFormData(formData);
      const res = await axios.post("/api/report", result, {
        headers: { mode, authorization: session?.user.accessToken },
      });
      if (res.status === 200) {
        toast.success("ส่งข้อมูลสำเร็จ");
        navigateToPath();
      }
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  const renderErrors = () => {
    return formErrors.map((err, index) => (
      <div
        key={index}
        className="text-red-500 flex items-center gap-3 md:w-2/4 w-full"
      >
        <div className="border border-red-500 p-2 rounded font-bold text-xs text-white bg-red-500 text-center">
          {err.label.join(", ")}
        </div>
        <p>{err.message}</p>
      </div>
    ));
  };

  const onClickBack = () => {
    Swal.fire({
      title: "คำเตือน",
      text: "ข้อมูลที่ยังไม่ได้ถูกบันทึกจะหายทั้งหมด คุณแน่ใจหรือไม่ที่จะย้อนกลับไป",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ไม่",
      confirmButtonText: "ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        navigateToPath();
      }
    });
  };

  const navigateToPath = () => {
    if (
      session?.user.role === Role.SUPERVISOR ||
      session?.user.role === Role.SUBJECT
    ) {
      router.push(`/approve?pvid=${provinceId}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <Portal session={session} notFound={notFound} denied={denied}>
      {loading && <Loading type="full" />}
      <div className="mb-10 flex flex-col gap-2">
        <Title title={`แบบฟอร์มสำรวจยอดขายรายไตรมาส พ.ศ. 25${yr}`}>
          <Button secondary onClick={onClickBack}>
            <IoChevronBack className="mr-1" />
            กลับ
          </Button>
        </Title>
        <div className="text-xl">
          ไตรมาส {qtr} ({quarterData?.monthRange[0]} -{" "}
          {quarterData?.monthRange[2]} {yr})
        </div>
      </div>
      <div className="card">
        <h1 className="mb-3">เลขประจำสถานประกอบการ: {params.id}</h1>
        <p className="mb-3 text-blue-500">
          *** ถ้าช่องใดให้กรอกข้อมูลเป็นร้อยละ (%) หรือจำนวนเงิน ให้กรอกเป็น
          <b>จำนวนเต็มเ</b>ท่านั้น
        </p>
        <form
          className="flex flex-wrap gap-10 justify-center"
          onSubmit={onSubmit}
        >
          {formErrors.length > 0 && (
            <div className="card w-full border error !bg-red-100 flex flex-wrap gap-y-5">
              {renderErrors()}
            </div>
          )}

          {session && (
            <div className="card w-full">
              <div>IDENTIFICATION</div>
              <div className="flex flex-wrap gap-5 mt-5">
                <div className="flex items-center gap-5">
                  <label className="w-10">REG</label>
                  <Input
                    name="REG"
                    type="number"
                    placeholder="REG"
                    register={register}
                    className="w-20"
                    errors={errors.REG}
                    isNumber
                    disabled
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">CWT</label>
                  <Input
                    name="CWT"
                    type="number"
                    placeholder="CWT"
                    register={register}
                    className="w-20"
                    errors={errors.CWT}
                    isNumber
                    disabled
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">AMP</label>
                  <Input
                    name="AMP"
                    placeholder="AMP"
                    register={register}
                    className="w-20"
                    errors={errors.AMP}
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">TAM</label>
                  <Input
                    name="TAM"
                    placeholder="TAM"
                    register={register}
                    className="w-20"
                    errors={errors.TAM}
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">MUN</label>
                  <Input
                    name="MUN"
                    type="number"
                    placeholder="MUN"
                    register={register}
                    className="w-20"
                    errors={errors.MUN}
                    isNumber
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">EA</label>
                  <Input
                    name="EA"
                    placeholder="EA"
                    register={register}
                    className="w-20"
                    errors={errors.EA}
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">VIL</label>
                  <Input
                    name="VIL"
                    placeholder="VIL"
                    register={register}
                    className="w-20"
                    errors={errors.VIL}
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">TSIC_R</label>
                  <Input
                    name="TSIC_R"
                    type="number"
                    placeholder="TSIC_R"
                    register={register}
                    className="w-20"
                    errors={errors.TSIC_R}
                    isNumber
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">TSIC_L</label>
                  <Input
                    name="TSIC_L"
                    type="number"
                    placeholder="TSIC_L"
                    register={register}
                    className="w-20"
                    errors={errors.TSIC_L}
                    isNumber
                    disabled
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">SIZE_R</label>
                  <Input
                    name="SIZE_R"
                    placeholder="SIZE_R"
                    register={register}
                    className="w-20"
                    errors={errors.SIZE_R}
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">SIZE_L</label>
                  <Input
                    name="SIZE_L"
                    placeholder="SIZE_L"
                    register={register}
                    className="w-20"
                    errors={errors.SIZE_L}
                    disabled
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">NO</label>
                  <Input
                    name="NO"
                    placeholder="NO"
                    register={register}
                    className="w-20"
                    errors={errors.NO}
                    disabled
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">QTR</label>
                  <Input
                    name="QTR"
                    type="number"
                    placeholder="QTR"
                    register={register}
                    className="w-20"
                    errors={errors.QTR}
                    isNumber
                    disabled
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">YR</label>
                  <Input
                    name="YR"
                    type="number"
                    placeholder="YR"
                    register={register}
                    className="w-20"
                    errors={errors.YR}
                    isNumber
                    disabled
                    right
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label className="w-10">ENU</label>
                  <Input
                    name="ENU"
                    placeholder="ENU"
                    register={register}
                    className="w-20"
                    errors={errors.ENU}
                    right
                  />
                </div>
              </div>
            </div>
          )}

          <div className="card w-full flex flex-wrap gap-y-5 justify-between">
            <div className="w-full">1. ข้อมูลสถานประกอบการ</div>
            <p className="w-full text-blue-500">
              *** กรุณากรอกข้อมูลให้ครบทุกช่อง
              หากช่องไหนไม่มีข้อมูลให้ใช้เครื่องหมายขีด ( - )
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">คำนำหน้านาม</label>
              <Dropdown
                name="TITLE"
                placeholder={session ? "TITLE" : "กรุณาเลือก"}
                options={titleOption}
                className="w-60 md:w-72"
                errors={errors.TITLE}
                control={control}
                showName={!!session}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">ยศ</label>
              <Input
                name="RANK"
                placeholder={session ? "RANK" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.RANK}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">
                ชื่อเจ้าของ/หัวหน้าครัวเรือน
              </label>
              <Input
                name="FIRSTNAME"
                placeholder={session ? "FIRSTNAME" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.FIRSTNAME}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">นามสกุล</label>
              <Input
                name="LASTNAME"
                placeholder={session ? "LASTNAME" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.LASTNAME}
                showName
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">
                คำนำหน้าชื่อสถานประกอบการ
              </label>
              <Dropdown
                name="EST_TITLE"
                placeholder={session ? "EST_TITLE" : "กรุณาเลือก"}
                options={estTitleOption}
                className="w-60 md:w-72"
                errors={errors.EST_TITLE}
                control={control}
                showName={!!session}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">ชื่อสถานประกอบการ</label>
              <Input
                name="EST_NAME"
                placeholder={session ? "EST_NAME" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.EST_NAME}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">เลขที่</label>
              <Input
                name="ADD_NO"
                placeholder={session ? "ADD_NO" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.ADD_NO}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">ชื่ออาคาร/หมู่บ้าน</label>
              <Input
                name="BUILDING"
                placeholder={session ? "BUILDING" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.BUILDING}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">ห้องเลขที่/ชั้นที่</label>
              <Input
                name="ROOM"
                placeholder={session ? "ROOM" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.ROOM}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">ถนน</label>
              <Input
                name="STREET"
                placeholder={session ? "STREET" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.STREET}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">ตรอก</label>
              <Input
                name="BLK"
                placeholder={session ? "BLK" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.BLK}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">ซอย</label>
              <Input
                name="SOI"
                placeholder={session ? "SOI" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.SOI}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">ตำบล/แขวง</label>
              <Input
                name="SUB_DIST"
                placeholder={session ? "SUB_DIST" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.SUB_DIST}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">อำเภอ/เขต</label>
              <Input
                name="DISTRICT"
                placeholder={session ? "DISTRICT" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.DISTRICT}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">จังหวัด</label>
              <div className="w-60 md:w-72">{getValues("PROVINCE")}</div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">รหัสไปรษณีย์</label>
              <Input
                name="POST_CODE"
                placeholder={session ? "POST_CODE" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.POST_CODE}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">โทรศัพท์</label>
              <Input
                name="TEL_NO"
                placeholder={session ? "TEL_NO" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.TEL_NO}
                showName={!!session}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">อีเมล</label>
              <Input
                name="E_MAIL"
                placeholder={session ? "E_MAIL" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.E_MAIL}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">Website</label>
              <Input
                name="WEBSITE"
                placeholder={session ? "WEBSITE" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.WEBSITE}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">Social Media</label>
              <Input
                name="SOCIAL"
                placeholder={session ? "SOCIAL" : ""}
                register={register}
                className="w-60 md:w-72"
                errors={errors.SOCIAL}
                showName
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <label className="w-full sm:w-32">วิธีการตอบแบบสอบถาม</label>
              <Dropdown
                name="ANSWER"
                placeholder={session ? "ANSWER" : "กรุณาเลือก"}
                options={answerOption}
                className="w-60 md:w-72"
                errors={errors.ANSWER}
                control={control}
                showName={!!session}
              />
            </div>
            {Number(enu) === 8 && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <label className="w-full sm:w-32">
                  รหัส TSIC นอกข่ายการสำรวจฯ
                </label>
                <Input
                  name="TSIC_CHG"
                  type="number"
                  placeholder="TSIC_CHG"
                  register={register}
                  className="w-60 md:w-72"
                  errors={errors.TSIC_CHG}
                  isNumber
                  showName
                />
              </div>
            )}
          </div>

          {Number(enu) === 1 && (
            <>
              <div className="card w-500 flex flex-col gap-3">
                <div>
                  2. รูปแบบการจัดตั้งตามกฎหมาย
                  {session && (
                    <span className="ml-3 !text-xs text-gray-400">[LG]</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <Controller
                    control={control}
                    name="LG"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("LG").ref}
                      >
                        <Space direction="vertical">
                          <Radio value={1} className="start">
                            1. ส่วนบุคคล ห้างหุ้นส่วนสามัญที่ไม่เป็นนิติบุคคล
                            {value === 1 && (
                              <div className="my-1 flex flex-col gap-2">
                                <Controller
                                  control={control}
                                  name="LG1_temp"
                                  render={({ field: { onChange, value } }) => (
                                    <Radio.Group
                                      value={value}
                                      onChange={onChange}
                                      ref={register("LG1_temp").ref}
                                    >
                                      <Space direction="horizontal">
                                        <Radio value="1">
                                          เลขบัตรประจำตัวประชาชน
                                        </Radio>
                                        <Radio value="2">
                                          เลขทะเบียนพาณิชย์
                                        </Radio>
                                      </Space>
                                    </Radio.Group>
                                  )}
                                />
                                <Input
                                  name="LG1"
                                  placeholder={
                                    session
                                      ? "LG1"
                                      : lg1_temp === "1"
                                      ? "เลขบัตรประจำตัวประชาชน"
                                      : "เลขทะเบียนพาณิชย์"
                                  }
                                  register={register}
                                  className="w-60 md:w-72"
                                  errors={errors.LG1}
                                  showName={!!session}
                                />
                              </div>
                            )}
                          </Radio>
                          <Radio value={2} className="start">
                            2. ห้างหุ้นส่วนสามัญนิติบุคคล ห้างหุ้นส่วนจำกัด
                            {value === 2 && (
                              <div className="my-1 flex flex-col gap-2">
                                <p>เลขทะเบียนนิติบุคคล</p>
                                <Input
                                  name="LG2"
                                  placeholder={
                                    session ? "LG2" : "เลขทะเบียนนิติบุคคล"
                                  }
                                  register={register}
                                  className="w-60 md:w-72"
                                  errors={errors.LG2}
                                  showName={!!session}
                                />
                              </div>
                            )}
                          </Radio>
                          <Radio value={3} className="start">
                            3. บริษัทจำกัด บริษัทจำกัด (มหาชน)
                            {value === 3 && (
                              <div className="my-1 flex flex-col gap-2">
                                <p>เลขทะเบียนนิติบุคคล</p>
                                <Input
                                  name="LG3"
                                  placeholder={
                                    session ? "LG3" : "เลขทะเบียนนิติบุคคล"
                                  }
                                  register={register}
                                  className="w-60 md:w-72"
                                  errors={errors.LG3}
                                  showName={!!session}
                                />
                              </div>
                            )}
                          </Radio>
                          <Radio value={4} className="start">
                            4. ส่วนราชการ รัฐวิสาหกิจ
                          </Radio>
                          <Radio value={5} className="start">
                            5. สหกรณ์
                          </Radio>
                          <Radio value={6}>
                            6. การรวมกลุ่ม (เช่น กลุ่มเกษตรกร กลุ่มแม่บ้าน
                            เป็นต้น)
                          </Radio>
                          <Radio value={7} className="start">
                            7. สมาคม
                          </Radio>
                          <Radio value={8} className="start">
                            8. มูลนิธิ
                          </Radio>
                          <Radio value={9} className="start">
                            9. วิสาหกิจชุมชน
                          </Radio>
                          <Radio value={10} className="start">
                            10. อื่นๆ (เช่น สโมสร ชมรม เป็นต้น) (ระบุ)
                            {value === 10 && (
                              <div className="my-1 flex flex-col gap-2">
                                <Input
                                  name="LG4"
                                  placeholder={session ? "LG4" : "ระบุ"}
                                  register={register}
                                  className="w-60 md:w-72"
                                  errors={errors.LG4}
                                  showName={!!session}
                                />
                              </div>
                            )}
                          </Radio>
                        </Space>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.LG?.message}</ErrorMessage>
                </div>
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <div>3. ประเภทของกิจการและชนิดของสินค้า/บริการ</div>
                <p className="leading-6">
                  เช่น ขายของชำ ร้านสะดวกซื้อ ซุปเปอร์มาร์เก็ต ดิสเคานท์สโตร์
                  ห้างสรรพสินค้า ขายปลีกผักและผลไม้
                  ขายปลีกเครื่องดื่มที่ไม่มีแอลกอฮอล์ ขายปลีกเครื่องใช้ไฟฟ้า
                  โรงแรม รีสอร์ท เกสต์เฮาส์ หอพัก ภัตตาคาร ร้านอาหาร
                  ร้านขายก๋วยเตี๋ยว รับจัดเลี้ยง สถานีวิทยุ/โทรทัศน์ ร้านเกม
                  ร้านเช่าหนังสือ ร้านเช่าวีดิโอ วีซีดี และดีวีดี นักแสดง
                  โต๊ะสนุกเกอร์ ฉายภาพยนตร์ ลิเก หมอลำ สปา ร้านตัดผม เสริมสวย
                  ร้านซักรีดเสื้อผ้า อาบ อบ นวด เป็นต้น{" "}
                  <span className="font-bold">
                    (ถ้าประกอบธุรกิจมากกว่า 1 ประเภท
                    โปรดระบุประเภทกิจการและชนิดของสินค้า/บริการที่มีรายรับสูงสุด)
                  </span>
                </p>
                <div className="flex flex-col gap-5">
                  <Input
                    name="DES_TYPE"
                    placeholder={session ? "DES_TYPE" : "ประเภทของกิจการ"}
                    register={register}
                    className="w-60 md:w-72"
                    errors={errors.DES_TYPE}
                    showName={!!session}
                  />
                  {session && (
                    <>
                      <p>เจ้าหน้าที่เลือกประเภทของกิจการ</p>
                      <Dropdown
                        name="TYPE"
                        placeholder="TYPE"
                        options={typeOption}
                        className="w-60 md:w-72"
                        errors={errors.TYPE}
                        control={control}
                        showName
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <div>4. จำนวนคนทำงานตามปกติของสถานประกอบการในไตรมาสนี้</div>
                <Input
                  name="EMP"
                  type="number"
                  placeholder={session ? "EMP" : "จำนวน"}
                  register={register}
                  className="w-40"
                  errors={errors.EMP}
                  showWord="คน"
                  isNumber
                  showName={!!session}
                  right
                />
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <div>5. ยอดขายหรือรายรับของสถานประกอบการ</div>
                <p>
                  บันทึกยอดขายหรือรายรับจากการขายสินค้า/บริการ แต่ละเดือน
                  <b>เป็นจำนวนเต็ม (บาท)</b>
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <p>เดือน {quarterData?.monthRange[0]}</p>
                    <Input
                      name="R1_temp"
                      placeholder={
                        session
                          ? "R1"
                          : `ยอดขายเดือน ${quarterData?.monthRange[0]}`
                      }
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.R1_temp}
                      showWord="บาท"
                      showName={!!session}
                      right
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p>เดือน {quarterData?.monthRange[1]}</p>
                    <Input
                      name="R2_temp"
                      placeholder={
                        session
                          ? "R2"
                          : `ยอดขายเดือน ${quarterData?.monthRange[1]}`
                      }
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.R2_temp}
                      showWord="บาท"
                      showName={!!session}
                      right
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p>เดือน {quarterData?.monthRange[2]}</p>
                    <Input
                      name="R3_temp"
                      placeholder={
                        session
                          ? "R3"
                          : `ยอดขายเดือน ${quarterData?.monthRange[2]}`
                      }
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.R3_temp}
                      showWord="บาท"
                      showName={!!session}
                      right
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-bold">รวม 3 เดือน</p>
                    <Input
                      name="TR_temp"
                      placeholder={session ? "TR" : "ยอดขายรวมทั้ง 3 เดือน"}
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.TR_temp}
                      showWord="บาท"
                      showName={!!session}
                      right
                    />
                  </div>
                  <h4 className="w-full text-right">
                    ระบบรวมให้ได้ {tr ? numberWithCommas(tr) : 0} บาท
                  </h4>
                </div>
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <div>
                  6. ในไตรมาสนี้ มีการขายสินค้าหรือบริการทางอินเทอร์เน็ตหรือไม่
                  {session && (
                    <span className="ml-3 !text-xs text-gray-400">[SI]</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <Controller
                    control={control}
                    name="SI"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("SI").ref}
                      >
                        <Space direction="horizontal">
                          <Radio value={1}>1. ไม่มี</Radio>
                          <Radio value={2}>2. มี</Radio>
                        </Space>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.SI?.message}</ErrorMessage>
                </div>
                {si == 2 && (
                  <>
                    <div className="flex flex-col gap-3">
                      <div className="text-[15px]">
                        6.1
                        มูลค่าการขายสินค้า/บริการที่ขายผ่านทางอินเทอร์เน็ตคิดเป็นร้อยละเท่าใดของมูลค่าขายทั้งหมด
                      </div>
                      <Input
                        name="ITR"
                        type="number"
                        placeholder={session ? "ITR" : "ร้อยละ"}
                        register={register}
                        className="w-28"
                        errors={errors.ITR}
                        showWord="%"
                        isNumber
                        showName={!!session}
                        right
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="text-[15px]">
                        6.2
                        สัดส่วนของช่องทางการขายสินค้า/บริการที่ขายผ่านทางอินเทอร์เน็ตต่อยอดขายผ่านทางอินเทอร์เน็ตทั้งหมด
                        <p className="text-blue-500">
                          (สัดส่วนข้อ 1-7 รวมกันเท่ากับ 100%)
                        </p>
                      </div>

                      <Controller
                        control={control}
                        name="SI1"
                        shouldUnregister
                        render={({ field: { onChange, value } }) => (
                          <>
                            {setSi1(value)}
                            <Checkbox
                              className="start"
                              onChange={onChange}
                              ref={register("SI1").ref}
                              checked={value}
                            >
                              1. Social media เช่น Facebook, Instagram, Twitter,
                              Line
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [SI1]
                                </span>
                              )}
                            </Checkbox>
                            {value && (
                              <div className="flex gap-3 items-center text-[14px]">
                                สัดส่วน
                                <Input
                                  name="SI11"
                                  type="number"
                                  placeholder={session ? "SI11" : "ร้อยละ"}
                                  register={register}
                                  className="w-28"
                                  errors={errors.SI11}
                                  showWord="%"
                                  isNumber
                                  showName={!!session}
                                  right
                                />
                              </div>
                            )}
                          </>
                        )}
                      />
                      <Controller
                        control={control}
                        name="SI2"
                        shouldUnregister
                        render={({ field: { onChange, value } }) => (
                          <>
                            {setSi2(value)}
                            <Checkbox
                              className="start"
                              onChange={onChange}
                              ref={register("SI2").ref}
                              checked={value}
                            >
                              2. Website หรือ Application ของตนเอง
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [SI2]
                                </span>
                              )}
                            </Checkbox>
                            {value && (
                              <div className="flex gap-3 items-center text-[14px]">
                                สัดส่วน
                                <Input
                                  name="SI22"
                                  type="number"
                                  placeholder={session ? "SI22" : "ร้อยละ"}
                                  register={register}
                                  className="w-28"
                                  errors={errors.SI22}
                                  showWord="%"
                                  isNumber
                                  showName={!!session}
                                  right
                                />
                              </div>
                            )}
                          </>
                        )}
                      />
                      <Controller
                        control={control}
                        name="SI3"
                        shouldUnregister
                        render={({ field: { onChange, value } }) => (
                          <>
                            {setSi3(value)}
                            <Checkbox
                              className="start"
                              onChange={onChange}
                              ref={register("SI3").ref}
                              checked={value}
                            >
                              3. E-marketplace (ตลาดในต่างประเทศ) เช่น Lazada,
                              Shopee
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [SI3]
                                </span>
                              )}
                            </Checkbox>
                            {value && (
                              <div className="flex flex-wrap gap-5">
                                <div className="flex gap-3 items-center text-[14px]">
                                  สัดส่วน
                                  <Input
                                    name="SI33"
                                    type="number"
                                    placeholder={session ? "SI33" : "ร้อยละ"}
                                    register={register}
                                    className="w-28"
                                    errors={errors.SI33}
                                    showWord="%"
                                    isNumber
                                    showName={!!session}
                                    right
                                  />
                                </div>
                                <div className="flex gap-3 items-center text-[14px]">
                                  ค่าธรรมเนียม
                                  <Input
                                    name="F1"
                                    type="number"
                                    placeholder={session ? "F1" : "ร้อยละ"}
                                    register={register}
                                    className="w-28"
                                    errors={errors.F1}
                                    showWord="%"
                                    isNumber
                                    showName={!!session}
                                    right
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      />
                      <Controller
                        control={control}
                        name="SI4"
                        shouldUnregister
                        render={({ field: { onChange, value } }) => (
                          <>
                            {setSi4(value)}
                            <Checkbox
                              className="start"
                              onChange={onChange}
                              ref={register("SI4").ref}
                              checked={value}
                            >
                              4. Cross-border platform (ตลาดต่างประเทศ) เช่น
                              Tmall Toaboa, Alibaba, Amazon
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [SI4]
                                </span>
                              )}
                            </Checkbox>
                            {value && (
                              <div className="flex flex-wrap gap-5">
                                <div className="flex gap-3 items-center text-[14px]">
                                  สัดส่วน
                                  <Input
                                    name="SI44"
                                    type="number"
                                    placeholder={session ? "SI44" : "ร้อยละ"}
                                    register={register}
                                    className="w-28"
                                    errors={errors.SI44}
                                    showWord="%"
                                    isNumber
                                    showName={!!session}
                                    right
                                  />
                                </div>
                                <div className="flex gap-3 items-center text-[14px]">
                                  ค่าธรรมเนียม
                                  <Input
                                    name="F2"
                                    type="number"
                                    placeholder={session ? "F2" : "ร้อยละ"}
                                    register={register}
                                    className="w-28"
                                    errors={errors.F2}
                                    showWord="%"
                                    isNumber
                                    showName={!!session}
                                    right
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      />
                      <Controller
                        control={control}
                        name="SI5"
                        shouldUnregister
                        render={({ field: { onChange, value } }) => (
                          <>
                            {setSi5(value)}
                            <Checkbox
                              className="start"
                              onChange={onChange}
                              ref={register("SI5").ref}
                              checked={value}
                            >
                              5. Application ที่ให้บริการสั่งและส่งสินค้า/บริการ
                              บนมือถือและทางเว็บไซต์ เช่น Lineman, Grab, Food
                              Panda
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [SI5]
                                </span>
                              )}
                            </Checkbox>
                            {value && (
                              <div className="flex flex-wrap gap-5">
                                <div className="flex gap-3 items-center text-[14px]">
                                  สัดส่วน
                                  <Input
                                    name="SI55"
                                    type="number"
                                    placeholder={session ? "SI55" : "ร้อยละ"}
                                    register={register}
                                    className="w-28"
                                    errors={errors.SI55}
                                    showWord="%"
                                    isNumber
                                    showName={!!session}
                                    right
                                  />
                                </div>
                                <div className="flex gap-3 items-center text-[14px]">
                                  ค่าธรรมเนียม
                                  <Input
                                    name="F3"
                                    type="number"
                                    placeholder={session ? "F3" : "ร้อยละ"}
                                    register={register}
                                    className="w-28"
                                    errors={errors.F3}
                                    showWord="%"
                                    isNumber
                                    showName={!!session}
                                    right
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      />
                      <Controller
                        control={control}
                        name="SI6"
                        shouldUnregister
                        render={({ field: { onChange, value } }) => (
                          <>
                            {setSi6(value)}
                            <Checkbox
                              className="start"
                              onChange={onChange}
                              ref={register("SI6").ref}
                              checked={value}
                            >
                              6. Platform สำหรับจองที่พักและการท่องเที่ยว เช่น
                              Agoda, Booking, Airbnb, Traveloka
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [SI6]
                                </span>
                              )}
                            </Checkbox>
                            {value && (
                              <div className="flex flex-wrap gap-5">
                                <div className="flex gap-3 items-center text-[14px]">
                                  สัดส่วน
                                  <Input
                                    name="SI66"
                                    type="number"
                                    placeholder={session ? "SI66" : "ร้อยละ"}
                                    register={register}
                                    className="w-28"
                                    errors={errors.SI66}
                                    showWord="%"
                                    isNumber
                                    showName={!!session}
                                    right
                                  />
                                </div>
                                <div className="flex gap-3 items-center text-[14px]">
                                  ค่าธรรมเนียม
                                  <Input
                                    name="F4"
                                    type="number"
                                    placeholder={session ? "F4" : "ร้อยละ"}
                                    register={register}
                                    className="w-28"
                                    errors={errors.F4}
                                    showWord="%"
                                    isNumber
                                    showName={!!session}
                                    right
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      />
                      <Controller
                        control={control}
                        name="SI7"
                        shouldUnregister
                        render={({ field: { onChange, value } }) => (
                          <>
                            {setSi7(value)}
                            <Checkbox
                              className="start"
                              onChange={onChange}
                              ref={register("SI7").ref}
                              checked={value}
                            >
                              7. อื่นๆ (ระบุ)
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [SI7]
                                </span>
                              )}
                            </Checkbox>
                            {value && (
                              <>
                                <div>
                                  <Input
                                    name="SI8"
                                    placeholder={session ? "SI8" : "ระบุ"}
                                    register={register}
                                    className="w-60 md:w-72"
                                    errors={errors.SI8}
                                    showName={!!session}
                                  />
                                </div>
                                <div className="flex flex-wrap gap-5">
                                  <div className="flex gap-3 items-center text-[14px]">
                                    สัดส่วน
                                    <Input
                                      name="SI77"
                                      type="number"
                                      placeholder={session ? "SI77" : "ร้อยละ"}
                                      register={register}
                                      className="w-28"
                                      errors={errors.SI77}
                                      showWord="%"
                                      isNumber
                                      showName={!!session}
                                      right
                                    />
                                  </div>
                                  <div className="flex gap-3 items-center text-[14px]">
                                    ค่าธรรมเนียม
                                    <Input
                                      name="F5"
                                      type="number"
                                      placeholder={session ? "F5" : "ร้อยละ"}
                                      register={register}
                                      className="w-28"
                                      errors={errors.F5}
                                      showWord="%"
                                      isNumber
                                      showName={!!session}
                                      right
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <ErrorMessage>{errors?.SI7?.message}</ErrorMessage>
                  </>
                )}
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <div>
                  7. ในไตรมาสนี้
                  ยอดขาย/รายรับเปลี่ยนแปลงไปจากไตรมาสก่อนหน้านั้นหรือไม่ อย่างไร
                  {session && (
                    <span className="ml-3 !text-xs text-gray-400">[CHG]</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <Controller
                    control={control}
                    name="CHG"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("CHG").ref}
                      >
                        <Space direction="vertical">
                          <Radio value={1} className="start">
                            1. ไม่เปลี่ยนแปลง{" "}
                            <span className="text-blue-500">(ข้ามไปข้อ 9)</span>
                          </Radio>
                          <Radio value={2} className="start">
                            2. สูงขึ้นจากไตรมาสก่อนหน้า
                            {value === 2 && (
                              <Input
                                name="CIN"
                                type="number"
                                placeholder={session ? "CIN" : "ร้อยละ"}
                                register={register}
                                className="w-28 mt-2"
                                errors={errors.CIN}
                                showWord="%"
                                isNumber
                                showName={!!session}
                                right
                              />
                            )}
                          </Radio>
                          <Radio value={3} className="start">
                            3. ลดลงจากไตรมาสก่อนหน้า
                            {value === 3 && (
                              <Input
                                name="CDE"
                                type="number"
                                placeholder={session ? "CDE" : "ร้อยละ"}
                                register={register}
                                className="w-28 mt-2"
                                errors={errors.CDE}
                                showWord="%"
                                isNumber
                                showName={!!session}
                                right
                              />
                            )}
                          </Radio>
                        </Space>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.CHG?.message}</ErrorMessage>
                </div>
              </div>

              <div
                className={`card w-500 flex flex-col gap-3 ${
                  !(!!chg && chg !== 1) ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <div>
                  8. ถ้ายอดขาย/รายรับสูงขึ้นหรือลดลง
                  โปรดระบุสิ่งที่มีผลทำให้ยอดขาย/รายรับของกิจการเปลี่ยนแปลงมากที่สุด
                  {session && (
                    <span className="ml-3 !text-xs text-gray-400">[FAC]</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Controller
                    control={control}
                    name="FAC"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("FAC").ref}
                        disabled={!(!!chg && chg !== 1)}
                      >
                        <div className="flex">
                          <Space direction="vertical" className="w-2/4">
                            <Radio value={1} className="start">
                              1. ฤดูกาล เทศกาล
                            </Radio>
                            <Radio value={2} className="start">
                              2. กำลังซื้อของลูกค้า
                            </Radio>
                            <Radio value={3} className="start">
                              3. ต้นทุน/ราคาสินค้า
                            </Radio>
                            <Radio value={4} className="start">
                              4. คู่แข่งทางการค้า
                            </Radio>
                            <Radio value={5} className="start">
                              5. การปรับปรุงกิจการ
                            </Radio>
                          </Space>
                          <Space direction="vertical">
                            <Radio value={6} className="start">
                              6. ภาวะเศรษฐกิจ
                            </Radio>
                            <Radio value={7} className="start">
                              7. นโยบายภาครัฐ
                            </Radio>
                            <Radio value={8} className="start">
                              8. เทคโนโลยี
                            </Radio>
                            <Radio value={9} className="start">
                              9. โรคระบาด เช่น โควิด-19
                            </Radio>
                            <Radio value={10} className="start">
                              10. อื่นๆ (ระบุ)
                              {value === 10 && (
                                <Input
                                  name="FAC_1"
                                  placeholder={session ? "FAC_1" : "ระบุ"}
                                  register={register}
                                  className="w-full mt-2"
                                  errors={errors.FAC_1}
                                  showName={!!session}
                                />
                              )}
                            </Radio>
                          </Space>
                        </div>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.FAC?.message}</ErrorMessage>
                </div>
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <div>
                  9. ในไตรมาสนี้
                  ยอดขาย/รายรับเปลี่ยนแปลงไปจากไตรมาสเดียวกันกับปีก่อนหรือไม่
                  {session && (
                    <span className="ml-3 !text-xs text-gray-400">[PRVS]</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <Controller
                    control={control}
                    name="PRVS"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("PRVS").ref}
                      >
                        <Space direction="vertical">
                          <Radio value={1} className="start">
                            1. ไม่เปลี่ยนแปลง
                          </Radio>
                          <Radio value={2} className="start">
                            2. สูงขึ้นจากปีก่อน
                            {value === 2 && (
                              <Input
                                name="PIN"
                                type="number"
                                placeholder={session ? "PIN" : "ร้อยละ"}
                                register={register}
                                className="w-28 mt-2"
                                errors={errors.PIN}
                                showWord="%"
                                isNumber
                                showName={!!session}
                                right
                              />
                            )}
                          </Radio>
                          <Radio value={3} className="start">
                            3. ลดลงจากปีก่อน
                            {value === 3 && (
                              <Input
                                name="PDE"
                                type="number"
                                placeholder={session ? "PDE" : "ร้อยละ"}
                                register={register}
                                className="w-28 mt-2"
                                errors={errors.PDE}
                                showWord="%"
                                isNumber
                                showName={!!session}
                                right
                              />
                            )}
                          </Radio>
                        </Space>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.PRVS?.message}</ErrorMessage>
                </div>
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <p className="text-blue-500">
                  *** บันทึกเฉพาะธุรกิจประเภทขายปลีกในข้อ 3 เช่น ขายของชำ
                  ร้านสะดวกซื้อ ซุปเปอร์มาเก็ต ดิสเคานท์สโตร์ ห้างสรรพสินค้า
                  ขายปลีกสินค้าเฉพาะอย่าง ฯลฯ
                </p>
                <div>10. มูลค่าสินค้าคงเหลือเมื่อสิ้นไตรมาส</div>
                <div className="flex gap-5 items-center">
                  จำนวน
                  <Input
                    name="STO_temp"
                    placeholder={session ? "STO" : "มูลค่าคงเหลือ"}
                    register={register}
                    className="w-60 md:w-72"
                    errors={errors.STO_temp}
                    showWord="บาท"
                    showName={!!session}
                    right
                  />
                </div>
                <div>
                  และคาดว่าสินค้าคงเหลือดังกล่าว
                  จะสามารถขายได้ภายในกี่วันหลังสิ้นสุดไตรมาสปัจจุบัน
                </div>
                <Input
                  name="DAY"
                  type="number"
                  placeholder={session ? "DAY" : "วัน"}
                  register={register}
                  className="w-28"
                  errors={errors.DAY}
                  showWord="วัน"
                  showName={!!session}
                  right
                />
              </div>

              <div className="card w-full flex flex-col gap-3">
                <div>11. ความคิดเห็นที่มีต่อธุรกิจของท่าน</div>
                <div className="text-center">
                  ไตรมาสนี้เทียบกับไตรมาสก่อนหน้า
                </div>
                <div>
                  <Row gutter={16} className="mb-4 text-center">
                    <Col className="gutter-row" span={8}>
                      <p>ด้าน</p>
                    </Col>
                    <Col className="gutter-row" span={3}>
                      <h5>(1)</h5>
                      <h4>เพิ่มขึ้นมาก</h4>
                    </Col>
                    <Col className="gutter-row" span={3}>
                      <h5>(2)</h5>
                      <h4>เพิ่มขึ้นเล็กน้อย</h4>
                    </Col>
                    <Col className="gutter-row" span={3}>
                      <h5>(3)</h5>
                      <h4>เท่าเดิม</h4>
                    </Col>
                    <Col className="gutter-row" span={3}>
                      <h5>(4)</h5>
                      <h4>ลดลงเล็กน้อย</h4>
                    </Col>
                    <Col className="gutter-row" span={3}>
                      <h5>(5)</h5>
                      <h4>ลดลงมาก</h4>
                    </Col>
                  </Row>
                  <Controller
                    control={control}
                    name="OP1"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP1").ref}
                        className="w-full"
                      >
                        <Row gutter={16} className="text-center">
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - ต้นทุน
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP1]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP1?.message}</ErrorMessage>
                  <div className="w-full h-2"></div>
                  <Controller
                    control={control}
                    name="OP2"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP2").ref}
                        className="w-full"
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - กำไร
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP2]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP2?.message}</ErrorMessage>
                  <div className="w-full h-2"></div>
                  <Controller
                    control={control}
                    name="OP3"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP3").ref}
                        className="w-full"
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - ราคาขายสินค้า/บริการของท่าน
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP3]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP3?.message}</ErrorMessage>
                  <div className="w-full h-2"></div>
                  <Controller
                    control={control}
                    name="OP4"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP4").ref}
                        className="w-full"
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - สภาพการแข่งขันของธุรกิจในพื้นที่
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP4]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP4?.message}</ErrorMessage>
                  <div className="w-full h-2"></div>
                  <Controller
                    control={control}
                    name="OP5"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP5").ref}
                        className="w-full"
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - สภาพคล่องทางการเงินของธุรกิจท่าน
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP5]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP5?.message}</ErrorMessage>
                  <div className="w-full h-2"></div>
                  <Controller
                    control={control}
                    name="OP6"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP6").ref}
                        className="w-full"
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - แนวโน้มการลงทุนในกิจการของท่าน
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP6]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP6?.message}</ErrorMessage>
                  <div className="w-full h-5"></div>
                  <hr />
                  <div className="w-full h-5"></div>
                  <div className="text-center">ไตรมาสถัดไป</div>
                  <div className="w-full h-5"></div>
                  <Controller
                    control={control}
                    name="OP7"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP7").ref}
                        className="w-full"
                      >
                        <Row gutter={16} className="text-center">
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - ต้นทุน
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP7]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP7?.message}</ErrorMessage>
                  <div className="w-full h-2"></div>
                  <Controller
                    control={control}
                    name="OP8"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP8").ref}
                        className="w-full"
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - กำไร
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP8]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP8?.message}</ErrorMessage>
                  <div className="w-full h-2"></div>
                  <Controller
                    control={control}
                    name="OP9"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP9").ref}
                        className="w-full"
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - ราคาขายสินค้า/บริการของท่าน
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP9]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP9?.message}</ErrorMessage>
                  <div className="w-full h-2"></div>
                  <Controller
                    control={control}
                    name="OP10"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP10").ref}
                        className="w-full"
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - สภาพการแข่งขันของธุรกิจในพื้นที่
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP10]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP10?.message}</ErrorMessage>
                  <div className="w-full h-2"></div>
                  <Controller
                    control={control}
                    name="OP11"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP11").ref}
                        className="w-full"
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - สภาพคล่องทางการเงินของธุรกิจท่าน
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP11]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP11?.message}</ErrorMessage>
                  <div className="w-full h-2"></div>
                  <Controller
                    control={control}
                    name="OP12"
                    shouldUnregister
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        value={value}
                        onChange={onChange}
                        ref={register("OP12").ref}
                        className="w-full"
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row text-left" span={8}>
                            <p>
                              - แนวโน้มการลงทุนในกิจการของท่าน
                              {session && (
                                <span className="ml-3 !text-xs text-gray-400">
                                  [OP12]
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={1} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={2} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={3} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={4} className="zero"></Radio>
                          </Col>
                          <Col className="gutter-row f-center" span={3}>
                            <Radio value={5} className="zero"></Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    )}
                  />
                  <ErrorMessage>{errors?.OP12?.message}</ErrorMessage>
                </div>
              </div>
            </>
          )}
          <div className="w-full">
            <div className="flex flex-col gap-3 justify-end items-end">
              {(session?.user.role === Role.INTERVIEWER ||
                session?.user.role === Role.SUBJECT) && (
                <>
                  <div className="flex gap-5 items-center">
                    เจ้าหน้าที่ปฏิบัติงานเก็บรวบรวมข้อมูล
                    <Input
                      name="P1"
                      placeholder="P1"
                      register={register}
                      className="w-36"
                      errors={errors.P1}
                      showName
                    />
                  </div>
                  <div className="flex gap-5 items-center">
                    เจ้าหน้าที่บรรณาธิกรและลงรหัส
                    <Input
                      name="P2"
                      placeholder="P2"
                      register={register}
                      className="w-36"
                      errors={errors.P2}
                      showName
                    />
                  </div>
                  <div className="flex gap-5 items-center">
                    เจ้าหน้าที่บันทึกข้อมูล
                    <Input
                      name="P3"
                      placeholder="P3"
                      register={register}
                      className="w-36"
                      errors={errors.P3}
                      showName
                    />
                  </div>
                </>
              )}
              {(session?.user.role === Role.SUPERVISOR ||
                session?.user.role === Role.SUBJECT) && (
                <div className="flex gap-5 items-center">
                  ผู้ตรวจ
                  <Input
                    name="P4"
                    placeholder="P4"
                    register={register}
                    className="w-36"
                    errors={errors.P4}
                    showName
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Button type="submit" primary>
              บันทึก
            </Button>
          </div>
        </form>
      </div>
      <Modal
        title={<p className="text-center text-xl">ยืนยันข้อมูล</p>}
        open={modalOpen}
        onOk={submitFormData}
        onCancel={() => setModalOpen(false)}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
        closable={false}
      >
        <div className="flex flex-col gap-2 overflow-y-scroll max-h-[500px]">
          <p className="text-blue-500 mb-2">
            * กรุณาตรวจสอบข้อมูลสถานประกอบการของท่านว่าถูกต้องหรือไม่
            ถ้าถูกต้องแล้วให้กดยืนยันเพื่อทำการส่งข้อมูลในแบบฟอร์มที่ท่านกรอก
          </p>
          <p className="flex justify-between border-b">
            คำนำหน้านาม:<span>{getValues("TITLE")}</span>
          </p>
          <p className="flex justify-between border-b">
            ยศ:<span>{getValues("RANK")}</span>
          </p>
          <p className="flex justify-between border-b">
            ชื่อเจ้าของ/หัวหน้าครัวเรือน:<span>{getValues("FIRSTNAME")}</span>
          </p>
          <p className="flex justify-between border-b">
            นามสกุล:<span>{getValues("LASTNAME")}</span>
          </p>
          <p className="flex justify-between border-b">
            คำนำหน้าชื่อสถานประกอบการ:<span>{getValues("EST_TITLE")}</span>
          </p>
          <p className="flex justify-between border-b">
            ชื่อสถานประกอบการ:<span>{getValues("EST_NAME")}</span>
          </p>
          <p className="flex justify-between border-b">
            เลขที่:<span>{getValues("ADD_NO")}</span>
          </p>
          <p className="flex justify-between border-b">
            ชื่ออาคาร/หมู่บ้าน:<span>{getValues("BUILDING")}</span>
          </p>
          <p className="flex justify-between border-b">
            ห้องเลขที่/ชั้นที่:<span>{getValues("ROOM")}</span>
          </p>
          <p className="flex justify-between border-b">
            ถนน:<span>{getValues("STREET")}</span>
          </p>
          <p className="flex justify-between border-b">
            ตรอก:<span>{getValues("BLK")}</span>
          </p>
          <p className="flex justify-between border-b">
            ซอย:<span>{getValues("SOI")}</span>
          </p>
          <p className="flex justify-between border-b">
            ตำบล/แขวง:<span>{getValues("SUB_DIST")}</span>
          </p>
          <p className="flex justify-between border-b">
            อำเภอ/เขต:<span>{getValues("DISTRICT")}</span>
          </p>
          <p className="flex justify-between border-b">
            จังหวัด:<span>{getValues("PROVINCE")}</span>
          </p>
          <p className="flex justify-between border-b">
            รหัสไปรษณีย์:<span>{getValues("POST_CODE")}</span>
          </p>
          <p className="flex justify-between border-b">
            โทรศัพท์:<span>{getValues("TEL_NO")}</span>
          </p>
          <p className="flex justify-between border-b">
            อีเมล:<span>{getValues("E_MAIL")}</span>
          </p>
          <p className="flex justify-between border-b">
            Website:<span>{getValues("WEBSITE")}</span>
          </p>
          <p className="flex justify-between border-b">
            Social Media:<span>{getValues("SOCIAL")}</span>
          </p>
        </div>
      </Modal>
      <FloatButton.BackTop tooltip={<div>ไปบนสุด</div>} visibilityHeight={0} />
    </Portal>
  );
};

export default FormPage;
