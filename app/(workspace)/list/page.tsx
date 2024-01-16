"use client";

import Badge from "@/components/Badge";
import Title from "@/components/Title";
import { errorHandler } from "@/helpers/errorHandler";
import useClientSession from "@/hooks/use-client-session";
import { ReportStatus } from "@/types/dto/report";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Loading from "@/components/Loading";

interface QuarterArr {
  label: string;
  value: number;
  color: string;
}

interface DataType {
  key: React.Key;
  id: number;
  company: boolean;
  p1: boolean;
  p2: boolean;
  p3: boolean;
  p4: boolean;
  action: { data: any; canEdit: boolean };
}

const ListPage = () => {
  const [quarter, setQuarter] = useState(1);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ReportStatus[]>([]);
  const session = useClientSession();

  useEffect(() => {
    if (session) {
      fetchCompanyStatus();
    }
  }, [quarter, session]);

  const quarterArr: QuarterArr[] = [];
  for (let i = 1; i <= 4; i++) {
    quarterArr.push({ label: "ไตรมาสที่ " + i, value: i, color: "grey" });
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      width: "10%",
      align: "center",
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: "เลขที่สถานประกอบการ",
      dataIndex: "id",
      key: "id",
      width: "20%",
      align: "center",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "สถานะการส่งแบบฟอร์ม",
      children: [
        {
          title: "สถานประกอบการ",
          dataIndex: "company",
          key: "company",
          width: "10%",
          align: "center",
          render: (_, { company }) => (
            <div className="flex justify-center items-center">
              {company ? (
                <FaCheckCircle className="text-green-500 text-xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-xl" />
              )}
            </div>
          ),
        },
        {
          title: "เจ้าหน้าที่ปฏิบัติงานเก็บรวบรวมข้อมูล",
          dataIndex: "p1",
          key: "p1",
          width: "10%",
          align: "center",
          render: (_, { p1 }) => (
            <div className="flex justify-center items-center">
              {p1 ? (
                <FaCheckCircle className="text-green-500 text-xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-xl" />
              )}
            </div>
          ),
        },
        {
          title: "เจ้าหน้าที่บรรณาธิกรและลงรหัส",
          dataIndex: "p2",
          key: "p2",
          width: "10%",
          align: "center",
          render: (_, { p2 }) => (
            <div className="flex justify-center items-center">
              {p2 ? (
                <FaCheckCircle className="text-green-500 text-xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-xl" />
              )}
            </div>
          ),
        },
        {
          title: "เจ้าหน้าที่บันทึกข้อมูล",
          dataIndex: "p3",
          key: "p3",
          width: "10%",
          align: "center",
          render: (_, { p3 }) => (
            <div className="flex justify-center items-center">
              {p3 ? (
                <FaCheckCircle className="text-green-500 text-xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-xl" />
              )}
            </div>
          ),
        },
        {
          title: "ผู้ตรวจ",
          dataIndex: "p4",
          key: "p4",
          width: "10%",
          align: "center",
          render: (_, { p4 }) => (
            <div className="flex justify-center items-center">
              {p4 ? (
                <FaCheckCircle className="text-green-500 text-xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-xl" />
              )}
            </div>
          ),
        },
      ],
    },
    {
      title: "ตรวจสอบ",
      dataIndex: "action",
      key: "action",
      width: "20%",
      align: "center",
      render: (_, { action }) => (
        <div className="flex justify-center items-center">
          {action.canEdit ? (
            <Link
              href={`/search/${action.data.ID}?yr=${action.data.year}&qtr=${quarter}&mode=edit`}
            >
              <Button primary>ตรวจสอบ</Button>
            </Link>
          ) : (
            <p className="px-5">เจ้าหน้าที่ทุกคนต้องส่งแบบฟอร์มก่อน</p>
          )}
        </div>
      ),
    },
  ];

  const fetchCompanyStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/report_status", {
        method: "GET",
        params: {
          quarter,
          province: session?.user.province,
          year: 67,
        },
        headers: { accessToken: session?.user.accessToken },
      });

      if (res.status === 200) {
        setResponse(res.data);
      }
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
  };

  const data: DataType[] = [];
  response.forEach(function (value, i) {
    const status: DataType = {
      key: i,
      id: Number(value.ID),
      company: false,
      p1: false,
      p2: false,
      p3: false,
      p4: false,
      action: { data: value, canEdit: false },
    };
    let isSend = false;
    switch (quarter) {
      case 1:
        isSend = value.isSendQtr1;
        break;
      case 2:
        isSend = value.isSendQtr2;
        break;
      case 3:
        isSend = value.isSendQtr3;
        break;
      case 4:
        isSend = value.isSendQtr4;
        break;
      default:
        break;
    }

    if (isSend && value.report[0]) {
      status.company = true;
      status.p1 = !!value.report[0].P1;
      status.p2 = !!value.report[0].P2;
      status.p3 = !!value.report[0].P3;
      status.p4 = !!value.report[0].P4;

      if (status.company && status.p1 && status.p2 && status.p3) {
        status.action.canEdit = true;
      }
    }
    data.push(status);
  });

  return (
    <>
      <div className="mb-10 flex flex-col gap-3">
        <Title title="ตรวจสอบสถานประกอบการ"></Title>
      </div>
      <div className="card flex flex-col gap-5">
        <h1>
          ตารางแสดงสถานะการส่งแบบฟอร์มของสถานประกอบการทั้งหมดในขอบเขตจังหวัดที่รับผิดชอบ
        </h1>

        <div className="flex flex-wrap">
          {quarterArr.map((item) => (
            <Badge
              key={item.value}
              color={item.color}
              onClick={() => setQuarter(item.value)}
              active={item.value === quarter}
            >
              {item.label}
            </Badge>
          ))}
          <div className="w-full min-h-40 flex items-center">
            {loading ? (
              <Loading type="partial" />
            ) : (
              <Table
                columns={columns}
                dataSource={data}
                bordered
                size="middle"
                scroll={{ x: "calc(700px + 50%)" }}
                showSorterTooltip={false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListPage;
