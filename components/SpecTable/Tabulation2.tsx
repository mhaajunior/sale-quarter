"use client";

import useClientSession from "@/hooks/use-client-session";
import { isNull, numberWithCommas, shouldAddStar } from "@/lib/common";
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
import { createOuterBorder } from "@/lib/excel";

interface Data {
  year: number;
  quarter: number;
  province: number | null;
}

interface DataType {
  key: React.Key;
  NO: string;
  EST_NAME: string;
  TSIC_R: number;
  SIZE_R: string;
  TR_QTR1: string;
  TR_QTR2: string;
  TR_QTR3: string;
  TR_QTR4: string;
  STO_QTR1: string;
  STO_QTR2: string;
  STO_QTR3: string;
  STO_QTR4: string;
}

const Tabulation2 = ({ data }: { data: Data }) => {
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
      const res = await axios.get("/api/specification/tabulation", {
        params: {
          province,
          year,
        },
        headers: { authorization: session?.user.accessToken },
      });

      if (res.status === 200) {
        const report_res: DataType[] = [];
        const excel = [];
        for (const item of res.data) {
          report_res.push({
            key: item.NO,
            NO: item.NO,
            EST_NAME: isNull(item.EST_NAME),
            TSIC_R: item.TSIC_R,
            SIZE_R: item.SIZE_R,
            TR_QTR1: item.TR_chg[0]
              ? numberWithCommas(item.TR_chg[0].toFixed(2))
              : "-",
            TR_QTR2: item.TR_chg[1]
              ? numberWithCommas(item.TR_chg[1].toFixed(2))
              : "-",
            TR_QTR3: item.TR_chg[2]
              ? numberWithCommas(item.TR_chg[2].toFixed(2))
              : "-",
            TR_QTR4: item.TR_chg[3]
              ? numberWithCommas(item.TR_chg[3].toFixed(2))
              : "-",
            STO_QTR1: item.STO_chg[0]
              ? numberWithCommas(item.STO_chg[0].toFixed(2))
              : "-",
            STO_QTR2: item.STO_chg[1]
              ? numberWithCommas(item.STO_chg[1].toFixed(2))
              : "-",
            STO_QTR3: item.STO_chg[2]
              ? numberWithCommas(item.STO_chg[2].toFixed(2))
              : "-",
            STO_QTR4: item.STO_chg[3]
              ? numberWithCommas(item.STO_chg[3].toFixed(2))
              : "-",
          });
          excel.push([
            item.NO,
            isNull(item.EST_NAME),
            item.TSIC_R,
            item.SIZE_R,
            item.TR_chg[0]
              ? numberWithCommas(item.TR_chg[0].toFixed(2)) +
                shouldAddStar(item.TR_chg[0], item.TSIC_R)
              : "-",
            item.TR_chg[1]
              ? numberWithCommas(item.TR_chg[1].toFixed(2)) +
                shouldAddStar(item.TR_chg[1], item.TSIC_R)
              : "-",
            item.TR_chg[2]
              ? numberWithCommas(item.TR_chg[2].toFixed(2)) +
                shouldAddStar(item.TR_chg[2], item.TSIC_R)
              : "-",
            item.TR_chg[3]
              ? numberWithCommas(item.TR_chg[3].toFixed(2)) +
                shouldAddStar(item.TR_chg[3], item.TSIC_R)
              : "-",
            item.STO_chg[0]
              ? numberWithCommas(item.STO_chg[0].toFixed(2)) +
                shouldAddStar(item.STO_chg[0], item.TSIC_R)
              : "-",
            item.STO_chg[1]
              ? numberWithCommas(item.STO_chg[1].toFixed(2)) +
                shouldAddStar(item.STO_chg[1], item.TSIC_R)
              : "-",
            item.STO_chg[2]
              ? numberWithCommas(item.STO_chg[2].toFixed(2)) +
                shouldAddStar(item.STO_chg[2], item.TSIC_R)
              : "-",
            item.STO_chg[3]
              ? numberWithCommas(item.STO_chg[3].toFixed(2)) +
                shouldAddStar(item.STO_chg[3], item.TSIC_R)
              : "-",
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
      title: "ชื่อสถานประกอบการ",
      dataIndex: "EST_NAME",
      key: "EST_NAME",
      align: "center",
      width: "16%",
    },
    {
      title: "รหัสตามมาตรฐานอุตสาหกรรมฯ\n(TSIC_R)",
      dataIndex: "TSIC_R",
      key: "TSIC_R",
      align: "center",
      width: "13%",
    },
    {
      title: "ขนาด\n(SIZE_R)",
      dataIndex: "SIZE_R",
      key: "SIZE_R",
      align: "center",
    },
    {
      title: `ร้อยละการเปลี่ยนแปลงของยอดขาย/รายรับปี 25${year}`,
      children: [
        {
          title: "ไตรมาส 1",
          dataIndex: "TR_QTR1",
          key: "TR_QTR1",
          align: "center",
        },
        {
          title: "ไตรมาส 2",
          dataIndex: "TR_QTR2",
          key: "TR_QTR2",
          align: "center",
        },
        {
          title: "ไตรมาส 3",
          dataIndex: "TR_QTR3",
          key: "TR_QTR3",
          align: "center",
        },
        {
          title: "ไตรมาส 4",
          dataIndex: "TR_QTR4",
          key: "TR_QTR4",
          align: "center",
        },
      ],
    },
    {
      title: `ร้อยละการเปลี่ยนแปลงของมูลค่าสินค้าคงเหลือปี 25${year}`,
      children: [
        {
          title: "ไตรมาส 1",
          dataIndex: "STO_QTR1",
          key: "STO_QTR1",
          align: "center",
        },
        {
          title: "ไตรมาส 2",
          dataIndex: "STO_QTR2",
          key: "STO_QTR2",
          align: "center",
        },
        {
          title: "ไตรมาส 3",
          dataIndex: "STO_QTR3",
          key: "STO_QTR3",
          align: "center",
        },
        {
          title: "ไตรมาส 4",
          dataIndex: "STO_QTR4",
          key: "STO_QTR4",
          align: "center",
        },
      ],
    },
  ];

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tabulation 2", {
      views: [{ showGridLines: false }],
      properties: { defaultRowHeight: 30, defaultColWidth: 15 },
    });

    worksheet.mergeCells("A1:O1");
    worksheet.getCell("A1").value =
      "ตาราง ข ตรวจสอบร้อยละของการเปลี่ยนแปลงรายรับจากการขายและสินค้าคงเหลือเป็นรายไตรมาส";
    worksheet.getCell("A1").font = {
      bold: true,
      name: "TH SarabunPSK",
      size: 18,
    };

    worksheet.getCell("A2").value = "จังหวัด";
    worksheet.getCell("B2").value = province;
    worksheet.getCell("M2").value = `ปี 25${year}`;
    worksheet.getRow(2).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(2).alignment = { horizontal: "left" };
    worksheet.getRow(4).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(4).alignment = { vertical: "top", horizontal: "center" };
    worksheet.getRow(5).font = { name: "TH SarabunPSK", size: 16 };
    worksheet.getRow(5).alignment = { vertical: "top", horizontal: "center" };
    worksheet.getColumn(2).width = 25;

    worksheet.mergeCells("A4:A5");
    worksheet.getCell("A4").value = "ลำดับที่\r\nNO";
    worksheet.getCell("A5").alignment = {
      vertical: "top",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("A5").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("B4:B5");
    worksheet.getCell("B4").value = "ชื่อสถานประกอบการ\r\nEST_NAME";
    worksheet.getCell("B4").alignment = {
      vertical: "top",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("B4").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("C4:C5");
    worksheet.getCell("C4").value = "รหัสตามมาตรฐานอุตสาหกรรมฯ\r\nTSIC_R";
    worksheet.getCell("C4").alignment = {
      vertical: "top",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("C4").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("D4:D5");
    worksheet.getCell("D4").value = "ขนาด\r\nSIZE_R";
    worksheet.getCell("D4").alignment = {
      vertical: "top",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("D4").border = {
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells("E4:H4");
    worksheet.getCell(
      "E4"
    ).value = `ร้อยละการเปลี่ยนแปลงของยอดขาย/รายรับปี 25${year}`;
    worksheet.getCell("E4").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("E4").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.mergeCells("I4:L4");
    worksheet.getCell(
      "I4"
    ).value = `ร้อยละการเปลี่ยนแปลงของมูลค่าสินค้าคงเหลือปี 25${year}`;
    worksheet.getCell("I4").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("I4").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell("E5").value = "ไตรมาส 1 (QTR1)";
    worksheet.getCell("E5").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("E5").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell("F5").value = "ไตรมาส 2 (QTR2)";
    worksheet.getCell("F5").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("F5").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell("G5").value = "ไตรมาส 3 (QTR3)";
    worksheet.getCell("G5").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("G5").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell("H5").value = "ไตรมาส 4 (QTR4)";
    worksheet.getCell("H5").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("H5").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell("I5").value = "ไตรมาส 1 (QTR1)";
    worksheet.getCell("I5").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("I5").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell("J5").value = "ไตรมาส 2 (QTR2)";
    worksheet.getCell("J5").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("J5").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell("K5").value = "ไตรมาส 3 (QTR3)";
    worksheet.getCell("K5").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("K5").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell("L5").value = "ไตรมาส 4 (QTR4)";
    worksheet.getCell("L5").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("L5").border = {
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.mergeCells("M4:M5");
    worksheet.getCell("M4").value = "หมายเหตุ";
    worksheet.getCell("M4").alignment = {
      vertical: "top",
      horizontal: "center",
    };
    worksheet.getCell("M4").border = {
      bottom: { style: "thin" },
    };

    for (let i = 0; i < excelData.length; i++) {
      let lastRow = worksheet.lastRow!.number;
      let insertRow = ++lastRow;
      let getRowInsert = worksheet.getRow(insertRow);
      getRowInsert.values = excelData[i];
      getRowInsert.font = { name: "TH SarabunPSK", size: 16 };
      getRowInsert.alignment = { horizontal: "left" };
      getRowInsert.eachCell(function (cell, colNumber) {
        if (colNumber >= 5) {
          cell.alignment = { horizontal: "right" };
        }
      });
    }

    let lastRow = worksheet.lastRow!.number;
    createOuterBorder(worksheet, [1, 4], [13, lastRow]);

    const buffer = await workbook.xlsx.writeBuffer();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const fileExtension = ".xlsx";

    const blob = new Blob([buffer], { type: fileType });

    saveAs(blob, `tabulation2-${year}-${province}` + fileExtension);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1>ตาราง ข</h1>
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
          scroll={{ x: "calc(1200px + 50%)" }}
          style={{ whiteSpace: "pre" }}
          showSorterTooltip={false}
          pagination={{
            defaultPageSize: 100,
          }}
        />
      )}
    </div>
  );
};

export default Tabulation2;
