"use client";

import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import Title from "@/components/Title";
import Papa from "papaparse";
import axios from "axios";
import useClientSession from "@/hooks/use-client-session";
import { toast } from "sonner";

const { Dragger } = Upload;

const UploadControl = () => {
  const session = useClientSession();

  const onUploadControl = async (data: any) => {
    try {
      if (session) {
        await axios.post("/api/control", data, {
          headers: { authorization: session.user.accessToken },
        });
      }
    } catch (err: any) {
      toast.error("พบปัญหาการนำเข้าข้อมูล");
    }
  };

  const props: UploadProps = {
    accept: ".csv",
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status, originFileObj } = info.file;
      if (status !== "uploading" && status !== "removed") {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          const csvFile = e.target.result;

          Papa.parse(csvFile, {
            header: true,
            complete: (results) => onUploadControl(results.data),
          });
        };
        reader.readAsText(originFileObj as any);
      }
      if (status === "done") {
        toast.success(`อัพโหลดไฟล์ ${info.file.name} สำเร็จ`);
      } else if (status === "error") {
        toast.error(`อัพโหลดไฟล์ ${info.file.name} ไม่สำเร็จ`);
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
    </div>
  );
};

export default UploadControl;
