"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { LuFileQuestion } from "react-icons/lu";

const NotfoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 font-bold justify-center items-center">
      <LuFileQuestion className="text-[200px]" />
      <span className="text-xl">ไม่พบหน้าที่คุณต้องการจะเยี่ยมชม</span>
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

export default NotfoundPage;
