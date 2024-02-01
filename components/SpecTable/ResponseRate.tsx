"use client";

import useClientSession from "@/hooks/use-client-session";
import { errorHandler } from "@/lib/errorHandler";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import Button from "../Button";
import { IoCloudDownloadOutline } from "react-icons/io5";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";

interface Data {
  year: number;
  quarter: number;
  province: number | null;
}

interface DataType {
  key: React.Key;
  QTR: number;
  total_count: string;
  total_percent: string;
  countable_count: string;
  countable_percent: string;
  uncountable_count: string;
  uncountable_percent: string;
  enu2_count: string;
  enu2_percent: string;
  enu3_count: string;
  enu3_percent: string;
  enu4_count: string;
  enu4_percent: string;
  enu5_count: string;
  enu5_percent: string;
  enu6_count: string;
  enu6_percent: string;
  enu7_percent: string;
  enu7_count: string;
  enu8_count: string;
  enu8_percent: string;
  enu9_count: string;
  enu9_percent: string;
  enu10_count: string;
  enu10_percent: string;
  enu11_count: string;
  enu11_percent: string;
}

const ResponseRate = ({ data }: { data: Data }) => {
  const { year, province } = data;
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DataType[]>([]);
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
      const res = await axios.get("/api/specification/response_rate", {
        params: {
          province,
          year,
        },
        headers: { authorization: session?.user.accessToken },
      });

      if (res.status === 200) {
        const report: any = res.data;
        const report_res: DataType[] = [];
        const excel = [];
        for (const [key, value] of Object.entries(report)) {
          const v: any = value;
          report_res.push({
            key: key,
            QTR: Number(key),
            total_count: v.total,
            total_percent: "100.00",
            countable_count: v.response[1] ? v.response[1].count : 0,
            countable_percent: v.response[1] ? v.response[1].percent : "0.00",
            uncountable_count: v.uncountable,
            uncountable_percent:
              v.total > 0
                ? ((v.uncountable / v.total) * 100).toFixed(2)
                : "0.00",
            enu2_count: v.response[2] ? v.response[2].count : 0,
            enu2_percent: v.response[2] ? v.response[2].percent : "0.00",
            enu3_count: v.response[3] ? v.response[3].count : 0,
            enu3_percent: v.response[3] ? v.response[3].percent : "0.00",
            enu4_count: v.response[4] ? v.response[4].count : 0,
            enu4_percent: v.response[4] ? v.response[4].percent : "0.00",
            enu5_count: v.response[5] ? v.response[5].count : 0,
            enu5_percent: v.response[5] ? v.response[5].percent : "0.00",
            enu6_count: v.response[6] ? v.response[6].count : 0,
            enu6_percent: v.response[6] ? v.response[6].percent : "0.00",
            enu7_count: v.response[7] ? v.response[7].count : 0,
            enu7_percent: v.response[7] ? v.response[7].percent : "0.00",
            enu8_count: v.response[8] ? v.response[8].count : 0,
            enu8_percent: v.response[8] ? v.response[8].percent : "0.00",
            enu9_count: v.response[9] ? v.response[9].count : 0,
            enu9_percent: v.response[9] ? v.response[9].percent : "0.00",
            enu10_count: v.response[10] ? v.response[10].count : 0,
            enu10_percent: v.response[10] ? v.response[10].percent : "0.00",
            enu11_count: v.response[11] ? v.response[11].count : 0,
            enu11_percent: v.response[11] ? v.response[11].percent : "0.00",
          });
          excel.push([
            Number(key),
            v.total,
            "100.00",
            v.response[1] ? v.response[1].count : 0,
            v.response[1] ? v.response[1].percent : "0.00",
            v.uncountable,
            v.total > 0 ? ((v.uncountable / v.total) * 100).toFixed(2) : "0.00",
            v.response[2] ? v.response[2].count : 0,
            v.response[2] ? v.response[2].percent : "0.00",
            v.response[3] ? v.response[3].count : 0,
            v.response[3] ? v.response[3].percent : "0.00",
            v.response[4] ? v.response[4].count : 0,
            v.response[4] ? v.response[4].percent : "0.00",
            v.response[5] ? v.response[5].count : 0,
            v.response[5] ? v.response[5].percent : "0.00",
            v.response[6] ? v.response[6].count : 0,
            v.response[6] ? v.response[6].percent : "0.00",
            v.response[7] ? v.response[7].count : 0,
            v.response[7] ? v.response[7].percent : "0.00",
            v.response[8] ? v.response[8].count : 0,
            v.response[8] ? v.response[8].percent : "0.00",
            v.response[9] ? v.response[9].count : 0,
            v.response[9] ? v.response[9].percent : "0.00",
            v.response[10] ? v.response[10].count : 0,
            v.response[10] ? v.response[10].percent : "0.00",
            v.response[11] ? v.response[11].count : 0,
            v.response[11] ? v.response[11].percent : "0.00",
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
      title: "ไตรมาส",
      dataIndex: "QTR",
      key: "QTR",
      align: "center",
      width: "3%",
    },
    {
      title: `ปริมาณงานทั้งสิ้นปี 25${year}`,
      children: [
        {
          title: "จำนวน",
          dataIndex: "total_count",
          key: "total_count",
          align: "center",
          width: "3%",
        },
        {
          title: "%",
          dataIndex: "total_percent",
          key: "total_percent",
          align: "center",
          width: "3%",
        },
      ],
    },
    {
      title: "ผลการแจงนับ",
      children: [
        {
          title: "แจงนับได้ (ENU = 1)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "countable_count",
              key: "countable_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "countable_percent",
              key: "countable_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
        {
          title: "แจงนับไม่ได้ (ENU = 2-11)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "uncountable_count",
              key: "uncountable_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "uncountable_percent",
              key: "uncountable_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
      ],
    },
    {
      title: "สาเหตุที่แจงนับไม่ได้",
      children: [
        {
          title: "ย้าย/หาไม่พบ (ENU = 2)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "enu2_count",
              key: "enu2_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "enu2_percent",
              key: "enu2_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
        {
          title: "เลิกกิจการ (ENU = 3)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "enu3_count",
              key: "enu3_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "enu3_percent",
              key: "enu3_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
        {
          title: "รื้อถอน/ไฟไหม้ (ENU = 4)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "enu4_count",
              key: "enu4_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "enu4_percent",
              key: "enu4_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
        {
          title: "ไม่ให้ความร่วมมือ (ENU = 5)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "enu5_count",
              key: "enu5_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "enu5_percent",
              key: "enu5_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
        {
          title: "หยุดกิจการชั่วคราว (ENU = 6)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "enu6_count",
              key: "enu6_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "enu6_percent",
              key: "enu6_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
        {
          title: "ซ้ำกับลำดับที่... (ENU = 7)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "enu7_count",
              key: "enu7_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "enu7_percent",
              key: "enu7_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
        {
          title: "เป็นสถานประกอบการแต่ไม่อยู่ในคุ้มรวม (ENU = 8)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "enu8_count",
              key: "enu8_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "enu8_percent",
              key: "enu8_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
        {
          title: "ข้อมูลอยู่สำนักงานใหญ่ (ENU = 9)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "enu9_count",
              key: "enu9_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "enu9_percent",
              key: "enu9_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
        {
          title: "ไม่เป็นสถานประกอบการ (ENU = 10)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "enu10_count",
              key: "enu10_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "enu10_percent",
              key: "enu10_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
        {
          title: "ผลัดส่ง (ENU = 11)",
          children: [
            {
              title: "จำนวน",
              dataIndex: "enu11_count",
              key: "enu11_count",
              align: "center",
              width: "3%",
            },
            {
              title: "%",
              dataIndex: "enu11_percent",
              key: "enu11_percent",
              align: "center",
              width: "3%",
            },
          ],
        },
      ],
    },
  ];

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Response Rate", {
      views: [{ showGridLines: false }],
      properties: { defaultRowHeight: 30 },
    });

    worksheet.mergeCells("A1:AA1");
    worksheet.getCell("A1").value = "Response Rate Specification";
    worksheet.getCell("A1").font = {
      bold: true,
      size: 14,
    };
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.mergeCells("A3:J3");
    worksheet.getCell("A3").value =
      " ตาราง  จำนวนและร้อยละของสถานประกอบการ จำแนกตามผลการแจงนับ";
    worksheet.getCell("A3").font = {
      bold: true,
      name: "TH SarabunPSK",
      size: 16,
    };

    // worksheet.columns = [
    //   { header: "Id", key: "id", width: 10 },
    //   { header: "Name", key: "name", width: 32 },
    //   { header: "D.O.B.", key: "dob", width: 15 },
    // ];

    const buffer = await workbook.xlsx.writeBuffer();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const fileExtension = ".xlsx";

    const blob = new Blob([buffer], { type: fileType });

    saveAs(blob, `response_rate-${year}-${province}` + fileExtension);

    // const workbook = XLSX.read(base64, { type: "base64" });
    // const firstSheetName = workbook.SheetNames[0];
    // const sheet = workbook.Sheets[firstSheetName];
    // const cellRef = XLSX.utils.encode_cell({ c: 0, r: 12 });
    // // add new cell
    // XLSX.utils.sheet_add_aoa(sheet, excelData, { origin: cellRef });
    // XLSX.utils.sheet_add_aoa(sheet, [[province]], { origin: "Y5" });
    // XLSX.writeFile(workbook, `response_rate-${year}-${province}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1>ตารางอัตราการตอบกลับของข้อมูล</h1>
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

export default ResponseRate;
