"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { errorHandler } from "@/helpers/errorHandler";
import { checkDateBetween, quarterMap } from "@/helpers/quarter";
import { CompanyReport } from "@/types/report";
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
  report: CompanyReport[];
}

interface DataType {
  key: React.Key;
  id: string;
  qtr1DateModified: string;
  qtr2DateModified: string;
  qtr3DateModified: string;
  qtr4DateModified: string;
}

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response>({
    hasControl: false,
    report: [],
  });
  const [id, setId] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchIdSchema),
  });
  const format = "YYYY-MM-DD";
  const date = new Date();
  const currentDate = moment(date).format(format);
  const canEdittedQtr1 = checkDateBetween(
    currentDate,
    quarterMap[1].formSubmittedRange[0],
    quarterMap[1].formSubmittedRange[1]
  );
  const canEdittedQtr2 = checkDateBetween(
    currentDate,
    quarterMap[2].formSubmittedRange[0],
    quarterMap[2].formSubmittedRange[1]
  );
  const canEdittedQtr3 = checkDateBetween(
    currentDate,
    quarterMap[3].formSubmittedRange[0],
    quarterMap[3].formSubmittedRange[1]
  );
  const canEdittedQtr4 = checkDateBetween(
    currentDate,
    quarterMap[4].formSubmittedRange[0],
    quarterMap[4].formSubmittedRange[1]
  );

  const columns: ColumnsType<DataType> = [
    {
      title: "เลขประจำสถานประกอบการ",
      dataIndex: "id",
      key: "id",
      width: "12%",
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
              render: () => (
                <>
                  {canEdittedQtr1 ? (
                    response.report[0] ? (
                      <Tag color="success">ส่งแล้ว</Tag>
                    ) : (
                      <Tag color="error">ยังไม่ส่ง</Tag>
                    )
                  ) : (
                    <Tag color="default">ไม่อยู่ในช่วงเวลา</Tag>
                  )}
                </>
              ),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr1Action",
              key: "qtr1Action",
              width: "7%",
              align: "center",
              className: `${canEdittedQtr1 ? "flex justify-center" : ""}`,
              render: () => (
                <>
                  {canEdittedQtr1 ? (
                    response.report[0] ? (
                      <Link href={`/search/${id}?qtr=1&mode=edit`}>
                        <Button warning>แก้ไข</Button>
                      </Link>
                    ) : (
                      <Link href={`/search/${id}?qtr=1&mode=create`}>
                        <Button secondary>สร้าง</Button>
                      </Link>
                    )
                  ) : (
                    ""
                  )}
                </>
              ),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr1DateModified",
              key: "qtr1DateModified",
              width: "7%",
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
              render: () => (
                <>
                  {canEdittedQtr2 ? (
                    response.report[1] ? (
                      <Tag color="success">ส่งแล้ว</Tag>
                    ) : (
                      <Tag color="error">ยังไม่ส่ง</Tag>
                    )
                  ) : (
                    <Tag color="default">ไม่อยู่ในช่วงเวลา</Tag>
                  )}
                </>
              ),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr2Action",
              key: "qtr2Action",
              width: "7%",
              align: "center",
              className: `${canEdittedQtr2 ? "flex justify-center" : ""}`,
              render: () => (
                <>
                  {canEdittedQtr2 ? (
                    response.report[1] ? (
                      <Link href={`/search/${id}?qtr=2&mode=edit`}>
                        <Button warning>แก้ไข</Button>
                      </Link>
                    ) : (
                      <Link href={`/search/${id}?qtr=2&mode=create`}>
                        <Button secondary>สร้าง</Button>
                      </Link>
                    )
                  ) : (
                    ""
                  )}
                </>
              ),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr2DateModified",
              key: "qtr2DateModified",
              width: "7%",
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
              render: () => (
                <>
                  {canEdittedQtr3 ? (
                    response.report[2] ? (
                      <Tag color="success">ส่งแล้ว</Tag>
                    ) : (
                      <Tag color="error">ยังไม่ส่ง</Tag>
                    )
                  ) : (
                    <Tag color="default">ไม่อยู่ในช่วงเวลา</Tag>
                  )}
                </>
              ),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr3Action",
              key: "qtr3Action",
              width: "7%",
              align: "center",
              className: `${canEdittedQtr3 ? "flex justify-center" : ""}`,
              render: () => (
                <>
                  {canEdittedQtr3 ? (
                    response.report[2] ? (
                      <Link href={`/search/${id}?qtr=3&mode=edit`}>
                        <Button warning>แก้ไข</Button>
                      </Link>
                    ) : (
                      <Link href={`/search/${id}?qtr=3&mode=create`}>
                        <Button secondary>สร้าง</Button>
                      </Link>
                    )
                  ) : (
                    ""
                  )}
                </>
              ),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr3DateModified",
              key: "qtr3DateModified",
              width: "7%",
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
              render: () => (
                <>
                  {canEdittedQtr4 ? (
                    response.report[3] ? (
                      <Tag color="success">ส่งแล้ว</Tag>
                    ) : (
                      <Tag color="error">ยังไม่ส่ง</Tag>
                    )
                  ) : (
                    <Tag color="default">ไม่อยู่ในช่วงเวลา</Tag>
                  )}
                </>
              ),
            },
            {
              title: "แบบฟอร์ม",
              dataIndex: "qtr4Action",
              key: "qtr4Action",
              width: "7%",
              align: "center",
              className: `${canEdittedQtr4 ? "flex justify-center" : ""}`,
              render: () => (
                <>
                  {canEdittedQtr4 ? (
                    response.report[3] ? (
                      <Link href={`/search/${id}?qtr=4&mode=edit`}>
                        <Button warning>แก้ไข</Button>
                      </Link>
                    ) : (
                      <Link href={`/search/${id}?qtr=4&mode=create`}>
                        <Button secondary>สร้าง</Button>
                      </Link>
                    )
                  ) : (
                    ""
                  )}
                </>
              ),
            },
            {
              title: "วันแก้ไขล่าสุด",
              dataIndex: "qtr4DateModified",
              key: "qtr4DateModified",
              width: "7%",
              align: "center",
            },
          ],
        },
      ],
    },
  ];

  const data: DataType[] = [];
  if (response.hasControl) {
    data.push({
      key: id,
      id,
      qtr1DateModified: response.report[0]
        ? moment(response.report[0].updatedAt).format("YYYY-MM-DD HH:mm:ss")
        : "-",
      qtr2DateModified: response.report[1]
        ? moment(response.report[1].updatedAt).format("YYYY-MM-DD HH:mm:ss")
        : "-",
      qtr3DateModified: response.report[2]
        ? moment(response.report[2].updatedAt).format("YYYY-MM-DD HH:mm:ss")
        : "-",
      qtr4DateModified: response.report[3]
        ? moment(response.report[3].updatedAt).format("YYYY-MM-DD HH:mm:ss")
        : "-",
    });
  }

  const onSearchId = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/companyId", data);

      if (res.status === 200) {
        setResponse(res.data);
        setId(data.ID);
      }
      setLoading(false);
    } catch (err: any) {
      errorHandler(err);
      setLoading(false);
    }
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
        {loading && (
          <>
            <hr className="my-5" />
            <Loading type="partial" />
          </>
        )}
        {isSubmitSuccessful &&
          (response.hasControl ? (
            <>
              <hr className="my-5" />
              <h1 className="mb-2">ตารางรายงานสถานะการส่งแบบฟอร์ม</h1>
              <Table
                columns={columns}
                dataSource={data}
                bordered
                size="middle"
                scroll={{ x: "calc(1200px + 50%)" }}
                pagination={false}
              />
            </>
          ) : (
            <>
              <hr className="my-5" />
              <Empty />
            </>
          ))}
      </div>
    </>
  );
};

export default SearchPage;
