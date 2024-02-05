"use client";

import useClientSession from "@/hooks/use-client-session";
import { numberWithCommas } from "@/lib/common";
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

const OutputFormat = ({ data }: { data: Data }) => {
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
      const res = await axios.get("/api/specification/tab1", {
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
            EST_NAME: item.EST_NAME,
            TSIC_R: item.TSIC_R,
            SIZE_R: item.SIZE_R,
            TR_QTR1: item.TR_arr[0] ? numberWithCommas(item.TR_arr[0]) : "-",
            TR_QTR2: item.TR_arr[1] ? numberWithCommas(item.TR_arr[1]) : "-",
            TR_QTR3: item.TR_arr[2] ? numberWithCommas(item.TR_arr[2]) : "-",
            TR_QTR4: item.TR_arr[3] ? numberWithCommas(item.TR_arr[3]) : "-",
            STO_QTR1: item.TR_arr[0] ? numberWithCommas(item.STO_arr[0]) : "-",
            STO_QTR2: item.TR_arr[1] ? numberWithCommas(item.STO_arr[1]) : "-",
            STO_QTR3: item.TR_arr[2] ? numberWithCommas(item.STO_arr[2]) : "-",
            STO_QTR4: item.TR_arr[3] ? numberWithCommas(item.STO_arr[3]) : "-",
          });
          excel.push([
            item.NO,
            item.EST_NAME,
            item.TSIC_R,
            item.SIZE_R,
            item.TR_arr[0] ? numberWithCommas(item.TR_arr[0]) : null,
            item.TR_arr[1] ? numberWithCommas(item.TR_arr[1]) : null,
            item.TR_arr[2] ? numberWithCommas(item.TR_arr[2]) : null,
            item.TR_arr[3] ? numberWithCommas(item.TR_arr[3]) : null,
            item.TR_arr[0] ? numberWithCommas(item.STO_arr[0]) : null,
            item.TR_arr[1] ? numberWithCommas(item.STO_arr[1]) : null,
            item.TR_arr[2] ? numberWithCommas(item.STO_arr[2]) : null,
            item.TR_arr[3] ? numberWithCommas(item.STO_arr[3]) : null,
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
    },
    {
      title: "รหัสตามมาตรฐานอุตสาหกรรมฯ",
      dataIndex: "TSIC_R",
      key: "TSIC_R",
      align: "center",
    },
    {
      title: "ขนาด",
      dataIndex: "SIZE_R",
      key: "SIZE_R",
      align: "center",
    },
    {
      title: `ยอดขายหรือรายรับปี 25${year} (บาท)`,
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
      title: `มูลค่าสินค้าคงเหลือปี 25${year} (บาท)`,
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

  const handleDownload = () => {};

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1>ตาราง ก</h1>
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
