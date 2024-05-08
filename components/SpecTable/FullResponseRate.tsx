"use client";

import useClientSession from "@/hooks/use-client-session";
import { errorHandler } from "@/lib/errorHandler";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Loading from "../Loading";
import Button from "../Button";
import { IoCloudDownloadOutline } from "react-icons/io5";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { createOuterBorder } from "@/lib/excel";
import { FilterContext } from "@/context";
import { QuarterArr } from "@/types/dto/common";
import { quarterMap } from "@/lib/quarter";
import moment from "moment";
import Badge from "../Badge";
import { mapProvinceName } from "@/utils/province";

interface DataType {
  key: React.Key;
  province: string;
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

const FullResponseRate = () => {
  const { year, quarter, setQuarter } = useContext(FilterContext);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DataType[]>([]);
  const [excelData, setExcelData] = useState<any>([]);
  const session = useClientSession();

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/specification/full_response_rate", {
        params: {
          year,
          quarter,
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
            province:
              mapProvinceName[Number(key) as keyof typeof mapProvinceName],
            total_count: v.total,
            total_percent: "100.00",
            countable_count: v.response[1] ? v.response[1].count : "-",
            countable_percent: v.response[1] ? v.response[1].percent : "-",
            uncountable_count: v.uncountable > 0 ? v.uncountable : "-",
            uncountable_percent:
              v.total > 0 && v.uncountable
                ? ((v.uncountable / v.total) * 100).toFixed(2)
                : "-",
            enu2_count: v.response[2] ? v.response[2].count : "-",
            enu2_percent: v.response[2] ? v.response[2].percent : "-",
            enu3_count: v.response[3] ? v.response[3].count : "-",
            enu3_percent: v.response[3] ? v.response[3].percent : "-",
            enu4_count: v.response[4] ? v.response[4].count : "-",
            enu4_percent: v.response[4] ? v.response[4].percent : "-",
            enu5_count: v.response[5] ? v.response[5].count : "-",
            enu5_percent: v.response[5] ? v.response[5].percent : "-",
            enu6_count: v.response[6] ? v.response[6].count : "-",
            enu6_percent: v.response[6] ? v.response[6].percent : "-",
            enu7_count: v.response[7] ? v.response[7].count : "-",
            enu7_percent: v.response[7] ? v.response[7].percent : "-",
            enu8_count: v.response[8] ? v.response[8].count : "-",
            enu8_percent: v.response[8] ? v.response[8].percent : "-",
            enu9_count: v.response[9] ? v.response[9].count : "-",
            enu9_percent: v.response[9] ? v.response[9].percent : "-",
            enu10_count: v.response[10] ? v.response[10].count : "-",
            enu10_percent: v.response[10] ? v.response[10].percent : "-",
            enu11_count: v.response[11] ? v.response[11].count : "-",
            enu11_percent: v.response[11] ? v.response[11].percent : "-",
          });
          excel.push([
            mapProvinceName[Number(key) as keyof typeof mapProvinceName],
            v.total,
            "100.00",
            v.response[1] ? v.response[1].count : "-",
            v.response[1] ? v.response[1].percent : "-",
            v.uncountable > 0 ? v.uncountable : "-",
            v.total > 0 && v.uncountable
              ? ((v.uncountable / v.total) * 100).toFixed(2)
              : "-",
            v.response[2] ? v.response[2].count : "-",
            v.response[2] ? v.response[2].percent : "-",
            v.response[3] ? v.response[3].count : "-",
            v.response[3] ? v.response[3].percent : "-",
            v.response[4] ? v.response[4].count : "-",
            v.response[4] ? v.response[4].percent : "-",
            v.response[5] ? v.response[5].count : "-",
            v.response[5] ? v.response[5].percent : "-",
            v.response[6] ? v.response[6].count : "-",
            v.response[6] ? v.response[6].percent : "-",
            v.response[7] ? v.response[7].count : "-",
            v.response[7] ? v.response[7].percent : "-",
            v.response[8] ? v.response[8].count : "-",
            v.response[8] ? v.response[8].percent : "-",
            v.response[9] ? v.response[9].count : "-",
            v.response[9] ? v.response[9].percent : "-",
            v.response[10] ? v.response[10].count : "-",
            v.response[10] ? v.response[10].percent : "-",
            v.response[11] ? v.response[11].count : "-",
            v.response[11] ? v.response[11].percent : "-",
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
      title: "ภาค/จังหวัด",
      dataIndex: "province",
      key: "province",
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

  const quarterArr: QuarterArr[] = [];
  for (let i = 1; i <= 4; i++) {
    let passOpenDate = false;
    const res = quarterMap(Number("25" + year) - 543);
    const startDate = moment(res[i - 1].formSubmittedRange[0]);
    const now = moment();

    if (now >= startDate) {
      passOpenDate = true;
    }
    quarterArr.push({
      label: "ไตรมาสที่ " + i,
      value: i,
      color: "black",
      passOpenDate,
    });
  }

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Response Rate", {
      views: [{ showGridLines: false }],
      properties: { defaultRowHeight: 30 },
    });

