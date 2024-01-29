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
import { errorHandler } from "@/lib/errorHandler";
import { signInSchema } from "@/types/schemas/authenSchema";
import useClientSession from "@/hooks/use-client-session";
import Image from "next/image";
import city from "@/public/city.svg";
import wave from "@/public/wave.png";
import logo from "@/public/nso-logo.png";
import useWindowSize from "@/hooks/use-window-size";

type SignInForm = z.infer<typeof signInSchema>;

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const SignInPage = (props: Props) => {
  const session = useClientSession();
  const router = useRouter();
  const size = useWindowSize();
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
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="w-full flex">
      <div className="w-2/4 relative min-h-screen">
        <div className="absolute bottom-0 left-0">
          <Image src={wave} alt="bottom wave" width={600} />
        </div>
        <div className="center w-full">
          <Image src={city} alt="city background" priority />
        </div>
      </div>
      <div
        className={`w-2/4 flex flex-col gap-5 items-center justify-center ${
          size.width && size.width <= 768 ? "center" : ""
        }`}
      >
        <div className="py-5 flex flex-col gap-5 bg-white rounded-xl bg-opacity-50">
          <div className="mx-auto">
            <Image src={logo} alt="nso logo" width={200} priority />
          </div>
          <form
            className="w-[300px] md:w-[500px] flex flex-col gap-8 items-center relative !px-5 md:!px-16"
            onSubmit={onSubmit}
          >
            <div>
              <div className="text-3xl text-center text-[#09ad7f]">
                <h1>โครงการสำรวจ</h1>
                <h1>ยอดขายรายไตรมาส</h1>
              </div>
            </div>
            {props.searchParams?.error && (
              <div className="w-60 md:w-72 text-red-500 bg-red-100 p-3 rounded-md text-sm">
                กรุณากรอกข้อมูลให้ถูกต้อง
              </div>
            )}
            <Input
              name="username"
              placeholder="ชื่อผู้ใช้"
              register={register}
              errors={errors.username}
              className="w-60 md:w-72"
            />
            <Input
              name="password"
              type={visible ? "text" : "password"}
              placeholder="รหัสผ่าน"
              register={register}
              errors={errors.password}
              className="w-60 md:w-72"
              icon={visible ? <FaRegEyeSlash /> : <FaRegEye />}
              onIconClick={() => setVisible((prevState) => !prevState)}
            />
            <div>
              <Button
                type="submit"
                primary
                className="w-60 md:w-72"
                loading={loading}
              >
                เข้าสู่ระบบ
              </Button>
              <p className="text-center">
                <span
                  className="cursor-pointer hover:text-black"
                  onClick={() => router.push("/")}
                >
                  กลับไปหน้าแรก
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
