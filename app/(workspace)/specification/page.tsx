"use client";

import OutputFormat from "@/components/SpecTable/OutputFormat";
import ResponseRate from "@/components/SpecTable/ResponseRate";
import Tabulation1 from "@/components/SpecTable/Tabulation1";
import Tabulation2 from "@/components/SpecTable/Tabulation2";
import Title from "@/components/Title";
import { FilterContext } from "@/context";
import useClientSession from "@/hooks/use-client-session";
import React, { useContext, useState } from "react";

const SpecificationPage = () => {
  const { year, quarter } = useContext(FilterContext);
  const [selectedTable, setSelectedTable] = useState<specTable | null>(null);
  const session = useClientSession();

  interface specTable {
    id: number;
    title: string;
    render: React.ReactNode;
  }

  const data = {
    year,
    quarter,
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
