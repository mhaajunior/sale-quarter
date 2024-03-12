"use client";

import Badge from "@/components/Badge";
import Title from "@/components/Title";
import { errorHandler } from "@/lib/errorHandler";
import useClientSession from "@/hooks/use-client-session";
import { ReportStatus } from "@/types/dto/report";
import { FloatButton, Table } from "antd";
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
import { QuarterArr } from "@/types/dto/common";
import { useRouter, useSearchParams } from "next/navigation";
import { Role } from "@/types/dto/role";
import { IoChevronBack, IoCloudDownloadOutline } from "react-icons/io5";
import { CSVLink } from "react-csv";
import Input from "@/components/Input";
import { FilterContext } from "@/context";
import PageControl from "@/components/PageControl";
import useDebounce from "@/hooks/use-debounce";
import { mapProvinceName } from "@/utils/province";
import Portal from "@/components/Portal";
import useWindowSize from "@/hooks/use-window-size";

interface DataType {
  key: React.Key;
  id: string;
  company: boolean;
  p1: boolean;
  p2: boolean;
  p3: boolean;
  p4: boolean;
  action: { data: any; canEdit: boolean; canAccess: boolean };
}

interface Count {
  notApproveCount: number;
  totalNotApproveCount: number;
  totalCount: number;
}

interface Response extends Count {
  reportStatus: ReportStatus[];
}