    worksheet.getColumn(1).width = 20;

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
      "ตาราง  จำนวนและร้อยละของสถานประกอบการ จำแนกตามผลการแจงนับ เป็นรายภาคและทั่วประเทศ";
    worksheet.getCell("A3").font = {
      bold: true,
      name: "TH SarabunPSK",
      size: 16,
    };

    worksheet.getCell("Z5").value = "ไตรมาส";
    worksheet.getCell("Z5").font = {
      bold: true,
      name: "TH SarabunPSK",
      size: 14,
    };
    worksheet.getCell("AA5").value = quarter;
    worksheet.getCell("AA5").font = {
      bold: true,
      name: "TH SarabunPSK",
      size: 14,
    };

    worksheet.getRow(5).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(6).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(7).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(8).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(9).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(9).alignment = { horizontal: "center" };

    worksheet.mergeCells("A6:A9");
    worksheet.getCell("A6").value = "ภาค/จังหวัด";
    worksheet.getCell("A6").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("A6").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("B6:C8");
    worksheet.getCell("B6").value = `ปริมาณงานทั้งสิ้น\r\nปี 25${year}`;
    worksheet.getCell("B6").alignment = {
      vertical: "top",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("B6").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("D6:G6");
    worksheet.getCell("D6").value = "ผลการแจงนับ";
    worksheet.getCell("D6").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("D6").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("D7:E8");
    worksheet.getCell("D7").value = "แจงนับได้\r\n(ENU=1)";
    worksheet.getCell("D7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("D7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("F7:G8");
    worksheet.getCell("F7").value = "แจงนับไม่ได้\r\n(ENU=2-11)";
    worksheet.getCell("F7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("F7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("H6:AA6");
    worksheet.getCell("H6").value = "สาเหตุที่แจงนับไม่ได้";
    worksheet.getCell("H6").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("H6").border = {
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("H7:I8");
    worksheet.getCell("H7").value = "ย้าย/หาไม่พบ\r\n(ENU=2)";
    worksheet.getCell("H7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("H7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("J7:K8");
    worksheet.getCell("J7").value = "เลิกกิจการ\r\n(ENU=3)";
    worksheet.getCell("J7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("J7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("L7:M8");
    worksheet.getCell("L7").value = "รื้อถอน/ไฟไหม้\r\n(ENU=4)";
    worksheet.getCell("L7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("L7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("N7:O8");
    worksheet.getCell("N7").value = "ไม่ให้ความร่วมมือ\r\n(ENU=5)";
    worksheet.getCell("N7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("N7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("P7:Q8");
    worksheet.getCell("P7").value = "หยุดกิจการชั่วคราว\r\n(ENU=6)";
    worksheet.getCell("P7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("P7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("R7:S8");
    worksheet.getCell("R7").value = "ซ้ำกับลำดับที่...\r\n(ENU=7)";
    worksheet.getCell("R7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("R7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("T7:U8");
    worksheet.getCell("T7").value =
      "เป็นสถานประกอบการ\r\nแต่ไม่อยู่ในคุ้มรวม\r\n(ENU=8)";
    worksheet.getCell("T7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("T7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("V7:W8");
    worksheet.getCell("V7").value = "ข้อมูลอยู่สำนักงานใหญ่\r\n(ENU=9)";
    worksheet.getCell("V7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("V7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("X7:Y8");
    worksheet.getCell("X7").value = "ไม่เป็นสถานประกอบการ\r\n(ENU=10)";
    worksheet.getCell("X7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("X7").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("Z7:AA8");
    worksheet.getCell("Z7").value = "ผลัดส่ง\r\n(ENU=11)";
    worksheet.getCell("Z7").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("Z7").border = {
      bottom: { style: "thin" },
    };

    // จำนวน
    worksheet.getCell("B9").value = "จำนวน";
    worksheet.getCell("B9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("D9").value = "จำนวน";
    worksheet.getCell("D9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("F9").value = "จำนวน";
    worksheet.getCell("F9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("H9").value = "จำนวน";
    worksheet.getCell("H9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("J9").value = "จำนวน";
    worksheet.getCell("J9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("L9").value = "จำนวน";
    worksheet.getCell("L9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("N9").value = "จำนวน";
    worksheet.getCell("N9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("P9").value = "จำนวน";
    worksheet.getCell("P9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("R9").value = "จำนวน";
    worksheet.getCell("R9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("T9").value = "จำนวน";
    worksheet.getCell("T9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("V9").value = "จำนวน";
    worksheet.getCell("V9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("X9").value = "จำนวน";
    worksheet.getCell("X9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("Z9").value = "จำนวน";
    worksheet.getCell("Z9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    // %
    worksheet.getCell("C9").value = "%";
    worksheet.getCell("C9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("E9").value = "%";
    worksheet.getCell("E9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("G9").value = "%";
    worksheet.getCell("G9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("I9").value = "%";
    worksheet.getCell("I9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("K9").value = "%";
    worksheet.getCell("K9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("M9").value = "%";
    worksheet.getCell("M9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("O9").value = "%";
    worksheet.getCell("O9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("Q9").value = "%";
    worksheet.getCell("Q9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("S9").value = "%";
    worksheet.getCell("S9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("U9").value = "%";
    worksheet.getCell("U9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("W9").value = "%";
    worksheet.getCell("W9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("Y9").value = "%";
    worksheet.getCell("Y9").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.getCell("AA9").value = "%";
    worksheet.getCell("AA9").border = {
      bottom: { style: "thin" },
    };

    for (let i = 0; i < excelData.length; i++) {
      let lastRow = worksheet.lastRow!.number;
      let insertRow = ++lastRow;
      let getRowInsert = worksheet.getRow(insertRow);
      getRowInsert.values = excelData[i];
      getRowInsert.font = { name: "TH SarabunPSK", size: 16 };
      getRowInsert.alignment = { horizontal: "right" };
    }

    worksheet.getColumn(1).alignment = { horizontal: "center" };
    worksheet.getCell("A6").alignment = {
      vertical: "top",
      horizontal: "center",
    };

    let lastRow = worksheet.lastRow!.number;
    createOuterBorder(worksheet, [1, 6], [27, lastRow]);

    const buffer = await workbook.xlsx.writeBuffer();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const fileExtension = ".xlsx";

    const blob = new Blob([buffer], { type: fileType });

    saveAs(blob, `response_rate-${year}` + fileExtension);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1>
          ตารางร้อยละการได้รับความร่วมมือในการตอบแบบสอบถาม (Response Rate)
        </h1>
        <Button secondary loading={loading} onClick={handleDownload}>
          <IoCloudDownloadOutline className="mr-1" />
          ดาวน์โหลด
        </Button>
      </div>
      {loading ? (
        <Loading type="partial" />
      ) : (
        <div className="flex flex-wrap">
          {quarterArr.map((item) => (
            <Badge
              key={item.value}
              color={item.color}
              onClick={() => item.passOpenDate && setQuarter(item.value)}
              active={item.value === quarter}
              disabled={!item.passOpenDate}
            >
              {item.label}
            </Badge>
          ))}
          <Table
            columns={columns}
            dataSource={response}
            bordered
            size="middle"
            scroll={{ x: "calc(2000px + 50%)" }}
            showSorterTooltip={false}
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

export default FullResponseRate;
