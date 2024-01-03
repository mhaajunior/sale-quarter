"use client";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import ErrorMessage from "@/components/ErrorMessage";
import Input from "@/components/Input";
import Title from "@/components/Title";
import {
  currencyToNumber,
  numberWithCommas,
  removeNonNumeric,
} from "@/helpers/common";
import { calcQuarter, getQuarterDate, thaiYear } from "@/helpers/quarter";
import {
  consistencyCheck1,
  consistencyCheck2,
  validateFormData,
} from "@/helpers/validate";
import { ReportForm, createReportSchema } from "@/types/validationSchemas";
import typeOption from "@/utils/typeOption";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Radio, Space } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import _ from "lodash";

const quarter = getQuarterDate();

interface FormErrors {
  label: string;
  message: string;
}

const FormPage = () => {
  const [formErrors, setFormErrors] = useState<FormErrors[]>([]);

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
      R1_temp: "",
      R2_temp: "",
      R3_temp: "",
      LG1_temp: "1",
      TYPE: 0,
      REG: 1,
      CWT: 12,
      AMP: 4,
      TAM: 23,
      MUN: 1,
      EA: 23,
      VIL: 23,
      TSIC_R: 47114,
      TSIC_L: 47114,
      SIZE_R: 2,
      SIZE_L: 2,
      NO: 32,
      QTR: calcQuarter(),
      YR: Number(thaiYear.toString().slice(2)),
      ENU: 1,
    },
  });

  const r1 = watch("R1_temp");
  const r2 = watch("R2_temp");
  const r3 = watch("R3_temp");
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
  const type = watch("TYPE");
  const sto = watch("STO_temp");
  const enu = watch("ENU");

  useEffect(() => {
    const R1 = currencyToNumber(r1 as string);
    const R2 = currencyToNumber(r2 as string);
    const R3 = currencyToNumber(r3 as string);
    if (R1 || R2 || R3) {
      if (R1)
        setValue("R1_temp", numberWithCommas(removeNonNumeric(r1 as string)));
      if (R2)
        setValue("R2_temp", numberWithCommas(removeNonNumeric(r2 as string)));
      if (R3)
        setValue("R3_temp", numberWithCommas(removeNonNumeric(r3 as string)));
      setValue("TR", R1 + R2 + R3);
    } else {
      setValue("TR", null);
    }
  }, [r1, r2, r3]);

  useEffect(() => {
    if (sto)
      setValue("STO_temp", numberWithCommas(removeNonNumeric(sto as string)));
  }, [sto]);

  const onSubmit = handleSubmit(async (data) => {
    const result = validateFormData(data);
    let err;
    if (data.ENU === 1) {
      err = consistencyCheck1(result);
    } else {
      console.log("hi1");
      err = consistencyCheck2(result);
    }
    if (!_.isEmpty(err)) {
      const errArr = [];
      for (const [key, value] of Object.entries(err)) {
        errArr.push({ label: key, message: value as string });
      }
      setFormErrors(errArr);
      toast.error("ตรวจพบข้อมูลที่ไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง");
      window.scrollTo(0, 0);
      return;
    } else {
      setFormErrors([]);
      toast.success("ส่งข้อมูลสำเร็จ");
    }
  });

  const renderErrors = () => {
    return formErrors.map((err) => (
      <div className="text-red-500 flex items-center gap-3 mb-2 last:mb-0">
        <div className="border border-red-500 p-2 rounded font-bold text-xs text-white bg-red-500">
          {err.label}
        </div>
        <p>{err.message}</p>
      </div>
    ));
  };

  console.log(formErrors);

  return (
    <>
      <div className="mb-10 flex flex-col gap-3">
        <Title>แบบฟอร์มสำรวจยอดขายรายไตรมาส พ.ศ. {thaiYear}</Title>
        <div className="text-xl">
          ไตรมาส {calcQuarter()} ({quarter.monthRange[0]} -{" "}
          {quarter.monthRange[2]} {thaiYear.toString().slice(2)})
        </div>
      </div>
      <div className="card">
        <form
          className="flex flex-wrap gap-10 justify-center"
          onSubmit={onSubmit}
        >
          {formErrors.length > 0 && (
            <div className="card w-full border error !bg-red-100">
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
                />
              </div>
            </div>
          </div>

          <div className="card w-full flex flex-wrap gap-5">
            <div className="w-full">1. ข้อมูลสถานประกอบการ</div>
            <div className="flex items-center gap-5">
              <label>
                คำนำหน้านาม<span className="text-red-500">*</span>
              </label>
              <Input
                name="TITLE"
                placeholder="TITLE"
                register={register}
                className="w-24"
                errors={errors.TITLE}
                showName
              />
            </div>
            <div className="flex flex-wrap gap-5">
              <div className="flex items-center gap-5">
                <label>
                  ชื่อเจ้าของ/หัวหน้าครัวเรือน
                  <span className="text-red-500">*</span>
                </label>
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
                <label>
                  นามสกุล<span className="text-red-500">*</span>
                </label>
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
              <label>
                ชื่อสถานประกอบการ<span className="text-red-500">*</span>
              </label>
              <Input
                name="TRADEMARK"
                placeholder="TRADEMARK"
                register={register}
                className="w-60 md:w-72"
                errors={errors.TRADEMARK}
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
              <label>หมู่ที่</label>
              {
                <div>
                  {getValues("VIL")}
                  <span className="ml-3">(ค่าเดียวกันกับ VIL)</span>
                </div>
              }
            </div>
            <div className="flex items-center gap-5">
              <label>ตรอก/ซอย</label>
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
              <label>ตำบล/แขวง</label>
              <Input
                name="TAMBOL"
                placeholder="TAMBOL"
                register={register}
                className="w-60 md:w-72"
                errors={errors.TAMBOL}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>อำเภอ/เขต</label>
              <Input
                name="AMPHOR"
                placeholder="AMPHOR"
                register={register}
                className="w-60 md:w-72"
                errors={errors.AMPHOR}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>รหัสไปรษณีย์</label>
              <Input
                name="POST_CODE"
                placeholder="POST_CODE"
                register={register}
                className="w-28"
                errors={errors.POST_CODE}
                showName
              />
            </div>
            <div className="flex items-center gap-5">
              <label>โทรศัพท์</label>
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
              <label>โทรสาร</label>
              <Input
                name="FAX_NO"
                placeholder="FAX_NO"
                register={register}
                className="w-36"
                errors={errors.FAX_NO}
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
            <div className="flex items-center gap-5 w-full">
              <label>
                รายละเอียดประเภทกิจการ<span className="text-red-500">*</span>
              </label>
              <Input
                name="DES_TYPE"
                placeholder="DES_TYPE"
                register={register}
                className="w-60 md:w-72"
                errors={errors.DES_TYPE}
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
                          <Radio value={1}>
                            1. ส่วนบุคคล ห้างหุ้นส่วนสามัญที่ไม่เป็นนิติบุคคล
                            {value === 1 && (
                              <div className="my-1 flex flex-col gap-2">
                                <Controller
                                  control={control}
                                  name="LG1_temp"
                                  shouldUnregister
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
                          <Radio value={2}>
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
                          <Radio value={3}>
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
                          <Radio value={4}>4. ส่วนราชการ รัฐวิสาหกิจ</Radio>
                          <Radio value={5}>5. สหกรณ์</Radio>
                          <Radio value={6}>
                            6. อื่นๆ (ระบุ)
                            {value === 6 && (
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
                <p>
                  ถ้าประกอบธุรกิจมากกว่า 1 ประเภท
                  โปรดระบุประเภทกิจการและชนิดของสินค้า/บริการที่มีรายรับสูงสุด
                </p>
                <Dropdown
                  name="TYPE"
                  placeholder="TYPE"
                  options={typeOption}
                  className="w-60 md:w-80"
                  errors={errors.TYPE}
                  control={control}
                  showName
                />
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <div>4. ยอดขายหรือรายรับของสถานประกอบการ</div>
                <p>
                  บันทึกยอดขายหรือรายรับจากการขายสินค้า/บริการ
                  แต่ละเดือนเป็นจำนวนเต็ม (บาท)
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <p>เดือน {quarter.monthRange[0]}</p>
                    <Input
                      name="R1_temp"
                      placeholder="R1"
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.R1_temp}
                      showWord="บาท"
                      showName
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p>เดือน {quarter.monthRange[1]}</p>
                    <Input
                      name="R2_temp"
                      placeholder="R2"
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.R2_temp}
                      showWord="บาท"
                      showName
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p>เดือน {quarter.monthRange[2]}</p>
                    <Input
                      name="R3_temp"
                      placeholder="R3"
                      register={register}
                      className="w-60 md:w-72"
                      errors={errors.R3_temp}
                      showWord="บาท"
                      showName
                    />
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <p>รวม 3 เดือน</p>
                    <div>{tr ? numberWithCommas(tr) : 0} บาท</div>
                  </div>
                </div>
              </div>

              <div className="card w-500 flex flex-col gap-3">
                <div>
                  5. ในไตรมาสนี้ มีการขายสินค้าหรือบริการทางอินเทอร์เน็ตหรือไม่
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
                        5.1
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
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="text-[15px]">
                        5.2
                        สัดส่วนของช่องทางการขายสินค้า/บริการที่ขายผ่านทางอินเทอร์เน็ตต่อยอดขายผ่านทางอินเทอร์เน็ตทั้งหมด
                      </div>
                      <Controller
                        control={control}
                        name="SI1"
                        shouldUnregister
                        render={({ field: { onChange } }) => (
                          <Checkbox
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
                          />
                        </div>
                      )}
                      <Controller
                        control={control}
                        name="SI2"
                        shouldUnregister
                        render={({ field: { onChange } }) => (
                          <Checkbox
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
                          />
                        </div>
                      )}
                      <Controller
                        control={control}
                        name="SI3"
                        shouldUnregister
                        render={({ field: { onChange } }) => (
                          <Checkbox
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
                  6. ในไตรมาสนี้
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
                          <Radio value={1}>1. ไม่เปลี่ยนแปลง</Radio>
                          <Radio value={2}>
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
                              />
                            )}
                          </Radio>
                          <Radio value={3}>
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

              {chg && chg !== 1 && (
                <div className="card w-500 flex flex-col gap-3">
                  <div>
                    7. ถ้ายอดขาย/รายรับสูงขึ้นหรือลดลง
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
                        >
                          <div className="flex">
                            <Space direction="vertical" className="w-2/4">
                              <Radio value={1}>1. ฤดูกาล เทศกาล</Radio>
                              <Radio value={2}>2. กำลังซื้อของลูกค้า</Radio>
                              <Radio value={3}>3. ต้นทุน/ราคาสินค้า</Radio>
                              <Radio value={4}>4. คู่แข่งทางการค้า</Radio>
                              <Radio value={5}>5. การปรับปรุงกิจการ</Radio>
                            </Space>
                            <Space direction="vertical">
                              <Radio value={6}>6. ภาวะเศรษฐกิจ</Radio>
                              <Radio value={7}>7. นโยบายภาครัฐ</Radio>
                              <Radio value={8}>8. เทคโนโลยี</Radio>
                              <Radio value={9}>9. โรคระบาด เช่น โควิด-19</Radio>
                              <Radio value={10}>
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
              )}

              <div className="card w-500 flex flex-col gap-3">
                <div>
                  8. ในไตรมาสนี้
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
                          <Radio value={1}>1. ไม่เปลี่ยนแปลง</Radio>
                          <Radio value={2}>
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
                              />
                            )}
                          </Radio>
                          <Radio value={3}>
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
                <div>9. จำนวนคนทำงานตามปกติของสถานประกอบการในไตรมาสนี้</div>
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
                />
              </div>

              {type === 1 && (
                <div className="card w-500 flex flex-col gap-3">
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
                    isNumber
                    showName
                  />
                </div>
              )}
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
