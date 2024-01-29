"use client";

import Loading from "@/components/Loading";
import OutputFormat from "@/components/SpecTable/OutputFormat";
import ResponseRate from "@/components/SpecTable/ResponseRate";
import Tabulation1 from "@/components/SpecTable/Tabulation1";
import Tabulation2 from "@/components/SpecTable/Tabulation2";
import Title from "@/components/Title";
import useClientSession from "@/hooks/use-client-session";
import { between } from "@/lib/common";
import { getThaiYear, quarterMap } from "@/lib/quarter";
import axios from "axios";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const SpecificationPage = () => {
  const searchParams = useSearchParams();
  const yr = Number(searchParams.get("yr"));
  const qtr = Number(searchParams.get("qtr"));
  const [selectedTable, setSelectedTable] = useState<specTable | null>(null);
  const session = useClientSession();
  const router = useRouter();

  interface specTable {
    id: number;
    title: string;
    render: React.ReactNode;
  }

  const data = {
    year: yr,
    quarter: qtr,
    province: session?.user.province,
  };

  const specTables = [
    {
      id: 1,
      title: "Tabulation Specification ตาราง ก",
      render: <Tabulation1 />,
    },
    {
      id: 2,
      title: "Tabulation Specification ตาราง ข ",
      render: <Tabulation2 />,
    },
    {
      id: 3,
      title: "Output Format Specification",
      render: <OutputFormat data={data} />,
    },
    {
      id: 4,
      title: "Response Rate Specification",
      render: <ResponseRate />,
    },
  ];

  useEffect(() => {
    if (!qtr || !between(qtr, 1, 4) || !yr) {
      router.push("/notfound");
      return;
    }

    const res = quarterMap(Number("25" + yr) - 543);
    const startDate = moment(res[qtr - 1].formSubmittedRange[0]);
    const now = moment();

    if (now < startDate) {
      router.push("/denied?code=1");
      return;
    }

    if (yr > getThaiYear(new Date().getFullYear()).yearSlice) {
      router.push("/denied?code=1");
      return;
    }
  }, []);

  const onTableChosen = (table: specTable) => {
    if (selectedTable?.id !== table.id) {
      setSelectedTable(table);
    }
  };

  return (
    <>
      <div className="mb-10 flex flex-col gap-3">
        <Title title="Specification Table"></Title>
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
