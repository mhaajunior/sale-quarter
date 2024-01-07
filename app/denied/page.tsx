"use client";

import Button from "@/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { FaUserLock } from "react-icons/fa";

const DeniedPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = Number(searchParams.get("code")) || 99;
  console.log(code);

  const renderedMessage = () => {
    let message = "";
    switch (code) {
      case 1:
        message = "หน้านี้ยังไม่เปิดให้เยี่ยมชมในช่วงเวลานี้";
        return <span className="text-xl">{message}</span>;
      case 2:
        message = "คุณต้องส่งข้อมูลในไตรมาสก่อนหน้านี้ก่อน";
        return <span className="text-xl">{message}</span>;
      default:
        message = "คุณไม่มีสิทธิที่จะเยี่ยมชมหน้านี้";
        return <span className="text-xl">{message}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-5 font-bold justify-center items-center">
      <FaUserLock className="text-[200px]" />
      {renderedMessage()}
      <Button
        className="m-auto p-5"
        primary
        onClick={() => router.push("/search")}
      >
        กลับไปหน้าค้นหา
      </Button>
    </div>
  );
};

export default DeniedPage;
