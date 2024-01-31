"use client";

import Badge from "@/components/Badge";
import Title from "@/components/Title";
import { errorHandler } from "@/lib/errorHandler";
import useClientSession from "@/hooks/use-client-session";
import { ReportStatus } from "@/types/dto/report";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import moment from "moment";
import { quarterMap } from "@/lib/quarter";
import Dropdown from "@/components/Dropdown";
import { numberWithCommas } from "@/lib/common";
import { yearOptions } from "@/utils/dropdownOption";
import { QuarterArr } from "@/types/dto/common";
import { useRouter, useSearchParams } from "next/navigation";
import { Role } from "@/types/dto/role";
import { IoChevronBack, IoCloudDownloadOutline } from "react-icons/io5";
import { CSVLink } from "react-csv";
import Input from "@/components/Input";
import { FilterContext } from "@/context";
import PageControl from "@/components/PageControl";
import useDebounce from "@/hooks/use-debounce";

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
  totalCount: number;
}

const ApprovePage = () => {
  const { year, quarter, setYear, setQuarter } = useContext(FilterContext);
  const searchParams = useSearchParams();
  const proviceId = Number(searchParams.get("pvid"));
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DataType[]>([]);
  const [notApproveCount, setNotApproveCount] = useState(0);
  const [csvData, setCsvData] = useState([]);
  const [option, setOption] = useState(1);
  const [provinceName, setProvinceName] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue);
  const router = useRouter();
  const session = useClientSession();
  const perPage = 100;

  useEffect(() => {
    if (session) {
      if (!proviceId) {
        router.push("/notfound");
        return;
      }
      fetchCompanyStatus();
    }
  }, [session, page, debouncedSearchValue, option]);

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

  const columns: ColumnsType<DataType> = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      width: "10%",
      align: "center",
    },
    {
      title: "เลขประจำสถานประกอบการ",
      dataIndex: "id",
      key: "id",
      width: "20%",
      align: "center",
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
      fixed: "right",
      render: (_, { action }) => (
        <div className="flex justify-center items-center">
          {action.canEdit ? (
            <Link
              href={`/search/${action.data.ID}?yr=${
                action.data.year
              }&qtr=${quarter}&mode=edit${
                session?.user.role === Role.SUBJECT ? `&pvid=${proviceId}` : ""
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

  const fetchCompanyStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/report_status", {
        params: {
          quarter,
          province: proviceId,
          year,
          page,
          perPage,
          option,
          searchId: debouncedSearchValue,
        },
        headers: { authorization: session?.user.accessToken },
      });

      if (res.status === 200) {
        const result: Response = res.data;
        setNotApproveCount(result.notApproveCount);
        setTotalCount(result.totalCount);
        let data: DataType[] = [];
        if (result.reportStatus.length > 0) {
          setProvinceName(result.reportStatus[0].province_name);
          result.reportStatus.forEach(function (
            value: ReportStatus,
            i: number
          ) {
            const status: DataType = {
              key: (page - 1) * perPage + i + 1,
              id: value.ID,
              company: false,
              p1: false,
              p2: false,
              p3: false,
              p4: false,
              action: { data: value, canEdit: false },
            };
            let isSend = false;
            let isApprove = false;
            switch (quarter) {
              case 1:
                isSend = value.isSendQtr1;
                isApprove = value.isApproveQtr1;
                break;
              case 2:
                isSend = value.isSendQtr2;
                isApprove = value.isApproveQtr2;
                break;
              case 3:
                isSend = value.isSendQtr3;
                isApprove = value.isApproveQtr3;
                break;
              case 4:
                isSend = value.isSendQtr4;
                isApprove = value.isApproveQtr4;
                break;
              default:
                break;
            }

            if (isSend && value.report[0]) {
              status.company = true;
              status.p1 = !!value.report[0].P1;
              status.p2 = !!value.report[0].P2;
              status.p3 = !!value.report[0].P3;
              status.p4 = isApprove;

              if (status.company && status.p1 && status.p2 && status.p3) {
                status.action.canEdit = true;
              }

              if (session?.user.role === Role.SUBJECT) {
                status.action.canEdit = true;
              }
            }
            data.push(status);
          });
        }
        setResponse(data);
        if (
          session?.user.role === Role.SUBJECT &&
          result.notApproveCount === 0
        ) {
          downloadData();
        }
      }
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadData = async () => {
    try {
      const res = await axios.get("/api/report", {
        params: {
          quarter,
          province: proviceId,
          year,
        },
        headers: { authorization: session?.user.accessToken },
      });

      if (res.status === 200) {
        setCsvData(res.data);
      }
    } catch (err: any) {
      errorHandler(err);
    }
  };

  const approveOptions = [
    { label: "ทั้งหมด", value: 1 },
    { label: "ยังไม่อนุมัติ", value: 2 },
  ];

  return (
    <>
      <div className="mb-10 flex flex-col gap-3">
        <Title title={`อนุมัติสถานประกอบการจังหวัด${provinceName}`}>
          {session?.user.role === Role.SUBJECT && (
            <Button secondary onClick={() => router.push("/list")}>
              <IoChevronBack className="mr-1" />
              กลับ
            </Button>
          )}
        </Title>
      </div>
      <div className="card flex flex-col gap-5">
        <div className="md:flex justify-between items-center w-full gap-3">
          <h1 className="mb-5 md:mb-0">
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
        <div className="md:flex justify-between items-center w-full gap-3">
          <div className="flex items-center gap-3 mb-5 md:mb-0">
            <label>ค้นหาสถานประกอบการ</label>
            <Input
              name="ID"
              placeholder="เลขประจำสถานประกอบการ"
              value={searchValue}
              onChange={(e: any) => setSearchValue(e.target.value)}
              isControl={false}
              className="w-60 md:w-72"
            />
          </div>
          <div className="flex items-center gap-3">
            <label>สถานะอนุมัติ</label>
            <Dropdown
              name="approve"
              placeholder="ค้นหา"
              options={approveOptions}
              className="w-36"
              isControl={false}
              setterFn={(val: number) => setOption(val)}
              defaultValue={option}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-10">
          <p className="text-blue-500 mb-3 md:mb-0">
            จำนวนสถานประกอบการที่พบทั้งหมด: {numberWithCommas(totalCount) || 0}
          </p>
          <p className="text-red-500 mb-3 md:mb-0">
            จำนวนสถานประกอบการที่ผู้ตรวจยังไม่อนุมัติ:{" "}
            {numberWithCommas(notApproveCount) || 0}
          </p>
        </div>

        {!loading && notApproveCount === 0 && (
          <>
            {session?.user.role === Role.SUBJECT && (
              <div className="w-full flex items-center gap-5">
                ดาวน์โหลดข้อมูลของสถานประกอบการทั้งหมดในจังหวัด
                <CSVLink
                  data={csvData}
                  filename={`retail${year}-${quarter}-${proviceId}.csv`}
                >
                  <Button secondary>
                    <IoCloudDownloadOutline className="mr-1" />
                    ดาวน์โหลด
                  </Button>
                </CSVLink>
              </div>
            )}
            {session?.user.role === Role.SUPERVISOR && (
              <div className="w-full flex items-center gap-5">
                ตาราง Specification
                <Link href={`/specification?yr=${year}&qtr=${quarter}`}>
                  <Button secondary>
                    <FaExternalLinkAlt className="mr-1" />
                    ดูตาราง
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

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
                  dataSource={response}
                  bordered
                  size="middle"
                  scroll={{ x: "calc(500px + 50%)" }}
                  showSorterTooltip={false}
                  pagination={false}
                />
                {totalCount > 0 && (
                  <PageControl
                    page={page}
                    totalPages={Math.ceil(totalCount / perPage)}
                    onChangePage={(page) => setPage(page)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApprovePage;
