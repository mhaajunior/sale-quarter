"use client";

import Badge from "@/components/Badge";
import Title from "@/components/Title";
import { errorHandler } from "@/lib/errorHandler";
import useClientSession from "@/hooks/use-client-session";
import { ReportStatus } from "@/types/dto/report";
import { Table } from "antd";
import { ColumnsType, TableProps } from "antd/es/table";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import moment from "moment";
import { getThaiYear, quarterMap } from "@/lib/quarter";
import Dropdown from "@/components/Dropdown";
import { between, numberWithCommas } from "@/lib/common";
import { yearOptions } from "@/utils/dropdownOption";
import { QuarterArr } from "@/types/dto/common";
import { useRouter, useSearchParams } from "next/navigation";
import { Role } from "@prisma/client";
import { IoChevronBack } from "react-icons/io5";
import PageControl from "@/components/PageControl";

interface DataType {
  key: React.Key;
  id: string;
  company: boolean;
  p1: boolean;
  p2: boolean;
  p3: boolean;
  p4: boolean;
  action: { data: any; canEdit: boolean };
}

interface Response {
  reportStatus: ReportStatus[];
  notApproveCount: number;
}

const ApprovePage = () => {
  const searchParams = useSearchParams();
  const yr = Number(searchParams.get("yr"));
  const qtr = Number(searchParams.get("qtr"));
  const proviceId = searchParams.get("id");
  const proviceName = searchParams.get("nm");
  const [quarter, setQuarter] = useState(qtr || 1);
  const [year, setYear] = useState(
    yr || getThaiYear(new Date().getFullYear()).yearSlice
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response>({
    reportStatus: [],
    notApproveCount: 0,
  });
  const [mode, setMode] = useState(1);
  const router = useRouter();
  const session = useClientSession();

  useEffect(() => {
    if (session) {
      if (session.user.role === Role.SUBJECT) {
        if (!qtr || !between(qtr, 1, 4) || !proviceId || !yr || !proviceName) {
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
      } else if (session.user.role === Role.SUPERVISOR) {
        if (qtr || yr || proviceId || proviceName) {
          router.push("/notfound");
          return;
        }
      }

      fetchCompanyStatus();
    }
  }, [session, quarter, mode, year]);

  const quarterArr: QuarterArr[] = [];
  for (let i = 1; i <= 4; i++) {
    let passOpenDate = false;
    const res = quarterMap(Number("25" + year) - 543);
    const startDate = moment(res[i - 1].formSubmittedRange[0]);
    const now = moment();

    if (now >= startDate) {
      passOpenDate = true;
    }
    quarterArr.push({
      label: "ไตรมาสที่ " + i,
      value: i,
      color: "black",
      passOpenDate,
    });
  }

  let data: DataType[] = [];
  const filters: { text: string; value: string }[] = [];

  response.reportStatus.forEach(function (value, i) {
    filters.push({ text: value.ID, value: value.ID });
    const status: DataType = {
      key: i,
      id: value.ID,
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
      filters: filters,
      filterSearch: true,
      onFilter: (value: any, record: DataType) => record.id === value,
    },
    {
      title: "สถานะการส่ง/อนุมัติแบบฟอร์ม",
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
              href={`/search/${action.data.ID}?yr=${
                action.data.year
              }&qtr=${quarter}&mode=edit${
                session?.user.role === Role.SUBJECT
                  ? `&id=${proviceId}&nm=${proviceName}`
                  : ""
              }`}
            >
              <Button primary>ตรวจสอบ</Button>
            </Link>
          ) : (
            <p className="px-5">เจ้าหน้าที่ทุกคนต้องส่ง/อนุมัติแบบฟอร์มก่อน</p>
          )}
        </div>
      ),
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  const fetchCompanyStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/report_status", {
        method: "GET",
        params: {
          quarter,
          province: proviceId || session?.user.province,
          year,
          mode,
        },
        headers: { authorization: session?.user.accessToken },
      });

      if (res.status === 200) {
        setResponse(res.data);
      }
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
  };

  const approveOptions = [
    { label: "ทั้งหมด", value: 1 },
    { label: "ยังไม่อนุมัติ", value: 2 },
  ];

  return (
    <>
      <div className="mb-10 flex flex-col gap-3">
        <Title
          title={`อนุมัติสถานประกอบการ${
            proviceName ? "จังหวัด" + proviceName : ""
          }`}
        >
          {session?.user.role === Role.SUBJECT && (
            <Button secondary onClick={() => router.push("/list")}>
              <IoChevronBack className="mr-1" />
              กลับ
            </Button>
          )}
        </Title>
      </div>
      <div className="card flex flex-col gap-5">
        <div className="md:flex justify-between items-center w-full">
          <h1 className="mb-3 md:mb-0">
            ตารางแสดงสถานะการส่ง/อนุมัติแบบฟอร์มของแต่ละสถานประกอบการในขอบเขตจังหวัดที่รับผิดชอบ
          </h1>
          <div className="flex items-center gap-3">
            <label>ปีที่ค้นหา</label>
            <Dropdown
              name="year"
              placeholder="ปี"
              options={yearOptions}
              className="w-36"
              isControl={false}
              setterFn={(year: number) => setYear(year)}
              defaultValue={year}
            />
          </div>
        </div>
        <div className="md:flex justify-between items-center w-full">
          <div className="text-red-500 mb-3 md:mb-0">
            จำนวนแบบฟอร์มที่ยังไม่อนุมัติ:{" "}
            {numberWithCommas(response.notApproveCount) || 0}
          </div>
          <div className="flex items-center gap-3">
            <label>สถานะอนุมัติ</label>
            <Dropdown
              name="approve"
              placeholder="ค้นหา"
              options={approveOptions}
              className="w-36"
              isControl={false}
              setterFn={(val: number) => setMode(val)}
              defaultValue={mode}
            />
          </div>
        </div>
        <div className="flex flex-wrap">
          {quarterArr.map((item) => (
            <Badge
              key={item.value}
              color={item.color}
              onClick={() => item.passOpenDate && setQuarter(item.value)}
              active={item.value === quarter}
              disabled={!item.passOpenDate}
            >
              {item.label}
            </Badge>
          ))}
          <div className="w-full min-h-40 flex flex-col gap-3 items-center">
            {loading ? (
              <Loading type="partial" />
            ) : (
              <>
                <Table
                  columns={columns}
                  dataSource={data}
                  onChange={onChange}
                  bordered
                  size="middle"
                  scroll={{ x: "calc(700px + 50%)" }}
                  showSorterTooltip={false}
                  pagination={{
                    defaultPageSize: 100,
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApprovePage;
