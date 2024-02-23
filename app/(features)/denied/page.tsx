"use client";

import Denied from "@/components/Denied";
import { useSearchParams } from "next/navigation";

const DeniedPage = () => {
  const searchParams = useSearchParams();
  const code = Number(searchParams.get("code")) || 99;

  return <Denied code={code} />;
};

export default DeniedPage;
