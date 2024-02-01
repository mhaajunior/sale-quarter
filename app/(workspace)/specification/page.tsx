"use client";

import Button from "@/components/Button";
import OutputFormat from "@/components/SpecTable/OutputFormat";
import ResponseRate from "@/components/SpecTable/ResponseRate";
import Tabulation1 from "@/components/SpecTable/Tabulation1";
import Tabulation2 from "@/components/SpecTable/Tabulation2";
import Title from "@/components/Title";
import { FilterContext } from "@/context";
import useClientSession from "@/hooks/use-client-session";
import { Role } from "@/types/dto/role";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";

const SpecificationPage = () => {
  const { year, quarter } = useContext(FilterContext);
  const searchParams = useSearchParams();
  const pvid = Number(searchParams.get("pvid")) || null;
  const [proviceId, setProvinceId] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState<specTable | null>(null);
  const session = useClientSession();
  const router = useRouter();

  interface specTable {
    id: number;
    title: string;
    render: React.ReactNode;
  }

  useEffect(() => {
    if (session) {
      console.log();
      if (session.user.role === Role.SUPERVISOR) {
        if (pvid) {
          router.push("/denied?code=3");
          return;
        }
        setProvinceId(session.user.province);
      } else if (session.user.role === Role.SUBJECT) {
        if (!pvid) {
          router.push("/notfound");
          return;
        }
        setProvinceId(pvid);
      }
    }
  }, [session]);

  const data = {
    year,
    quarter,
    province: proviceId,
  };

  const specTables = [
    {
      id: 1,
      title: "ตาราง ก",
      render: <Tabulation1 data={data} />,
    },
    {
      id: 2,
      title: "ตาราง ข ",
      render: <Tabulation2 />,
    },
    {
      id: 3,
      title: "บัญชีรายชื่อสถานประกอบการตัวอย่าง",
      render: <OutputFormat data={data} />,
    },
    {
      id: 4,
      title: "อัตราการตอบกลับของข้อมูล",
      render: <ResponseRate data={data} />,
    },
  ];

  const onTableChosen = (table: specTable) => {
    if (selectedTable?.id !== table.id) {
      setSelectedTable(table);
    }
  };

  const onClickBack = () => {
    if (session?.user.role === Role.SUPERVISOR) {
      router.push(`/approve?pvid=${proviceId}`);
    } else if (session?.user.role === Role.SUBJECT) {
      router.push("/list");
    }
  };

  return (
    <>
      <div className="mb-10 flex flex-col gap-3">
        <Title title="Specification Table">
          <Button secondary onClick={onClickBack}>
            <IoChevronBack className="mr-1" />
            กลับ
          </Button>
        </Title>
      </div>
      <div className="card flex flex-col gap-5">
        <div className="flex flex-wrap gap-5 justify-between">
          {specTables.map((table) => (
            <div
              key={table.id}
              className={`click-box ${
                selectedTable?.id === table.id ? "box-active" : ""
              }`}
              onClick={() => onTableChosen(table)}
            >
              {table.title}
            </div>
          ))}
        </div>
        {selectedTable?.render}
      </div>
    </>
  );
};

export default SpecificationPage;
