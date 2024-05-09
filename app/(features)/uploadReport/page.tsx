"use client";

import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import Title from "@/components/Title";
import Papa from "papaparse";
import axios from "axios";
import useClientSession from "@/hooks/use-client-session";
import { toast } from "sonner";
import { useContext, useEffect, useState } from "react";
import { BsFileEarmarkX } from "react-icons/bs";
import Loading from "@/components/Loading";
import Portal from "@/components/Portal";
import { CSVLink } from "react-csv";
import Button from "@/components/Button";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { errorHandler } from "@/lib/errorHandler";
import { FilterContext } from "@/context";
import Dropdown from "@/components/Dropdown";
import { quarterMap } from "@/lib/quarter";
import moment from "moment";

const { Dragger } = Upload;

const UploadReport = () => {
  const { year, quarter } = useContext(FilterContext);
  const [unsuccessFile, setUnsuccessFile] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fullLoading, setFullLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const session = useClientSession();
  const [searchQuarter, setSearchQuarter] = useState(quarter);

  useEffect(() => {
    if (session) {
      downloadData();
    }
  }, [session, searchQuarter]);

  const onUploadControl = async (data: any, name: string) => {
    try {
      setFullLoading(true);
      if (session) {
        await axios.post("/api/admin/report", data, {
          headers: { authorization: session.user.accessToken },
        });
      }
    } catch (err: any) {
      setUnsuccessFile((prevState) => [...prevState, name]);
      toast.error("พบปัญหาการนำเข้าข้อมูล");
    } finally {
      downloadData();
      setFullLoading(false);
    }
  };

  const quarterOptions = [];
  for (let i = 1; i <= 4; i++) {
    const res = quarterMap(Number("25" + year) - 543);
    const endDate = moment(res[i - 1].formSubmittedRange[1]);
    const now = moment();

    if (now >= endDate) {
      quarterOptions.push({ label: i.toString(), value: i });
    }
  }

  const props: UploadProps = {
    accept: ".csv",
    name: "file",
    multiple: false,
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

  const downloadData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/report", {
        params: {
          quarter: searchQuarter,
          year,
        },
        headers: { authorization: session?.user.accessToken },
      });

      if (res.status === 200) {
        let excel = res.data;
        for (const item of excel) {
          delete item.TITLE;
          delete item.RANK;
          delete item.FIRSTNAME;
          delete item.LASTNAME;
          delete item.EST_TITLE;
          delete item.EST_NAME;
          delete item.ADD_NO;
          delete item.BUILDING;
          delete item.ROOM;
          delete item.STREET;
          delete item.BLK;
          delete item.SOI;
          delete item.SUB_DIST;
          delete item.DISTRICT;
          delete item.PROVINCE;
          delete item.POST_CODE;
          delete item.TEL_NO;
          delete item.E_MAIL;
          delete item.WEBSITE;
          delete item.SOCIAL;
        }
        setCsvData(excel);
      }
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal session={session}>
      {fullLoading && <Loading type="full" />}
      <Title title="จัดการแบบข้อมูลของสถานประกอบการ" />
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <div className="font-bold">นำเข้าข้อมูลของสถานประกอบการ:</div>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              กดหรือลากไฟล์มาที่บริเวณนี้เพื่อทำการอัพโหลด
            </p>
            <p className="ant-upload-hint">
              สามารถลากไฟล์มาอัพโหลดได้ทีละไฟล์ โดยไฟล์จะต้องมีนามสกุลเป็น .csv
              เท่านั้น
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
        </div>
        <div className="w-full flex flex-col gap-5">
          <div className="font-bold">
            ดาวน์โหลดข้อมูลของสถานประกอบการทั้งหมด:
          </div>
          <div className="flex items-center gap-x-3">
            ไตรมาส
            <Dropdown
              name="approve"
              placeholder="หน้า"
              options={quarterOptions}
              className="w-20"
              isControl={false}
              setterFn={(quarter: number) => setSearchQuarter(quarter)}
              defaultValue={searchQuarter}
              styles={{ padding: 0 }}
            />
          </div>
          <CSVLink
            data={csvData}
            filename={`retail${year}-${searchQuarter}.csv`}
          >
            <Button secondary loading={loading}>
              <IoCloudDownloadOutline className="mr-1" />
              ดาวน์โหลด
            </Button>
          </CSVLink>
        </div>
      </div>
    </Portal>
  );
};

export default UploadReport;