const ApprovePage = () => {
  const { year, quarter, setQuarter } = useContext(FilterContext);
  const searchParams = useSearchParams();
  const proviceId = Number(searchParams.get("pvid"));
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DataType[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [denied, setDenied] = useState<{ isDenied: boolean; code?: number }>({
    isDenied: false,
  });
  const [csvData, setCsvData] = useState([]);
  const [option, setOption] = useState(1);
  const [count, setCount] = useState<Count>({
    notApproveCount: 0,
    totalNotApproveCount: 0,
    totalCount: 0,
  });
  const [page, setPage] = useState(Number(searchParams.get("pg")) || 1);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue);
  const router = useRouter();
  const session = useClientSession();
  const size = useWindowSize();
  const perPage = 100;

  useEffect(() => {
    if (session) {
      if (!proviceId) {
        setNotFound(true);
        return;
      } else {
        if (
          session.user.role === Role.SUPERVISOR &&
          proviceId !== session.user.province
        ) {
          setDenied({ isDenied: true, code: 3 });
          return;
        }
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

  let p1 =
    size.width && size.width > 768
      ? "เจ้าหน้าที่ปฏิบัติงานเก็บรวบรวมข้อมูล"
      : "P1";
  let p2 =
    size.width && size.width > 768 ? "เจ้าหน้าที่บรรณาธิกรและลงรหัส" : "P2";
  let p3 = size.width && size.width > 768 ? "เจ้าหน้าที่บันทึกข้อมูล" : "P3";
  let p4 = size.width && size.width > 768 ? "ผู้ตรวจ" : "P4";

  const columns: ColumnsType<DataType> = [
    {
      title: "ลำดับ (NO)",
      dataIndex: "key",
      key: "key",
      width: "10%",
      align: "center",
    },
    {
      title: "เลขประจำสถานประกอบการ",
      dataIndex: "id",
      key: "id",
      width: "21%",
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
          title: p1,
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
          title: p2,
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
          title: p3,
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
          title: p4,
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
      width: "18%",
      align: "center",
      fixed: "right",
      render: (_, { action }) => (
        <div className="flex justify-center items-center">
          {action.canEdit ? (
            action.canAccess ? (
              <Link
                href={`/search/${
                  action.data.ID
                }?qtr=${quarter}&mode=edit&pg=${page}${
                  session?.user.role === Role.SUBJECT
                    ? `&pvid=${proviceId}`
                    : ""
                }`}
              >
                <Button primary>ตรวจสอบ</Button>
              </Link>
            ) : (
              <p className="px-5">ไม่อนุญาตให้แก้ไขได้</p>
            )
          ) : (
            <p className="px-5">
              {session?.user.role === Role.SUBJECT
                ? "สถานประกอบการต้องส่งแบบฟอร์มก่อน"
                : "เจ้าหน้าที่ทุกคนต้องอนุมัติแบบฟอร์มก่อน"}
            </p>
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
          searchId: debouncedSearchValue || null,
        },
        headers: { authorization: session?.user.accessToken },
      });

      if (res.status === 200) {
        const result: Response = res.data;
        setCount({
          notApproveCount: result.notApproveCount,
          totalNotApproveCount: result.totalNotApproveCount,
          totalCount: result.totalCount,
        });
        let data: DataType[] = [];
        if (result.reportStatus.length > 0) {
          result.reportStatus.forEach(function (
            value: ReportStatus,
            i: number
          ) {
            const status: DataType = {
              key: value.no,
              id: value.ID,
              company: false,
              p1: false,
              p2: false,
              p3: false,
              p4: false,
              action: { data: value, canEdit: false, canAccess: false },
            };
            let canCreate = false;
            let isSend = false;
            let isApprove = false;
            switch (quarter) {
              case 1:
                isSend = value.isSendQtr1;
                isApprove = value.isApproveQtr1;
                canCreate = value.canCreateQtr1;
                break;
              case 2:
                isSend = value.isSendQtr2;
                isApprove = value.isApproveQtr2;
                canCreate = value.canCreateQtr2;
                break;
              case 3:
                isSend = value.isSendQtr3;
                isApprove = value.isApproveQtr3;
                canCreate = value.canCreateQtr3;
                break;
              case 4:
                isSend = value.isSendQtr4;
                isApprove = value.isApproveQtr4;
                canCreate = value.canCreateQtr4;
                break;
              default:
                break;
            }

            status.action.canAccess = canCreate;

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

  const onChangePage = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSearchCompany = (e: any) => {
    setPage(1);
    setSearchValue(e.target.value);
  };

  const onChangeOption = (val: number) => {
    setPage(1);
    setOption(val);
  };

  const approveOptions = [
    { label: "ทั้งหมด", value: 1 },
    { label: "ยังไม่อนุมัติ", value: 2 },
  ];

  return (
    <Portal session={session} notFound={notFound} denied={denied}>
      <Title
        title={
          <div className="flex flex-col gap-3">
            <div>
              {proviceId !== 10 ? "จังหวัด" : ""}
              {mapProvinceName[proviceId as keyof typeof mapProvinceName]}
            </div>
            <div>อนุมัติสถานประกอบการ</div>
          </div>
        }
        addon={
          session?.user.role === Role.SUBJECT && (
            <Button secondary onClick={() => router.push("/list")}>
              <IoChevronBack className="mr-1" />
              กลับ
            </Button>
          )
        }
      />
      <div className="card flex flex-col gap-5">
        <h1 className="mb-5 lg:mb-0">
          ตารางแสดงสถานะการส่ง/อนุมัติแบบฟอร์มของแต่ละสถานประกอบการ
        </h1>
        <div className="lg:flex justify-between items-center w-full gap-3">
          <div className="flex items-center gap-3 mb-5 lg:mb-0 justify-between lg:justify-normal">
            <label>ค้นหาสถานประกอบการ</label>
            <Input
              name="ID"
              placeholder="เลขประจำสถานประกอบการ"
              value={searchValue}
              onChange={(e: any) => onSearchCompany(e)}
              isControl={false}
              className="w-60 md:w-72"
            />
          </div>
          <div className="flex items-center gap-3 justify-between lg:justify-normal">
            <label>สถานะอนุมัติ</label>
            <Dropdown
              name="approve"
              placeholder="ค้นหา"
              options={approveOptions}
              className="w-36"
              isControl={false}
              setterFn={(val: number) => onChangeOption(val)}
              defaultValue={option}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 md:gap-10">
          <p className="text-blue-500 mb-3 md:mb-0">
            จำนวนสถานประกอบการที่พบทั้งหมด:{" "}
            {numberWithCommas(count.totalCount) || 0}
          </p>
          <p className="text-red-500 mb-3 md:mb-0">
            จำนวนสถานประกอบการที่ผู้ตรวจยังไม่อนุมัติ:{" "}
            {numberWithCommas(count.notApproveCount) || 0}
          </p>
        </div>

        {!loading && (
          <>
            {session?.user.role === Role.SUBJECT && (
              <div className="w-full flex flex-wrap items-center gap-x-5 gap-y-1">
                <p>ดาวน์โหลดข้อมูลของสถานประกอบการทั้งหมด:</p>
                {count.totalNotApproveCount === 0 ? (
                  <CSVLink
                    data={csvData}
                    filename={`retail${year}-${quarter}-${proviceId}.csv`}
                  >
                    <Button secondary>
                      <IoCloudDownloadOutline className="mr-1" />
                      ดาวน์โหลด
                    </Button>
                  </CSVLink>
                ) : (
                  <p>
                    ไม่สามารถดำเนินการได้จนกว่าทุกสถานประกอบการจะได้รับการอนุมัติโดยผู้ตรวจ
                  </p>
                )}
              </div>
            )}
            {(session?.user.role === Role.SUPERVISOR ||
              session?.user.role === Role.SUBJECT) && (
              <div className="w-full flex flex-wrap items-center gap-x-5 gap-y-1">
                <p>ดูตารางสถิติ:</p>
                {count.totalNotApproveCount === 0 ? (
                  <Link
                    href={`/specification${
                      Role.SUBJECT ? `?pvid=${proviceId}` : ""
                    }`}
                  >
                    <Button secondary>
                      <FaExternalLinkAlt className="mr-1" />
                      ดูตาราง
                    </Button>
                  </Link>
                ) : (
                  <p>
                    ไม่สามารถดำเนินการได้จนกว่าทุกสถานประกอบการจะได้รับการอนุมัติโดยผู้ตรวจ
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <div className="w-full min-h-40 flex flex-col gap-3 items-center">
          {loading ? (
            <Loading type="partial" />
          ) : (
            <>
              {count.totalCount > 0 && (
                <PageControl
                  page={page}
                  totalPages={Math.ceil(count.totalCount / perPage)}
                  onChangePage={(page) => onChangePage(page)}
                />
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
                <Table
                  columns={columns}
                  dataSource={response}
                  bordered
                  size="middle"
                  scroll={{ x: "calc(520px + 50%)" }}
                  showSorterTooltip={false}
                  pagination={false}
                />
              </div>
              {count.totalCount > 0 && (
                <PageControl
                  page={page}
                  totalPages={Math.ceil(count.totalCount / perPage)}
                  onChangePage={(page) => onChangePage(page)}
                />
              )}
            </>
          )}
        </div>
      </div>
      <FloatButton.BackTop visibilityHeight={0} />
    </Portal>
  );
};

export default ApprovePage;
