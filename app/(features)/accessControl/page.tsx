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
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import useClientSession from "@/hooks/use-client-session";
import { toast } from "sonner";
import moment from "moment";
import { quarterMap } from "@/lib/quarter";
import Portal from "@/components/Portal";
import { FilterContext } from "@/context";

interface Response {
  hasControl: boolean;
  reportStatus: ReportStatus | null;
}

interface DataType {
  key: React.Key;
  canCreateQtr1: boolean;
  canCreateQtr2: boolean;
  canCreateQtr3: boolean;
  canCreateQtr4: boolean;
}

const AccessControlPage = () => {
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [response, setResponse] = useState<Response>({
    hasControl: false,
    reportStatus: null,
  });
  const [id, setId] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchIdSchema),
  });
  const { year } = useContext(FilterContext);

  const session = useClientSession();

  const onSwitchChange = async (checked: boolean, quarter: number) => {
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

  const isPassOpenDate = (quarter: number) => {
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
      title: "ไตรมาส",
      children: [
        {
          title: "ไตรมาสที่ 1",
          dataIndex: "qtr1",
          key: "qtr1",
          align: "center",
          render: (_, { canCreateQtr1 }) => (
            <Switch
              defaultChecked={canCreateQtr1}
              onChange={(checked: boolean) => onSwitchChange(checked, 1)}
              disabled={!isPassOpenDate(1)}
              className="bg-gray-500"
            />
          ),
        },
        {
          title: "ไตรมาสที่ 2",
          dataIndex: "qtr2",
          key: "qtr2",
          align: "center",
          render: (_, { canCreateQtr2 }) => (
            <Switch
              defaultChecked={canCreateQtr2}
              onChange={(checked: boolean) => onSwitchChange(checked, 2)}
              disabled={!isPassOpenDate(2)}
              className="bg-gray-500"
            />
          ),
        },
        {
          title: "ไตรมาสที่ 3",
          dataIndex: "qtr3",
          key: "qtr3",
          align: "center",
          render: (_, { canCreateQtr3 }) => (
            <Switch
              defaultChecked={canCreateQtr3}
              onChange={(checked: boolean) => onSwitchChange(checked, 3)}
              disabled={!isPassOpenDate(3)}
              className="bg-gray-500"
            />
          ),
        },
        {
          title: "ไตรมาสที่ 4",
          dataIndex: "qtr4",
          key: "qtr4",
          align: "center",
          render: (_, { canCreateQtr4 }) => (
            <Switch
              defaultChecked={canCreateQtr4}
              onChange={(checked: boolean) => onSwitchChange(checked, 4)}
              disabled={!isPassOpenDate(4)}
              className="bg-gray-500"
            />
          ),
        },
      ],
    },
  ];

  const data: DataType[] = [];
  if (response.hasControl && response.reportStatus) {
    const { no, canCreateQtr1, canCreateQtr2, canCreateQtr3, canCreateQtr4 } =
      response.reportStatus;

    data.push({
      key: no,
      canCreateQtr1,
      canCreateQtr2,
      canCreateQtr3,
      canCreateQtr4,
    });
  }

  const onSearchId = handleSubmit(async (data) => {
    try {
      setLoading(true);
      let res;
      if (session) {
        res = await axios.post(
          "/api/report_status",
          { data, year },
          {
            headers: { authorization: session.user.accessToken },
          }
        );
      } else {
        res = await axios.post("/api/report_status", { data, year });
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
    <Portal session={session}>
      {switchLoading && <Loading type="full" />}
      <Title title="กำหนดสิทธิแก้ไขฟอร์ม" />
      <div className="card">
        <form onSubmit={onSearchId} className="flex flex-col gap-5">
          <label>
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
          (response.hasControl && response.reportStatus ? (
            <>
              <hr className="my-5" />
              <div className="flex flex-col gap-3">
                <h1>
                  ตารางแสดงสิทธิการเข้าถึงแบบฟอร์มในแต่ละไตรมาสเพื่อทำการสร้างหรือแก้ไข
                </h1>
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
    </Portal>
  );
};

export default AccessControlPage;
