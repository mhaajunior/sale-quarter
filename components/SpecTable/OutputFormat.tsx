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
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { createOuterBorder } from "@/lib/excel";

interface Data {
  year: number;
  quarter: number;
  province: number | null;
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
        const excel = [];
        for (const item of report) {
          report_res.push({ ...item, key: item.ID });
          excel.push([
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
            isNull(item.TSIC_CHG),
          ]);
        }
        setResponse(report_res);
        setExcelData(excel);
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

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Output Format", {
      views: [{ showGridLines: false }],
      properties: { defaultRowHeight: 30, defaultColWidth: 15 },
    });

    worksheet.mergeCells("A1:X2");
    worksheet.getCell(
      "A1"
    ).value = `บัญชีรายชื่อสถานประกอบการตัวอย่าง\r\nโครงการสำรวจยอดขายรายไตรมาส พ.ศ.25${year}`;
    worksheet.getCell("A1").font = {
      bold: true,
      name: "TH SarabunPSK",
      size: 18,
    };
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    worksheet.getCell("A4").value = "จังหวัด";
    worksheet.getCell("B4").value = province;
    worksheet.getCell("X4").value = "ไตรมาส";
    worksheet.getCell("Y4").value = `${quarter}/25${year}`;
    worksheet.getRow(4).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(4).alignment = { horizontal: "left" };
    worksheet.getRow(5).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(5).alignment = { vertical: "top", horizontal: "center" };
    worksheet.getRow(6).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(6).alignment = { vertical: "top", horizontal: "center" };
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 25;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(11).width = 25;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(16).width = 20;
    worksheet.getColumn(17).width = 20;
    worksheet.getColumn(21).width = 20;
    worksheet.getColumn(23).width = 20;

    worksheet.mergeCells("A5:A6");
    worksheet.getCell("A5").value = "ลำดับที่";
    worksheet.getCell("A5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("A5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("B5:B6");
    worksheet.getCell("B5").value = "เลขประจำสถานประกอบการ";
    worksheet.getCell("B5").alignment = {
      vertical: "top",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("B5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("C5:C6");
    worksheet.getCell("C5").value = "รหัสกิจกรรมทางเศรษฐกิจ";
    worksheet.getCell("C5").alignment = {
      vertical: "top",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("C5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("D5:D6");
    worksheet.getCell("D5").value = "กลุ่มที่";
    worksheet.getCell("D5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("D5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("E5:I5");
    worksheet.getCell("E5").value = "ชื่อสถานประกอบการ/ผู้ประกอบการ";
    worksheet.getCell("E5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("E5").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell("E6").value = "คำนำหน้าชื่อผู้ประกอบการ";
    worksheet.getCell("E6").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("F6").value = "ชื่อตัว";
    worksheet.getCell("F6").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("G6").value = "ชื่อสกุล";
    worksheet.getCell("G6").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("H6").value = "คำนำหน้าชื่อสถานประกอบการ";
    worksheet.getCell("H6").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("I6").value = "ชื่อสถานประกอบการ";
    worksheet.getCell("I6").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("J5:J6");
    worksheet.getCell("J5").value = "เลขที่";
    worksheet.getCell("J5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("J5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("K5:K6");
    worksheet.getCell("K5").value = "ชื่ออาคาร/หมู่บ้าน";
    worksheet.getCell("K5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("K5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("L5:L6");
    worksheet.getCell("L5").value = "ห้องเลขที่/ชั้นที่";
    worksheet.getCell("L5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("L5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("M5:M6");
    worksheet.getCell("M5").value = "ถนน";
    worksheet.getCell("M5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("M5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("N5:N6");
    worksheet.getCell("N5").value = "ตรอก";
    worksheet.getCell("N5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("N5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("O5:O6");
    worksheet.getCell("O5").value = "ซอย";
    worksheet.getCell("O5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("O5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("P5:P6");
    worksheet.getCell("P5").value = "ตำบล/แขวง";
    worksheet.getCell("P5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("P5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("Q5:Q6");
    worksheet.getCell("Q5").value = "อำเภอ/เขต";
    worksheet.getCell("Q5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("Q5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("R5:R6");
    worksheet.getCell("R5").value = "จังหวัด";
    worksheet.getCell("R5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("R5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("S5:S6");
    worksheet.getCell("S5").value = "รหัสไปรษณีย์";
    worksheet.getCell("S5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("S5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("T5:T6");
    worksheet.getCell("T5").value = "โทรศัพท์";
    worksheet.getCell("T5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("T5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("U5:U6");
    worksheet.getCell("U5").value = "อีเมล";
    worksheet.getCell("U5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("U5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("V5:V6");
    worksheet.getCell("V5").value = "ผลการแจงนับ";
    worksheet.getCell("V5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("V5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("W5:W6");
    worksheet.getCell("W5").value = "วิธีการตอบแบบสอบถาม";
    worksheet.getCell("W5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("W5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("X5:X6");
    worksheet.getCell("X5").value = "TSIC_นอกข่าย";
    worksheet.getCell("X5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("X5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("Y5:Y6");
    worksheet.getCell("Y5").value = "หมายเหตุ";
    worksheet.getCell("Y5").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("Y5").border = {
      bottom: { style: "thin" },
    };

    for (let i = 0; i < excelData.length; i++) {
      let lastRow = worksheet.lastRow!.number;
      let insertRow = ++lastRow;
      let getRowInsert = worksheet.getRow(insertRow);
      getRowInsert.values = excelData[i];
      getRowInsert.font = { name: "TH SarabunPSK", size: 16 };
      getRowInsert.alignment = { horizontal: "left" };
    }

    let lastRow = worksheet.lastRow!.number;
    createOuterBorder(worksheet, [1, 5], [25, lastRow]);

    const buffer = await workbook.xlsx.writeBuffer();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const fileExtension = ".xlsx";

    const blob = new Blob([buffer], { type: fileType });

    saveAs(
      blob,
      `output_format-${year}-${quarter}-${province}` + fileExtension
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1>ตารางบัญชีรายชื่อสถานประกอบการตัวอย่าง</h1>
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
          scroll={{ x: "calc(2200px + 50%)" }}
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
