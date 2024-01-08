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
} from "@/helpers/common";
import { calcQuarter, checkDateBetween, quarterMap } from "@/helpers/quarter";
import {
  consistencyCheck1,
  consistencyCheck2,
  validateFormData,
} from "@/helpers/validate";
import { ReportForm, createReportSchema } from "@/types/validationSchemas";
import typeOption from "@/utils/typeOption";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Col, Radio, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import _ from "lodash";
import { FormErrors } from "@/types/common";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import axios from "axios";
import { errorHandler } from "@/helpers/errorHandler";
import { InitialControl, ReportControl } from "@/types/control";
import Loading from "@/components/Loading";
import { IoChevronBack } from "react-icons/io5";
import Swal from "sweetalert2";

const FormPage = () => {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors[]>([]);
  const params = useParams();
  const searchParams = useSearchParams();
  const yr = Number(searchParams.get("yr"));
  const qtr = Number(searchParams.get("qtr"));
  const mode = searchParams.get("mode");
  const router = useRouter();
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
      TYPE: 0,
      NO: 32,
      QTR: qtr,
      YR: yr,
      ENU: 1,
    },
  });
  const quarterData = quarterMap(Number("25" + yr.toString()) - 543)[
    calcQuarter() - 1
  ];

  const r1 = watch("R1_temp");
  const r2 = watch("R2_temp");
  const r3 = watch("R3_temp");
  const tr_temp = watch("TR_temp");
  const tr = watch("TR");
  const si = watch("SI");
  const si1 = watch("SI1");
  const si2 = watch("SI2");
  const si3 = watch("SI3");
  const si4 = watch("SI4");
  const si5 = watch("SI5");
  const si6 = watch("SI6");
  const si7 = watch("SI7");
  const chg = watch("CHG");
  const sto = watch("STO_temp");
  const enu = watch("ENU");

  useEffect(() => {
    if (
      !qtr ||
      !between(qtr, 1, 4) ||
      !mode ||
      !["create", "edit"].includes(mode) ||
      !yr
    ) {
      router.push("/notfound");
      return;
    }

    const format = "YYYY-MM-DD";
    const date = new Date();
    const currentDate = moment(date).format(format);
    const startDate = quarterData.formSubmittedRange[0];
    const endDate = quarterData.formSubmittedRange[1];
    const canEdittedQtr = checkDateBetween(currentDate, startDate, endDate);

    if (!canEdittedQtr) {
      router.push("/denied?code=1");
      return;
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

  const getIdenFromControl = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/searchId/${params.id}`);
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
          setValue("AMP", Number(amp));
          setValue("DISTRICT", amp_name);
          setValue("BUILDING", building ? building : "-");
          setValue("EST_NAME", comp_name ? comp_name : "-");
          setValue("CWT", cwt);
          setValue("PROVINCE", cwt_name);
          setValue("MUN", district);
          setValue("E_MAIL", e_mail ? e_mail : "-");
          setValue("EA", Number(ea));
          setValue("LG", econ_fm);
          setValue("FIRSTNAME", firstname ? firstname : "-");
          setValue("ADD_NO", house_no);
          setValue("TITLE", initial ? initial : "-");
          setValue("LASTNAME", lastname ? lastname : "-");
          setValue("REG", reg);
          setValue("SIZE_L", Number(size12));
          setValue("SOI", soi ? soi : "-");
          setValue("STREET", street ? street : "-");
          setValue("TAM", Number(tam));
          setValue("SUB_DIST", tam_name);
          setValue("TEL_NO", tel_no ? tel_no.replace("-", "") : "-");
          setValue("TSIC_L", tsic_code);
          setValue("VIL", Number(vil));
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
          router.push("/notfound");
        }
      }
      setLoading(false);
    } catch (err: any) {
      if (err.response.status === 404) {
        router.push("/notfound");
      } else if (err.response.status === 400) {
        router.push("/denied?code=2");
      } else {
        errorHandler(err);
      }
      setLoading(false);
    }
  };

  const getIdenFromPrevQtr = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/searchId/${params.id}`, {
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
          setValue("AMP", Number(AMP));
          setValue("TAM", Number(TAM));
          setValue("MUN", MUN);
          setValue("EA", Number(EA));
          setValue("VIL", Number(VIL));
          setValue("TSIC_R", TSIC_R);
          setValue("TSIC_L", TSIC_L);
          setValue("SIZE_R", Number(SIZE_R));
          setValue("SIZE_L", Number(SIZE_L));
          setValue("NO", Number(NO));
          setValue("ENU", Number(ENU));
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
            switch (Number(LG)) {
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
          router.push("/notfound");
        }
      }
      setLoading(false);
    } catch (err: any) {
      if (err.response.status === 404) {
        router.push("/notfound");
      } else if (err.response.status === 400) {
        router.push("/denied?code=2");
      } else {
        errorHandler(err);
      }
      setLoading(false);
    }
  };

  const getQuarterReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/report/${params.id}`, {
        params: { quarter: qtr, year: yr },
      });

      if (res.status === 200) {
        console.log(res.data);
        //   if (res.data) {
        //     const {
        //       REG,
        //       CWT,
        //       AMP,
        //       TAM,
        //       MUN,
        //       EA,
        //       VIL,
        //       TSIC_R,
        //       TSIC_L,
        //       SIZE_R,
        //       SIZE_L,
        //       NO,
        //       ENU,
        //       TITLE,
        //       RANK,
        //       FIRSTNAME,
        //       LASTNAME,
        //       EST_TITLE,
        //       EST_NAME,
        //       ADD_NO,
        //       BUILDING,
        //       ROOM,
        //       STREET,
        //       BLK,
        //       SOI,
        //       SUB_DIST,
        //       DISTRICT,
        //       PROVINCE,
        //       POST_CODE,
        //       TEL_NO,
        //       E_MAIL,
        //       WEBSITE,
        //       SOCIAL,
        //       TSIC_CHG,
        //       LG,
        //       LG1,
        //       LG1_temp,
        //       LG2,
        //       LG3,
        //       LG4,
        //     } = res.data as ReportControl;
        //     setValue("REG", REG);
        //     setValue("CWT", CWT);
        //     setValue("AMP", Number(AMP));
        //     setValue("TAM", Number(TAM));
        //     setValue("MUN", MUN);
        //     setValue("EA", Number(EA));
        //     setValue("VIL", Number(VIL));
        //     setValue("TSIC_R", TSIC_R);
        //     setValue("TSIC_L", TSIC_L);
        //     setValue("SIZE_R", Number(SIZE_R));
        //     setValue("SIZE_L", Number(SIZE_L));
        //     setValue("NO", Number(NO));
        //     setValue("ENU", Number(ENU));
        //     setValue("TITLE", TITLE);
        //     setValue("RANK", RANK);
        //     setValue("FIRSTNAME", FIRSTNAME);
        //     setValue("LASTNAME", LASTNAME);
        //     setValue("EST_TITLE", EST_TITLE);
        //     setValue("EST_NAME", EST_NAME);
        //     setValue("ADD_NO", ADD_NO);
        //     setValue("BUILDING", BUILDING);
        //     setValue("ROOM", ROOM);
        //     setValue("STREET", STREET);
        //     setValue("BLK", BLK);
        //     setValue("SOI", SOI);
        //     setValue("SUB_DIST", SUB_DIST);
        //     setValue("DISTRICT", DISTRICT);
        //     setValue("PROVINCE", PROVINCE);
        //     setValue("POST_CODE", POST_CODE);
        //     setValue("TEL_NO", TEL_NO);
        //     setValue("E_MAIL", E_MAIL);
        //     setValue("WEBSITE", WEBSITE);
        //     setValue("SOCIAL", SOCIAL);
        //     setValue("TSIC_CHG", TSIC_CHG);
        //     if (LG) {
        //       switch (Number(LG)) {
        //         case 1:
        //           setValue("LG1_temp", LG1_temp);
        //           setValue("LG1", LG1);
        //           break;
        //         case 2:
        //           setValue("LG2", LG2);
        //           break;
        //         case 3:
        //           setValue("LG3", LG3);
        //           break;
        //         case 10:
        //           setValue("LG4", LG4);
        //           break;
        //         default:
        //           break;
        //       }
        //     }
        //   } else {
        //     router.push("/notfound");
        //   }
      }
      setLoading(false);
    } catch (err: any) {
      if (err.response.status === 404) {
        router.push("/notfound");
      } else if (err.response.status === 400) {
        router.push("/denied?code=2");
      } else {
        errorHandler(err);
      }
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    let err: FormErrors[] = [];
    if (data.ENU === 1) {
      err = consistencyCheck1(data);
    } else {
      err = consistencyCheck2(data);
    }
    if (err.length > 0) {
      setFormErrors(err);
      toast.error("ตรวจพบข้อมูลที่ไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง");
      window.scrollTo(0, 0);
      return;
    } else {
      const result = validateFormData(data);
      try {
        setLoading(true);
        const res = await axios.post("/api/report", result, {
          headers: { mode },
        });
        if (res.status === 200) {
          toast.success("ส่งข้อมูลสำเร็จ");
          router.push("/search");
        }
      } catch (err: any) {
        errorHandler(err);
      }
      setLoading(false);
    }
  });

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
      text: "ข้อมูลที่ยังไม่ได้ถูกบันทึกจะหายทั้งหมด คุณแน่ใจหรือไม่ที่จะกลับไปหน้าค้นหา",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ไม่",
      confirmButtonText: "ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/search");
      }
    });
  };

  return (
    <>
      {loading && <Loading type="full" />}
      <div className="mb-10 flex flex-col gap-2">
        <Title title={`แบบฟอร์มสำรวจยอดขายรายไตรมาส พ.ศ. 25${yr}`}>
          <Button secondary onClick={onClickBack}>
            <IoChevronBack className="mr-1" />
            กลับ
          </Button>
        </Title>
        <div className="text-xl">
          ไตรมาส {qtr} ({quarterData.monthRange[0]} -{" "}
          {quarterData.monthRange[2]} {yr})
        </div>
      </div>
      <div className="card">
        <h1 className="mb-3">เลขประจำสถานประกอบการ: {params.id}</h1>
        <form
          className="flex flex-wrap gap-10 justify-center"
          onSubmit={onSubmit}
        >
          {formErrors.length > 0 && (
            <div className="card w-full border error !bg-red-100 flex flex-wrap gap-y-5">
              {renderErrors()}
            </div>
          )}

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
                  type="number"
                  placeholder="AMP"
                  register={register}
                  className="w-20"
                  errors={errors.AMP}
                  isNumber
                  right
                />
              </div>
              <div className="flex items-center gap-5">
                <label className="w-10">TAM</label>
                <Input
                  name="TAM"
                  type="number"
                  placeholder="TAM"
                  register={register}
                  className="w-20"
                  errors={errors.TAM}
                  isNumber
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
                  type="number"
                  placeholder="EA"
                  register={register}
                  className="w-20"
                  errors={errors.EA}
                  isNumber
                  right
                />
              </div>
              <div className="flex items-center gap-5">
                <label className="w-10">VIL</label>
                <Input
                  name="VIL"
                  type="number"
                  placeholder="VIL"
                  register={register}
                  className="w-20"
                  errors={errors.VIL}
                  isNumber
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
                  type="number"
                  placeholder="SIZE_R"
                  register={register}
                  className="w-20"
                  errors={errors.SIZE_R}
                  isNumber
                  right
                />
              </div>
              <div className="flex items-center gap-5">
                <label className="w-10">SIZE_L</label>
                <Input
                  name="SIZE_L"
                  type="number"
                  placeholder="SIZE_L"
                  register={register}
                  className="w-20"
                  errors={errors.SIZE_L}
                  isNumber
                  disabled
                  right
                />
              </div>
              <div className="flex items-center gap-5">
                <label className="w-10">NO</label>
                <Input
                  name="NO"
                  type="number"
                  placeholder="NO"
                  register={register}
                  className="w-20"
                  errors={errors.NO}
                  isNumber
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
                  type="number"
                  placeholder="ENU"
                  register={register}
                  className="w-20"
                  errors={errors.ENU}
                  isNumber
                  right
                />
              </div>
            </div>
          </div>

          <div className="card w-full flex flex-wrap gap-5">
            <div className="w-full">1. ข้อมูลสถานประกอบการ</div>
            <p className="w-full text-blue-500">
              *** กรุณากรอกข้อมูลให้ครบทุกช่อง
              หากช่องไหนไม่มีข้อมูลให้ใช้เครื่องหมายขีด ( - )
            </p>
            <div className="flex items-center gap-5">
              <label>คำนำหน้านาม</label>
              <Input
                name="TITLE"
                placeholder="TITLE"
                register={register}
                className="w-24"
                errors={errors.TITLE}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>ยศ</label>
              <Input
                name="RANK"
                placeholder="RANK"
                register={register}
                className="w-60 md:w-72"
                errors={errors.RANK}
                showName
              />
            </div>
            <div className="flex flex-wrap gap-5">
              <div className="flex items-center gap-5">
                <label>ชื่อเจ้าของ/หัวหน้าครัวเรือน</label>
                <Input
                  name="FIRSTNAME"
                  placeholder="FIRSTNAME"
                  register={register}
                  className="w-60 md:w-72"
                  errors={errors.FIRSTNAME}
                  showName
                />
              </div>
              <div className="flex items-center gap-5">
                <label>นามสกุล</label>
                <Input
                  name="LASTNAME"
                  placeholder="LASTNAME"
                  register={register}
                  className="w-60 md:w-72"
                  errors={errors.LASTNAME}
                  showName
                />
              </div>
            </div>
            <div className="flex items-center gap-5">
              <label>คำนำหน้าชื่อสถานประกอบการ</label>
              <Input
                name="EST_TITLE"
                placeholder="EST_TITLE"
                register={register}
                className="w-28"
                errors={errors.EST_TITLE}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>ชื่อสถานประกอบการ</label>
              <Input
                name="EST_NAME"
                placeholder="EST_NAME"
                register={register}
                className="w-60 md:w-72"
                errors={errors.EST_NAME}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>เลขที่</label>
              <Input
                name="ADD_NO"
                placeholder="ADD_NO"
                register={register}
                className="w-28"
                errors={errors.ADD_NO}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>ชื่ออาคาร/หมู่บ้าน</label>
              <Input
                name="BUILDING"
                placeholder="BUILDING"
                register={register}
                className="w-60 md:w-72"
                errors={errors.BUILDING}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>ห้องเลขที่/ชั้นที่</label>
              <Input
                name="ROOM"
                placeholder="ROOM"
                register={register}
                className="w-28"
                errors={errors.ROOM}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>ถนน</label>
              <Input
                name="STREET"
                placeholder="STREET"
                register={register}
                className="w-60 md:w-72"
                errors={errors.STREET}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>ตรอก</label>
              <Input
                name="BLK"
                placeholder="BLK"
                register={register}
                className="w-60 md:w-72"
                errors={errors.BLK}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>ซอย</label>
              <Input
                name="SOI"
                placeholder="SOI"
                register={register}
                className="w-60 md:w-72"
                errors={errors.SOI}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>ตำบล/แขวง</label>
              <Input
                name="SUB_DIST"
                placeholder="SUB_DIST"
                register={register}
                className="w-60 md:w-72"
                errors={errors.SUB_DIST}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>อำเภอ/เขต</label>
              <Input
                name="DISTRICT"
                placeholder="DISTRICT"
                register={register}
                className="w-60 md:w-72"
                errors={errors.DISTRICT}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>จังหวัด</label>
              <div>{getValues("PROVINCE")}</div>
            </div>
            <div className="flex items-center gap-5">
              <label>รหัสไปรษณีย์</label>
              <Input
                name="POST_CODE"
                placeholder="POST_CODE"
                register={register}
                className="w-36"
                errors={errors.POST_CODE}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>
                โทรศัพท์
                <span className="text-blue-500 text-xs ml-3">
                  *กรอกเฉพาะตัวเลข
                </span>
              </label>
              <Input
                name="TEL_NO"
                placeholder="TEL_NO"
                register={register}
                className="w-36"
                errors={errors.TEL_NO}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>อีเมล</label>
              <Input
                name="E_MAIL"
                placeholder="E_MAIL"
                register={register}
                className="w-60 md:w-72"
                errors={errors.E_MAIL}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>Website</label>
              <Input
                name="WEBSITE"
                placeholder="WEBSITE"
                register={register}
                className="w-60 md:w-72"
                errors={errors.WEBSITE}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>Social Media</label>
              <Input
                name="SOCIAL"
                placeholder="SOCIAL"
                register={register}
                className="w-60 md:w-72"
                errors={errors.SOCIAL}
                showName
              />
            </div>
            {enu === 8 && (
              <div className="flex items-center gap-5 w-full">
                <label>
                  รหัส TSIC นอกข่ายการสำรวจฯ
                  <span className="text-red-500">*</span>
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

          {enu === 1 && (
            <>
              <div className="card w-500 flex flex-col gap-3">
                <div>
                  2. รูปแบบการจัดตั้งตามกฎหมาย
                  <span className="ml-3 !text-xs text-gray-400">[LG]</span>
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
                                  placeholder="LG1"
                                  register={register}
                                  className="w-60 md:w-72"
                                  errors={errors.LG1}
                                  showName
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
                                  placeholder="LG2"
                                  register={register}
                                  className="w-60 md:w-72"
                                  errors={errors.LG2}
                                  showName
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
                                  placeholder="LG3"
                                  register={register}
                                  className="w-60 md:w-72"
                                  errors={errors.LG3}
                                  showName
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
                                  placeholder="LG4"
                                  register={register}
                                  className="w-60 md:w-72"
                                  errors={errors.LG4}
                                  showName
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
                    placeholder="DES_TYPE"
                    register={register}
                    className="w-60 md:w-72"
                    errors={errors.DES_TYPE}
                    showName
                  />
                  <Dropdown
                    name="TYPE"
                    placeholder="TYPE"
                    options={typeOption}
                    className="w-60 md:w-72"
                    errors={errors.TYPE}
                    control={control}
                    showName
                  />
                </div>
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <div>4. จำนวนคนทำงานตามปกติของสถานประกอบการในไตรมาสนี้</div>
                <Input
                  name="EMP"
                  type="number"
                  placeholder="EMP"
                  register={register}
                  className="w-40"
                  errors={errors.EMP}
                  showWord="คน"
                  isNumber
                  showName
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
                    <p>เดือน {quarterData.monthRange[0]}</p>
                    <Input
                      name="R1_temp"
                      placeholder="R1"
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.R1_temp}
                      showWord="บาท"
                      showName
                      right
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p>เดือน {quarterData.monthRange[1]}</p>
                    <Input
                      name="R2_temp"
                      placeholder="R2"
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.R2_temp}
                      showWord="บาท"
                      showName
                      right
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p>เดือน {quarterData.monthRange[2]}</p>
                    <Input
                      name="R3_temp"
                      placeholder="R3"
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.R3_temp}
                      showWord="บาท"
                      showName
                      right
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-bold">รวม 3 เดือน</p>
                    <Input
                      name="TR_temp"
                      placeholder="TR"
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.TR_temp}
                      showWord="บาท"
                      showName
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
                  <span className="ml-3 !text-xs text-gray-400">[SI]</span>
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
                        placeholder="ITR"
                        register={register}
                        className="w-28"
                        errors={errors.ITR}
                        showWord="%"
                        isNumber
                        showName
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
                        render={({ field: { onChange } }) => (
                          <Checkbox
                            className="start"
                            onChange={onChange}
                            ref={register("SI1").ref}
                          >
                            1. Social media เช่น Facebook, Instagram, Twitter,
                            Line
                            <span className="ml-3 !text-xs text-gray-400">
                              [SI1]
                            </span>
                          </Checkbox>
                        )}
                      />
                      {si1 && (
                        <div className="flex gap-3 items-center text-[14px]">
                          สัดส่วน
                          <Input
                            name="SI11"
                            type="number"
                            placeholder="SI11"
                            register={register}
                            className="w-28"
                            errors={errors.SI11}
                            showWord="%"
                            isNumber
                            showName
                            right
                          />
                        </div>
                      )}
                      <Controller
                        control={control}
                        name="SI2"
                        shouldUnregister
                        render={({ field: { onChange } }) => (
                          <Checkbox
                            className="start"
                            onChange={onChange}
                            ref={register("SI2").ref}
                          >
                            2. Website หรือ Application ของตนเอง
                            <span className="ml-3 !text-xs text-gray-400">
                              [SI2]
                            </span>
                          </Checkbox>
                        )}
                      />
                      {si2 && (
                        <div className="flex gap-3 items-center text-[14px]">
                          สัดส่วน
                          <Input
                            name="SI22"
                            type="number"
                            placeholder="SI22"
                            register={register}
                            className="w-28"
                            errors={errors.SI22}
                            showWord="%"
                            isNumber
                            showName
                            right
                          />
                        </div>
                      )}
                      <Controller
                        control={control}
                        name="SI3"
                        shouldUnregister
                        render={({ field: { onChange } }) => (
                          <Checkbox
                            className="start"
                            onChange={onChange}
                            ref={register("SI3").ref}
                          >
                            3. E-marketplace (ตลาดในต่างประเทศ) เช่น Lazada,
                            Shopee
                            <span className="ml-3 !text-xs text-gray-400">
                              [SI3]
                            </span>
                          </Checkbox>
                        )}
                      />
                      {si3 && (
                        <div className="flex gap-5">
                          <div className="flex gap-3 items-center text-[14px]">
                            สัดส่วน
                            <Input
                              name="SI33"
                              type="number"
                              placeholder="SI33"
                              register={register}
                              className="w-28"
                              errors={errors.SI33}
                              showWord="%"
                              isNumber
                              showName
                              right
                            />
                          </div>
                          <div className="flex gap-3 items-center text-[14px]">
                            ค่าธรรมเนียม
                            <Input
                              name="F1"
                              type="number"
                              placeholder="F1"
                              register={register}
                              className="w-28"
                              errors={errors.F1}
                              showWord="%"
                              isNumber
                              showName
                              right
                            />
                          </div>
                        </div>
                      )}
                      <Controller
                        control={control}
                        name="SI4"
                        shouldUnregister
                        render={({ field: { onChange } }) => (
                          <Checkbox
                            className="start"
                            onChange={onChange}
                            ref={register("SI4").ref}
                          >
                            4. Cross-border platform (ตลาดต่างประเทศ) เช่น Tmall
                            Toaboa, Alibaba, Amazon
                            <span className="ml-3 !text-xs text-gray-400">
                              [SI4]
                            </span>
                          </Checkbox>
                        )}
                      />
                      {si4 && (
                        <div className="flex gap-5">
                          <div className="flex gap-3 items-center text-[14px]">
                            สัดส่วน
                            <Input
                              name="SI44"
                              type="number"
                              placeholder="SI44"
                              register={register}
                              className="w-28"
                              errors={errors.SI44}
                              showWord="%"
                              isNumber
                              showName
                              right
                            />
                          </div>
                          <div className="flex gap-3 items-center text-[14px]">
                            ค่าธรรมเนียม
                            <Input
                              name="F2"
                              type="number"
                              placeholder="F2"
                              register={register}
                              className="w-28"
                              errors={errors.F2}
                              showWord="%"
                              isNumber
                              showName
                              right
                            />
                          </div>
                        </div>
                      )}
                      <Controller
                        control={control}
                        name="SI5"
                        shouldUnregister
                        render={({ field: { onChange } }) => (
                          <Checkbox
                            className="start"
                            onChange={onChange}
                            ref={register("SI5").ref}
                          >
                            5. Application ที่ให้บริการสั่งและส่งสินค้า/บริการ
                            บนมือถือและทางเว็บไซต์ เช่น Lineman, Grab, Food
                            Panda
                            <span className="ml-3 !text-xs text-gray-400">
                              [SI5]
                            </span>
                          </Checkbox>
                        )}
                      />
                      {si5 && (
                        <div className="flex gap-5">
                          <div className="flex gap-3 items-center text-[14px]">
                            สัดส่วน
                            <Input
                              name="SI55"
                              type="number"
                              placeholder="SI55"
                              register={register}
                              className="w-28"
                              errors={errors.SI55}
                              showWord="%"
                              isNumber
                              showName
                              right
                            />
                          </div>
                          <div className="flex gap-3 items-center text-[14px]">
                            ค่าธรรมเนียม
                            <Input
                              name="F3"
                              type="number"
                              placeholder="F1"
                              register={register}
                              className="w-28"
                              errors={errors.F3}
                              showWord="%"
                              isNumber
                              showName
                              right
                            />
                          </div>
                        </div>
                      )}
                      <Controller
                        control={control}
                        name="SI6"
                        shouldUnregister
                        render={({ field: { onChange } }) => (
                          <Checkbox
                            className="start"
                            onChange={onChange}
                            ref={register("SI6").ref}
                          >
                            6. Platform สำหรับจองที่พักและการท่องเที่ยว เช่น
                            Agoda, Booking, Airbnb, Traveloka
                            <span className="ml-3 !text-xs text-gray-400">
                              [SI6]
                            </span>
                          </Checkbox>
                        )}
                      />
                      {si6 && (
                        <div className="flex gap-5">
                          <div className="flex gap-3 items-center text-[14px]">
                            สัดส่วน
                            <Input
                              name="SI66"
                              type="number"
                              placeholder="SI66"
                              register={register}
                              className="w-28"
                              errors={errors.SI66}
                              showWord="%"
                              isNumber
                              showName
                              right
                            />
                          </div>
                          <div className="flex gap-3 items-center text-[14px]">
                            ค่าธรรมเนียม
                            <Input
                              name="F4"
                              type="number"
                              placeholder="F4"
                              register={register}
                              className="w-28"
                              errors={errors.F4}
                              showWord="%"
                              isNumber
                              showName
                              right
                            />
                          </div>
                        </div>
                      )}
                      <Controller
                        control={control}
                        name="SI7"
                        shouldUnregister
                        render={({ field: { onChange } }) => (
                          <Checkbox
                            className="start"
                            onChange={onChange}
                            ref={register("SI7").ref}
                          >
                            7. อื่นๆ (ระบุ)
                            <span className="ml-3 !text-xs text-gray-400">
                              [SI7]
                            </span>
                          </Checkbox>
                        )}
                      />
                      {si7 && (
                        <>
                          <div>
                            <Input
                              name="SI8"
                              placeholder="SI8"
                              register={register}
                              className="w-60 md:w-72"
                              errors={errors.SI8}
                              showName
                            />
                          </div>
                          <div className="flex gap-5">
                            <div className="flex gap-3 items-center text-[14px]">
                              สัดส่วน
                              <Input
                                name="SI77"
                                type="number"
                                placeholder="SI77"
                                register={register}
                                className="w-28"
                                errors={errors.SI77}
                                showWord="%"
                                isNumber
                                showName
                                right
                              />
                            </div>
                            <div className="flex gap-3 items-center text-[14px]">
                              ค่าธรรมเนียม
                              <Input
                                name="F5"
                                type="number"
                                placeholder="F5"
                                register={register}
                                className="w-28"
                                errors={errors.F5}
                                showWord="%"
                                isNumber
                                showName
                                right
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <ErrorMessage>{errors?.SI7?.message}</ErrorMessage>
                  </>
                )}
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <div>
                  7. ในไตรมาสนี้
                  ยอดขาย/รายรับเปลี่ยนแปลงไปจากไตรมาสก่อนหน้านั้นหรือไม่ อย่างไร
                  <span className="ml-3 !text-xs text-gray-400">[CHG]</span>
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
                                placeholder="CIN"
                                register={register}
                                className="w-28 mt-2"
                                errors={errors.CIN}
                                showWord="%"
                                isNumber
                                showName
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
                                placeholder="CDE"
                                register={register}
                                className="w-28 mt-2"
                                errors={errors.CDE}
                                showWord="%"
                                isNumber
                                showName
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
                  <span className="ml-3 !text-xs text-gray-400">[FAC]</span>
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
                                  placeholder="FAC_1"
                                  register={register}
                                  className="w-full mt-2"
                                  errors={errors.FAC_1}
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
                  <span className="ml-3 !text-xs text-gray-400">[PRVS]</span>
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
                                placeholder="PIN"
                                register={register}
                                className="w-28 mt-2"
                                errors={errors.PIN}
                                showWord="%"
                                isNumber
                                showName
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
                                placeholder="PDE"
                                register={register}
                                className="w-28 mt-2"
                                errors={errors.PDE}
                                showWord="%"
                                isNumber
                                showName
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
                    placeholder="STO"
                    register={register}
                    className="w-60 md:w-72"
                    errors={errors.STO_temp}
                    showWord="บาท"
                    showName
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
                  placeholder="DAY"
                  register={register}
                  className="w-28"
                  errors={errors.DAY}
                  showWord="วัน"
                  showName
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP1]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP2]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP3]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP4]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP5]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP6]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP7]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP8]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP9]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP10]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP11]
                              </span>
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
                              <span className="ml-3 !text-xs text-gray-400">
                                [OP12]
                              </span>
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
              <div className="flex gap-5 items-center">
                เจ้าหน้าที่ปฏิบัติงานเก็บรวบรวมข้อมูล
                <Input
                  name="P1"
                  placeholder="P1"
                  register={register}
                  className="w-28"
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
                  className="w-28"
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
                  className="w-28"
                  errors={errors.P3}
                  showName
                />
              </div>
              <div className="flex gap-5 items-center">
                ผู้ตรวจ
                <Input
                  name="P4"
                  placeholder="P4"
                  register={register}
                  className="w-28"
                  errors={errors.P4}
                  showName
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Button type="submit" primary>
              บันทึก
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormPage;
