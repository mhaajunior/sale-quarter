"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { errorHandler } from "@/helpers/errorHandler";
import { ReportStatus } from "@/types/report";
import { SearchForm, searchIdSchema } from "@/types/searchSchema";
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

interface Response {
  hasControl: boolean;
  reportStatus: ReportStatus[];
}

interface QtrAction {
  year: number;
  canCreate: boolean;
  isSend: boolean;
}

interface DataType {
  key: React.Key;
  year: number;
  qtr1Status: string[];
  qtr2Status: string[];
  qtr3Status: string[];
  qtr4Status: string[];
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
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchIdSchema),
  });

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
              width: "8%",
              align: "center",
              render: (_, { qtr1Status }) => (
                <>
                  {qtr1Status.map((tag, index) => {
                    let color = mapTagColor(tag);
                    return (
                      <Tag color={color} key={index}>
                        {tag}
                      </Tag>
                    );
                  })}
                </>
              ),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr1Action",
              key: "qtr1Action",
              width: "8%",
              align: "center",
              render: (_, { qtr1Action }) => (
                <div className="flex justify-center">
                  {qtr1Action.canCreate ? (
                    qtr1Action.isSend ? (
                      <Link
                        href={`/search/${id}?yr=${qtr1Action.year}&qtr=1&mode=edit`}
                      >
                        <Button warning>แก้ไข</Button>
                      </Link>
                    ) : (
                      <Link
                        href={`/search/${id}?yr=${qtr1Action.year}&qtr=1&mode=create`}
                      >
                        <Button secondary>สร้าง</Button>
                      </Link>
                    )
                  ) : (
                    ""
                  )}
                </div>
              ),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr1DateModified",
              key: "qtr1DateModified",
              width: "8%",
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
              width: "8%",
              align: "center",
              render: (_, { qtr2Status }) => (
                <>
                  {qtr2Status.map((tag, index) => {
                    let color = mapTagColor(tag);
                    return (
                      <Tag color={color} key={index}>
                        {tag}
                      </Tag>
                    );
                  })}
                </>
              ),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr2Action",
              key: "qtr2Action",
              width: "8%",
              align: "center",
              render: (_, { qtr2Action }) => (
                <div className="flex justify-center">
                  {qtr2Action.canCreate ? (
                    qtr2Action.isSend ? (
                      <Link
                        href={`/search/${id}?yr=${qtr2Action.year}&qtr=1&mode=edit`}
                      >
                        <Button warning>แก้ไข</Button>
                      </Link>
                    ) : (
                      <Link
                        href={`/search/${id}?yr=${qtr2Action.year}&qtr=1&mode=create`}
                      >
                        <Button secondary>สร้าง</Button>
                      </Link>
                    )
                  ) : (
                    ""
                  )}
                </div>
              ),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr2DateModified",
              key: "qtr2DateModified",
              width: "8%",
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
              width: "8%",
              align: "center",
              render: (_, { qtr3Status }) => (
                <>
                  {qtr3Status.map((tag, index) => {
                    let color = mapTagColor(tag);
                    return (
                      <Tag color={color} key={index}>
                        {tag}
                      </Tag>
                    );
                  })}
                </>
              ),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr3Action",
              key: "qtr3Action",
              width: "8%",
              align: "center",
              render: (_, { qtr3Action }) => (
                <div className="flex justify-center">
                  {qtr3Action.canCreate ? (
                    qtr3Action.isSend ? (
                      <Link
                        href={`/search/${id}?yr=${qtr3Action.year}&qtr=1&mode=edit`}
                      >
                        <Button warning>แก้ไข</Button>
                      </Link>
                    ) : (
                      <Link
                        href={`/search/${id}?yr=${qtr3Action.year}&qtr=1&mode=create`}
                      >
                        <Button secondary>สร้าง</Button>
                      </Link>
                    )
                  ) : (
                    ""
                  )}
                </div>
              ),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr3DateModified",
              key: "qtr3DateModified",
              width: "8%",
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
              width: "8%",
              align: "center",
              render: (_, { qtr4Status }) => (
                <>
                  {qtr4Status.map((tag, index) => {
                    let color = mapTagColor(tag);
                    return (
                      <Tag color={color} key={index}>
                        {tag}
                      </Tag>
                    );
                  })}
                </>
              ),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr4Action",
              key: "qtr4Action",
              width: "8%",
              align: "center",
              render: (_, { qtr4Action }) => (
                <div className="flex justify-center">
                  {qtr4Action.canCreate ? (
                    qtr4Action.isSend ? (
                      <Link
                        href={`/search/${id}?yr=${qtr4Action.year}&qtr=1&mode=edit`}
                      >
                        <Button warning>แก้ไข</Button>
                      </Link>
                    ) : (
                      <Link
                        href={`/search/${id}?yr=${qtr4Action.year}&qtr=1&mode=create`}
                      >
                        <Button secondary>สร้าง</Button>
                      </Link>
                    )
                  ) : (
                    ""
                  )}
                </div>
              ),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr4DateModified",
              key: "qtr4DateModified",
              width: "8%",
              align: "center",
            },
          ],
        },
      ],
    },
  ];

  const data: DataType[] = [];
  if (response.hasControl) {
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
      } = item;
      const qtr1Tag = [];
      const qtr2Tag = [];
      const qtr3Tag = [];
      const qtr4Tag = [];

      if (isSendQtr1) {
        qtr1Tag.push("ส่งแล้ว");
      } else {
        if (!canCreateQtr1) {
          qtr1Tag.push("ไม่อยู่ในช่วงเวลา");
        } else {
          qtr1Tag.push("ยังไม่ส่ง");
        }
      }
      if (isSendQtr2) {
        qtr2Tag.push("ส่งแล้ว");
      } else {
        if (!canCreateQtr2) {
          qtr2Tag.push("ไม่อยู่ในช่วงเวลา");
        } else {
          qtr2Tag.push("ยังไม่ส่ง");
        }
      }
      if (isSendQtr3) {
        qtr3Tag.push("ส่งแล้ว");
      } else {
        if (!canCreateQtr3) {
          qtr3Tag.push("ไม่อยู่ในช่วงเวลา");
        } else {
          qtr3Tag.push("ยังไม่ส่ง");
        }
      }
      if (isSendQtr4) {
        qtr4Tag.push("ส่งแล้ว");
      } else {
        if (!canCreateQtr4) {
          qtr4Tag.push("ไม่อยู่ในช่วงเวลา");
        } else {
          qtr4Tag.push("ยังไม่ส่ง");
        }
      }
      data.push({
        key: id,
        year,
        qtr1Status: qtr1Tag,
        qtr2Status: qtr2Tag,
        qtr3Status: qtr3Tag,
        qtr4Status: qtr4Tag,
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
      const res = await axios.post("/api/searchId", data);

      if (res.status === 200) {
        setResponse(res.data);
        setId(data.ID);
      }
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
    reset();
  });

  return (
    <>
      <div className="mb-10 flex flex-col gap-3">
        <Title title="ค้นหาสถานประกอบการ" />
      </div>
      <div className="card">
        <form onSubmit={onSearchId} className="flex flex-col gap-5">
          <label className="w-ful">
            กรุณากรอกเลขสถานประกอบการของท่าน{" "}
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
          (response.hasControl ? (
            <>
              <hr className="my-5" />
              <div className="flex flex-col gap-3">
                <h1>ตารางรายงานสถานะการส่งแบบฟอร์มของ</h1>
                <p>เลขที่สถานประกอบการ: {response.reportStatus[0].ID}</p>
                <Table
                  columns={columns}
                  dataSource={data}
                  bordered
                  size="middle"
                  scroll={{ x: "calc(1200px + 50%)" }}
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
