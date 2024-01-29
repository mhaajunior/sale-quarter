"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { errorHandler } from "@/lib/errorHandler";
import { ReportStatus } from "@/types/dto/report";
import { SearchForm, searchIdSchema } from "@/types/schemas/searchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Empty, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import useClientSession from "@/hooks/use-client-session";
import { quarterMap } from "@/lib/quarter";
import { Role } from "@prisma/client";

interface Response {
  hasControl: boolean;
  reportStatus: ReportStatus[];
}

interface QtrAction {
  year: number;
  canCreate: boolean;
  isSend: boolean;
}

interface SendStatus {
  passOpenDate: boolean;
  company: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
}

interface DataType {
  key: React.Key;
  year: number;
  qtr1Status: SendStatus;
  qtr2Status: SendStatus;
  qtr3Status: SendStatus;
  qtr4Status: SendStatus;
  qtr1Action: QtrAction;
  qtr2Action: QtrAction;
  qtr3Action: QtrAction;
  qtr4Action: QtrAction;
  qtr1DateModified: string;
  qtr2DateModified: string;
  qtr3DateModified: string;
  qtr4DateModified: string;
}

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response>({
    hasControl: false,
    reportStatus: [],
  });
  const [id, setId] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchIdSchema),
  });

  const session = useClientSession();

  const mapTagColor = (tag: string) => {
    let color = "";
    switch (tag) {
      case "ส่งแล้ว":
        color = "success";
        break;
      case "ยังไม่ส่ง":
        color = "error";
        break;
      default:
        color = "default";
        break;
    }
    return color;
  };

  const renderTags = (status: SendStatus) => {
    if (!status.passOpenDate) {
      return <Tag color="default">ไม่อยู่ในช่วงเวลา</Tag>;
    }

    if (!session) {
      return <Tag color={mapTagColor(status.company)}>{status.company}</Tag>;
    } else {
      return (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center justify-between">
            <p className="text-left">สถานประกอบการ</p>
            <div>
              <Tag color={mapTagColor(status.company)}>{status.company}</Tag>
            </div>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <p className="text-left">เจ้าหน้าที่ปฏิบัติงานเก็บรวบรวมข้อมูล</p>
            <div>
              <Tag color={mapTagColor(status.p1)}>{status.p1}</Tag>
            </div>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <p className="text-left">เจ้าหน้าที่บรรณาธิกรและลงรหัส</p>
            <div>
              <Tag color={mapTagColor(status.p2)}>{status.p2}</Tag>
            </div>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <p className="text-left">เจ้าหน้าที่บันทึกข้อมูล</p>
            <div>
              <Tag color={mapTagColor(status.p3)}>{status.p3}</Tag>
            </div>
          </div>
          <div className="flex gap-3 items-center justify-between">
            <p className="text-left">ผู้ตรวจ</p>
            <div>
              <Tag color={mapTagColor(status.p4)}>{status.p4}</Tag>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderActions = (actions: QtrAction, quarter: number) => {
    return (
      <div className="flex justify-center">
        {session && session.user.role === Role.SUPERVISOR}
        {actions.canCreate ? (
          actions.isSend ? (
            <Link
              href={`/search/${id}?yr=${actions.year}&qtr=${quarter}&mode=edit`}
            >
              <Button warning>แก้ไข</Button>
            </Link>
          ) : (
            <Link
              href={`/search/${id}?yr=${actions.year}&qtr=${quarter}&mode=create`}
            >
              <Button secondary>สร้าง</Button>
            </Link>
          )
        ) : (
          ""
        )}
      </div>
    );
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ปี",
      dataIndex: "year",
      key: "year",
      width: "4%",
      fixed: "left",
      align: "center",
    },
    {
      title: "ไตรมาส",
      children: [
        {
          title: "ไตรมาสที่ 1",
          children: [
            {
              title: "สถานะ",
              dataIndex: "qtr1Status",
              key: "qtr1Status",
              width: "12%",
              align: "center",
              render: (_, { qtr1Status }) => renderTags(qtr1Status),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr1Action",
              key: "qtr1Action",
              width: "6%",
              align: "center",
              render: (_, { qtr1Action }) => renderActions(qtr1Action, 1),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr1DateModified",
              key: "qtr1DateModified",
              width: "6%",
              align: "center",
            },
          ],
        },
        {
          title: "ไตรมาสที่ 2",
          children: [
            {
              title: "สถานะ",
              dataIndex: "qtr2Status",
              key: "qtr2Status",
              width: "12%",
              align: "center",
              render: (_, { qtr2Status }) => renderTags(qtr2Status),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr2Action",
              key: "qtr2Action",
              width: "6%",
              align: "center",
              render: (_, { qtr2Action }) => renderActions(qtr2Action, 2),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr2DateModified",
              key: "qtr2DateModified",
              width: "6%",
              align: "center",
            },
          ],
        },
        {
          title: "ไตรมาสที่ 3",
          children: [
            {
              title: "สถานะ",
              dataIndex: "qtr3Status",
              key: "qtr3Status",
              width: "12%",
              align: "center",
              render: (_, { qtr3Status }) => renderTags(qtr3Status),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr3Action",
              key: "qtr3Action",
              width: "6%",
              align: "center",
              render: (_, { qtr3Action }) => renderActions(qtr3Action, 3),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr3DateModified",
              key: "qtr3DateModified",
              width: "6%",
              align: "center",
            },
          ],
        },
        {
          title: "ไตรมาสที่ 4",
          children: [
            {
              title: "สถานะ",
              dataIndex: "qtr4Status",
              key: "qtr4Status",
              width: "12%",
              align: "center",
              render: (_, { qtr4Status }) => renderTags(qtr4Status),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr4Action",
              key: "qtr4Action",
              width: "6%",
              align: "center",
              render: (_, { qtr4Action }) => renderActions(qtr4Action, 4),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr4DateModified",
              key: "qtr4DateModified",
              width: "6%",
              align: "center",
            },
          ],
        },
      ],
    },
  ];

  const data: DataType[] = [];
  if (response.hasControl && response.reportStatus.length > 0) {
    for (const item of response.reportStatus) {
      const {
        id,
        year,
        canCreateQtr1,
        canCreateQtr2,
        canCreateQtr3,
        canCreateQtr4,
        isSendQtr1,
        isSendQtr2,
        isSendQtr3,
        isSendQtr4,
        report,
      } = item;

      const quarterStatus: SendStatus[] = [];
      for (let i = 0; i < 4; i++) {
        const qtrTag: SendStatus = {
          passOpenDate: false,
          company: "ยังไม่ส่ง",
          p1: "ยังไม่ส่ง",
          p2: "ยังไม่ส่ง",
          p3: "ยังไม่ส่ง",
          p4: "ยังไม่ส่ง",
        };
        let isSend;
        const res = quarterMap(Number("25" + year) - 543);
        const startDate = moment(res[i].formSubmittedRange[0]);
        const now = moment();

        if (now >= startDate) {
          qtrTag.passOpenDate = true;
        }

        switch (i) {
          case 0:
            isSend = isSendQtr1;
            break;
          case 1:
            isSend = isSendQtr2;
            break;
          case 2:
            isSend = isSendQtr3;
            break;
          case 3:
            isSend = isSendQtr4;
            break;
        }

        if (isSend) {
          qtrTag.company = "ส่งแล้ว";
        }

        if (report) {
          const reportQtr = report[i] || null;
          if (reportQtr) {
            if (reportQtr.P1) {
              qtrTag.p1 = "ส่งแล้ว";
            }
            if (reportQtr.P2) {
              qtrTag.p2 = "ส่งแล้ว";
            }
            if (reportQtr.P3) {
              qtrTag.p3 = "ส่งแล้ว";
            }
            if (reportQtr.P4) {
              qtrTag.p4 = "ส่งแล้ว";
            }
          }
          quarterStatus.push(qtrTag);
        }
      }

      data.push({
        key: id,
        year,
        qtr1Status: quarterStatus[0],
        qtr2Status: quarterStatus[1],
        qtr3Status: quarterStatus[2],
        qtr4Status: quarterStatus[3],
        qtr1Action: { year, canCreate: canCreateQtr1, isSend: isSendQtr1 },
        qtr2Action: { year, canCreate: canCreateQtr2, isSend: isSendQtr2 },
        qtr3Action: { year, canCreate: canCreateQtr3, isSend: isSendQtr3 },
        qtr4Action: { year, canCreate: canCreateQtr4, isSend: isSendQtr4 },
        qtr1DateModified: item.report[0]
          ? moment(item.report[0].updatedAt).format("YYYY-MM-DD HH:mm:ss")
          : "-",
        qtr2DateModified: item.report[1]
          ? moment(item.report[1].updatedAt).format("YYYY-MM-DD HH:mm:ss")
          : "-",
        qtr3DateModified: item.report[2]
          ? moment(item.report[2].updatedAt).format("YYYY-MM-DD HH:mm:ss")
          : "-",
        qtr4DateModified: item.report[3]
          ? moment(item.report[3].updatedAt).format("YYYY-MM-DD HH:mm:ss")
          : "-",
      });
    }
  }

  const onSearchId = handleSubmit(async (data) => {
    try {
      setLoading(true);
      let res;
      if (session) {
        res = await axios.post(
          "/api/report_status",
          { data, province: session.user.province },
          { headers: { authorization: session.user.accessToken } }
        );
      } else {
        res = await axios.post("/api/report_status", { data });
      }

      if (res.status === 200) {
        setResponse(res.data);
        setId(data.ID);
      }
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <div className="mb-10 flex flex-col gap-3">
        <Title title="ค้นหาสถานประกอบการ"></Title>
      </div>
      <div className="card">
        <form onSubmit={onSearchId} className="flex flex-col gap-5">
          <label className="w-ful">
            กรุณากรอกเลขประจำสถานประกอบการของท่าน{" "}
            <span className="text-blue-500">
              (กดปุ่ม Enter หรือ Icon แว่นขยายเพื่อทำการค้นหา)
            </span>
          </label>
          <Input
            name="ID"
            placeholder="เลขประจำสถานประกอบการ"
            register={register}
            className="w-60 md:w-72"
            errors={errors.ID}
            icon={
              loading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <CiSearch />
              )
            }
            onIconClick={onSearchId}
            disabled={loading}
          />
        </form>
        {loading ? (
          <>
            <hr className="my-5" />
            <Loading type="partial" />
          </>
        ) : (
          isSubmitSuccessful &&
          (response.hasControl && response.reportStatus.length > 0 ? (
            <>
              <hr className="my-5" />
              <div className="flex flex-col gap-3">
                <h1>ตารางรายงานสถานะการส่งแบบฟอร์ม</h1>
                <p>เลขประจำสถานประกอบการ: {id}</p>
                <Table
                  columns={columns}
                  dataSource={data}
                  bordered
                  size="middle"
                  scroll={{ x: "calc(1500px + 50%)" }}
                  pagination={false}
                />
              </div>
            </>
          ) : (
            <>
              <hr className="my-5" />
              <Empty />
            </>
          ))
        )}
      </div>
    </>
  );
};

export default SearchPage;
