"use client";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Portal from "@/components/Portal";
import Title from "@/components/Title";
import useClientSession from "@/hooks/use-client-session";
import { errorHandler } from "@/lib/errorHandler";
import { AddUserForm, addUserSchema } from "@/types/schemas/addUserSchema";
import {
  addUserTitleOption,
  provinceOption,
  roleOption,
} from "@/utils/dropdownOption";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddUser = () => {
  const [loading, setLoading] = useState(false);
  const session = useClientSession();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
  });

  const onAddUser = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/admin/user", data, {
        headers: { authorization: session?.user.accessToken },
      });
      if (res.status === 200) {
        toast.success(res.data);
      }
    } catch (err: any) {
      errorHandler(err);
    } finally {
      reset();
      setLoading(false);
    }
  });

  return (
    <Portal session={session}>
      {loading && <Loading type="full" />}
      <Title title="เพิ่มผู้ใช้งาน" />
      <div className="card w-full">
        <form
          onSubmit={onAddUser}
          className="flex flex-wrap gap-10 justify-between p-5"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <label className="w-full sm:w-32">รหัสผู้ใช้</label>
            <Input
              name="username"
              placeholder="รหัสผู้ใช้"
              register={register}
              className="w-60 md:w-72"
              errors={errors.username}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <label className="w-full sm:w-32">รหัสผ่าน</label>
            <Input
              name="password"
              placeholder="รหัสผ่าน"
              register={register}
              className="w-60 md:w-72"
              errors={errors.password}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <label className="w-full sm:w-32">คำนำหน้านาม</label>
            <Dropdown
              name="title"
              placeholder="คำนำหน้านาม"
              options={addUserTitleOption}
              className="w-60 md:w-72"
              errors={errors.title}
              control={control}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <label className="w-full sm:w-32">ชื่อ</label>
            <Input
              name="name"
              placeholder="ชื่อ"
              register={register}
              className="w-60 md:w-72"
              errors={errors.name}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <label className="w-full sm:w-32">นามสกุล</label>
            <Input
              name="surname"
              placeholder="นามสกุล"
              register={register}
              className="w-60 md:w-72"
              errors={errors.surname}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <label className="w-full sm:w-32">บทบาท</label>
            <Dropdown
              name="role"
              placeholder="บทบาท"
              options={roleOption}
              className="w-60 md:w-72"
              errors={errors.role}
              control={control}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <label className="w-full sm:w-32">จังหวัด</label>
            <Dropdown
              name="province"
              placeholder="จังหวัด"
              options={provinceOption}
              className="w-60 md:w-72"
              errors={errors.province}
              control={control}
              isSearchable
            />
          </div>

          <div className="w-full flex justify-center">
            <Button type="submit" primary>
              เพิ่ม
            </Button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

export default AddUser;
