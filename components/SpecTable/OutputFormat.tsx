"use client";

import useClientSession from "@/hooks/use-client-session";
import { isNull } from "@/lib/common";
import { errorHandler } from "@/lib/errorHandler";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import Button from "../Button";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { CompanyReport } from "@/types/dto/report";
import * as XLSX from "xlsx";
import base64 from "@/utils/excelTemplate/output_format.xlsx";

interface Data {
  year: number;
  quarter: number;
  province: number | undefined;
}

const OutputFormat = ({ data }: { data: Data }) => {
  const { year, quarter, province } = data;
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CompanyReport[]>([]);
  const [excelData, setExcelData] = useState<any>([]);
  const router = useRouter();
  const session = useClientSession();

  useEffect(() => {
    if (province) {
      getTableData();
    } else {
      router.push("/denied?code=3");
    }
  }, []);

  const getTableData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/report", {
        params: {
          quarter,
          province,
          year,
        },
        headers: { authorization: session?.user.accessToken },
      });

      if (res.status === 200) {
        const report: CompanyReport[] = res.data;
        const report_res = [];
        const data = [];
        for (const item of report) {
          report_res.push({ ...item, key: item.ID });
          data.push([
            item.NO,
            item.ID,
            item.TSIC_R,
            item.SIZE_R,
            item.TITLE,
            item.FIRSTNAME,
            item.LASTNAME,
            item.EST_TITLE,
            item.EST_NAME,
            item.ADD_NO,
            item.BUILDING,
            item.ROOM,
            item.STREET,
            item.BLK,
            item.SOI,
            item.SUB_DIST,
            item.DISTRICT,
            item.CWT,
            item.POST_CODE,
            item.TEL_NO,
            item.E_MAIL,
            item.ENU,
            item.ANSWER,
            item.TSIC_CHG,
          ]);
        }
        setResponse(report_res);
        setExcelData(data);
      }
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "ลำดับที่",
      dataIndex: "NO",
      key: "NO",
      align: "center",
    },
    {
      title: "เลขประจำสถานประกอบการ",
      dataIndex: "ID",
      key: "ID",
      align: "center",
    },
    {
      title: "รหัสกิจกรรมทางเศรษฐกิจ",
      dataIndex: "TSIC_R",
      key: "TSIC_R",
      align: "center",
    },
    {
      title: "กลุ่มที่",
      dataIndex: "SIZE_R",
      key: "SIZE_R",
      align: "center",
    },
    {
      title: "ชื่อสถานประกอบการ/ผู้ประกอบการ",
      children: [
        {
          title: "คำนำหน้าชื่อผู้ประกอบการ",
          dataIndex: "TITLE",
          key: "TITLE",
          align: "center",
        },
        {
          title: "ชื่อตัว",
          dataIndex: "FIRSTNAME",
          key: "FIRSTNAME",
          align: "center",
        },
        {
          title: "ชื่อสกุล",
          dataIndex: "LASTNAME",
          key: "LASTNAME",
          align: "center",
        },
        {
          title: "คำนำหน้าชื่อสถานประกอบการ",
          dataIndex: "EST_TITLE",
          key: "EST_TITLE",
          align: "center",
        },
        {
          title: "ชื่อสถานประกอบการ",
          dataIndex: "EST_NAME",
          key: "EST_NAME",
          align: "center",
        },
      ],
    },
    {
      title: "เลขที่",
      dataIndex: "ADD_NO",
      key: "ADD_NO",
      align: "center",
    },
    {
      title: "ชื่ออาคาร/หมู่บ้าน",
      dataIndex: "BUILDING",
      key: "BUILDING",
      align: "center",
    },
    {
      title: "ห้องเลขที่/ชั้นที่",
      dataIndex: "ROOM",
      key: "ROOM",
      align: "center",
    },
    {
      title: "ถนน",
      dataIndex: "STREET",
      key: "STREET",
      align: "center",
    },
    {
      title: "ตรอก",
      dataIndex: "BLK",
      key: "BLK",
      align: "center",
    },
    {
      title: "ซอย",
      dataIndex: "SOI",
      key: "SOI",
      align: "center",
    },
    {
      title: "ตำบล/แขวง",
      dataIndex: "SUB_DIST",
      key: "SUB_DIST",
      align: "center",
    },
    {
      title: "อำเภอ/เขต",
      dataIndex: "DISTRICT",
      key: "DISTRICT",
      align: "center",
    },
    {
      title: "จังหวัด",
      dataIndex: "CWT",
      key: "CWT",
      align: "center",
    },
    {
      title: "รหัสไปรษณีย์",
      dataIndex: "POST_CODE",
      key: "POST_CODE",
      align: "center",
    },
    {
      title: "โทรศัพท์",
      dataIndex: "TEL_NO",
      key: "TEL_NO",
      align: "center",
    },
    {
      title: "อีเมล",
      dataIndex: "E_MAIL",
      key: "E_MAIL",
      align: "center",
    },
    {
      title: "ผลการแจงนับ",
      dataIndex: "ENU",
      key: "ENU",
      align: "center",
    },
    {
      title: "วิธีการตอบแบบสอบถาม",
      dataIndex: "ANSWER",
      key: "ANSWER",
      align: "center",
    },
    {
      title: "TSIC_นอกข่าย",
      dataIndex: "TSIC_CHG",
      key: "TSIC_CHG",
      align: "center",
      render: (x) => isNull(x),
    },
  ];

  const handleDownload = () => {
    const workbook = XLSX.read(base64, { type: "base64" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const cellRef = XLSX.utils.encode_cell({ c: 0, r: 5 });
    // add new cell
    XLSX.utils.sheet_add_aoa(sheet, excelData, { origin: cellRef });
    XLSX.utils.sheet_add_aoa(sheet, [[province]], { origin: "B4" });
    XLSX.utils.sheet_add_aoa(sheet, [[quarter]], { origin: "X4" });
    XLSX.utils.sheet_add_aoa(
      sheet,
      [[`โครงการสำรวจยอดขายรายไตรมาส พ.ศ.25${year}`]],
      { origin: "A2" }
    );

    XLSX.writeFile(workbook, `outformat${year}-${quarter}-${province}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1>ตาราง Output Format Specification</h1>
        <Button secondary loading={loading} onClick={handleDownload}>
          <IoCloudDownloadOutline className="mr-1" />
          ดาวน์โหลด
        </Button>
      </div>
      {loading ? (
        <Loading type="partial" />
      ) : (
        <Table
          columns={columns}
          dataSource={response}
          bordered
          size="middle"
          scroll={{ x: "calc(2000px + 50%)" }}
          showSorterTooltip={false}
          pagination={{
            defaultPageSize: 100,
          }}
        />
      )}
    </div>
  );
};

export default OutputFormat;
