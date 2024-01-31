"use client";

import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { errorHandler } from "@/lib/errorHandler";
import { ReportStatus } from "@/types/dto/report";
import { SearchForm, searchIdSchema } from "@/types/schemas/searchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Empty, Switch } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import useClientSession from "@/hooks/use-client-session";
import { toast } from "sonner";
import moment from "moment";
import { quarterMap } from "@/lib/quarter";

interface Response {
  hasControl: boolean;
  reportStatus: ReportStatus[];
}

interface DataType {
  key: React.Key;
  year: number;
  qtr1: Quarter;
  qtr2: Quarter;
  qtr3: Quarter;
  qtr4: Quarter;
}

interface Quarter {
  canCreate: boolean;
  year: number;
}

const AccessControlPage = () => {
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
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

  const onSwitchChange = async (
    checked: boolean,
    year: number,
    quarter: number
  ) => {
    try {
      setSwitchLoading(true);
      const res = await axios.patch(
        "/api/report_status",
        { id, checked, year, quarter },
        {
          headers: { authorization: session?.user.accessToken },
        }
      );

      if (res.status === 200) {
        toast.success("เปลี่ยนสิทธิสำเร็จ");
      }
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setSwitchLoading(false);
    }
  };

  const isPassOpenDate = (year: number, quarter: number) => {
    let passOpenDate = false;
    const res = quarterMap(Number("25" + year) - 543);
    const startDate = moment(res[quarter - 1].formSubmittedRange[0]);
    const now = moment();

    if (now >= startDate) {
      passOpenDate = true;
    }
    return passOpenDate;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ปี",
      dataIndex: "year",
      key: "year",
      width: "10%",
      fixed: "left",
      align: "center",
    },
    {
      title: "ไตรมาส",
      children: [
        {
          title: "ไตรมาสที่ 1",
          dataIndex: "qtr1",
          key: "qtr1",
          align: "center",
          render: (_, { qtr1 }) => (
            <Switch
              defaultChecked={qtr1.canCreate}
              onChange={(checked: boolean) =>
                onSwitchChange(checked, qtr1.year, 1)
              }
              disabled={!isPassOpenDate(qtr1.year, 1)}
              className="bg-gray-500"
            />
          ),
        },
        {
          title: "ไตรมาสที่ 2",
          dataIndex: "qtr2",
          key: "qtr2",
          align: "center",
          render: (_, { qtr2 }) => (
            <Switch
              defaultChecked={qtr2.canCreate}
              onChange={(checked: boolean) =>
                onSwitchChange(checked, qtr2.year, 2)
              }
              disabled={!isPassOpenDate(qtr2.year, 2)}
              className="bg-gray-500"
            />
          ),
        },
        {
          title: "ไตรมาสที่ 3",
          dataIndex: "qtr3",
          key: "qtr3",
          align: "center",
          render: (_, { qtr3 }) => (
            <Switch
              defaultChecked={qtr3.canCreate}
              onChange={(checked: boolean) =>
                onSwitchChange(checked, qtr3.year, 3)
              }
              disabled={!isPassOpenDate(qtr3.year, 3)}
              className="bg-gray-500"
            />
          ),
        },
        {
          title: "ไตรมาสที่ 4",
          dataIndex: "qtr4",
          key: "qtr4",
          align: "center",
          render: (_, { qtr4 }) => (
            <Switch
              defaultChecked={qtr4.canCreate}
              onChange={(checked: boolean) =>
                onSwitchChange(checked, qtr4.year, 4)
              }
              disabled={!isPassOpenDate(qtr4.year, 4)}
              className="bg-gray-500"
            />
          ),
        },
      ],
    },
  ];

  const data: DataType[] = [];
  if (response.hasControl && response.reportStatus.length > 0) {
    for (const item of response.reportStatus) {
      const {
        no,
        year,
        canCreateQtr1,
        canCreateQtr2,
        canCreateQtr3,
        canCreateQtr4,
      } = item;

      data.push({
        key: no,
        year,
        qtr1: { canCreate: canCreateQtr1, year },
        qtr2: { canCreate: canCreateQtr2, year },
        qtr3: { canCreate: canCreateQtr3, year },
        qtr4: { canCreate: canCreateQtr4, year },
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
          { data },
          {
            headers: { authorization: session.user.accessToken },
          }
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
      {switchLoading && <Loading type="full" />}
      <div className="mb-10 flex flex-col gap-3">
        <Title title="กำหนดสิทธิแก้ไขฟอร์ม"></Title>
      </div>
      <div className="card">
        <form onSubmit={onSearchId} className="flex flex-col gap-5">
          <label className="w-ful">
            กรอกเลขประจำสถานประกอบการที่ต้องการเปลี่ยนสิทธิ{" "}
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
                <h1>ตารางแสดงสิทธิการเข้าถึงแบบฟอร์มในแต่ละไตรมาส</h1>
                <p>เลขประจำสถานประกอบการ: {id}</p>
                <Table
                  columns={columns}
                  dataSource={data}
                  bordered
                  size="middle"
                  scroll={{ x: "calc(500px + 50%)" }}
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

export default AccessControlPage;
