"use client";

import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Table, Upload } from "antd";
import Title from "@/components/Title";
import Papa from "papaparse";
import axios from "axios";
import useClientSession from "@/hooks/use-client-session";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { BsFileEarmarkX } from "react-icons/bs";
import { errorHandler } from "@/lib/errorHandler";
import { ColumnsType } from "antd/es/table";
import { ControlTable } from "@/types/dto/control";
import Loading from "@/components/Loading";

const { Dragger } = Upload;

const UploadControl = () => {
  const [unsuccessFile, setUnsuccessFile] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ControlTable[]>([]);
  const session = useClientSession();

  useEffect(() => {
    if (session) {
      fetchControls();
    }
  }, [session]);

  const fetchControls = async () => {
    try {
      setLoading(true);
      if (session) {
        const res = await axios.get("/api/control", {
          headers: { authorization: session.user.accessToken },
        });

        if (res.status === 200) {
          setResponse(res.data);
        }
      }
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  const onUploadControl = async (data: any, name: string) => {
    try {
      if (session) {
        await axios.post("/api/control", data, {
          headers: { authorization: session.user.accessToken },
        });
      }
    } catch (err: any) {
      setUnsuccessFile((prevState) => [...prevState, name]);
      toast.error("พบปัญหาการนำเข้าข้อมูล");
    } finally {
      fetchControls();
    }
  };

  const columns: ColumnsType<ControlTable> = [
    {
      title: "รหัสจังหวัด",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "20%",
    },
    {
      title: "ชื่อจังหวัด",
      dataIndex: "name",
      key: "name",
      width: "50%",
    },
    {
      title: "จำนวนสถานประกอบการ",
      dataIndex: "count",
      key: "count",
      align: "center",
      width: "30%",
    },
  ];

  const props: UploadProps = {
    accept: ".csv",
    name: "file",
    multiple: true,
    action: `${process.env.NEXT_PUBLIC_CALLBACK_URL}/api/admin`,
    onChange(info) {
      const { status, originFileObj, name } = info.file;
      if (status !== "uploading" && status !== "removed") {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          const csvFile = e.target.result;

          Papa.parse(csvFile, {
            skipEmptyLines: true,
            header: true,
            complete: (results) => onUploadControl(results.data, name),
          });
        };
        reader.readAsText(originFileObj as any);
      }
      if (status === "done") {
        toast.success(`อ่านไฟล์ ${name} สำเร็จ`);
      } else if (status === "error") {
        toast.error(`อ่านไฟล์ ${name} ไม่สำเร็จ`);
      }
    },
  };

  return (
    <div className="flex flex-col gap-10">
      <Title title="อัพโหลด Control" />
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          กดหรือลากไฟล์มาที่บริเวณนี้เพื่อทำการอัพโหลด
        </p>
        <p className="ant-upload-hint">
          สามารถลากหลายไฟล์มาอัพโหลดพร้อมกันได้ในครั้งเดียว
          โดยไฟล์จะต้องมีนามสกุลเป็น .csv เท่านั้น
        </p>
      </Dragger>
      {unsuccessFile.length > 0 && (
        <div className="flex flex-col gap-3">
          <div>ไฟล์ที่อัพโหลดเข้าฐานข้อมูลไม่สำเร็จ</div>
          {unsuccessFile.map((file) => (
            <p className="text-red-500 flex gap-2 items-center">
              <BsFileEarmarkX />
              {file}
            </p>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-3 w-2/4">
        <div>ตารางแสดงจำนวนสถานประกอบการทั้งหมดในแต่ละจังหวัดตาม control</div>
        {loading ? (
          <Loading type="partial" />
        ) : (
          <Table
            columns={columns}
            dataSource={response}
            bordered
            size="middle"
            scroll={{ x: "calc(200px + 50%)" }}
            showSorterTooltip={false}
            pagination={false}
          />
        )}
      </div>
    </div>
  );
};

export default UploadControl;
