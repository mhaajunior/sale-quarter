"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/Button";
import Input from "@/components//Input";
import { errorHandler } from "@/helpers/errorHandler";
import { signInSchema } from "@/types/authenSchema";
import useClientSession from "@/hooks/use-client-session";

type SignInForm = z.infer<typeof signInSchema>;

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const SignInPage = (props: Props) => {
  const session = useClientSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await signIn("credentials", {
        ...data,
        redirect: true,
        callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL,
      });
    } catch (err: any) {
      errorHandler(err);
      setLoading(false);
    }
  });

  return (
    <div className="w-[450px] center ">
      <form
        className="card flex flex-col gap-8 items-center relative !px-16"
        onSubmit={onSubmit}
      >
        <div>
          <div className="text-2xl text-center text-[#09ad7f]">
            <h1>โครงการสำรวจ</h1>
            <h1>ยอดขายรายไตรมาส</h1>
          </div>
          <p className="text-md text-center">สำหรับเจ้าหน้าที่</p>
        </div>
        {props.searchParams?.error && (
          <div className="w-full text-red-500 bg-red-100 p-3 rounded-md text-sm">
            กรุณากรอกข้อมูลให้ถูกต้อง
          </div>
        )}
        <Input
          name="email"
          type="email"
          placeholder="อีเมล"
          register={register}
          errors={errors.email}
          className="w-full relative"
        />
        <Input
          name="password"
          type={visible ? "text" : "password"}
          placeholder="รหัสผ่าน"
          register={register}
          errors={errors.password}
          className="w-full relative"
          icon={visible ? <FaRegEyeSlash /> : <FaRegEye />}
          onIconClick={() => setVisible((prevState) => !prevState)}
        />
        <Button type="submit" primary className="w-full" loading={loading}>
          เข้าสู่ระบบ
        </Button>
      </form>
    </div>
  );
};

export default SignInPage;
