"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { errorHandler } from "@/lib/errorHandler";
import { ReportStatus } from "@/types/dto/report";
import { SearchForm, searchIdSchema } from "@/types/schemas/searchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Empty, Modal, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import useClientSession from "@/hooks/use-client-session";
import { quarterMap } from "@/lib/quarter";
import Portal from "@/components/Portal";
import { useRouter } from "next/navigation";
import { FilterContext } from "@/context";
import { FaStar } from "react-icons/fa6";

interface Response {
  hasControl: boolean;
  reportStatus: ReportStatus | null;
}

interface QtrAction {
  quarter: number;
  canCreate: boolean;
  isSend: boolean;
}

interface SendStatus {
  passOpenDate: boolean;
  company: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
}

interface DataType {
  key: React.Key;
  quarter: number;
  status: SendStatus;
  action: QtrAction;
  dateCreated: string;
  dateModified: string;
  editor: string;
}

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response>({
    hasControl: false,
    reportStatus: null,
  });
  const [id, setId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [quarter, setQuarter] = useState<number | null>(null);
  const { year } = useContext(FilterContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchIdSchema),
  });
  const router = useRouter();

  const session = useClientSession();

  const mapTagColor = (tag: string) => {
    let color = "";
    switch (tag) {
      case "ส่งแล้ว":
        color = "success";
        break;
      case "ตรวจแล้ว":
        color = "success";
        break;
      case "ยังไม่ส่ง":
        color = "error";
        break;
      case "ยังไม่ตรวจ":
        color = "error";
        break;
      default:
        color = "default";
        break;
    }
    return color;
  };

  const renderTags = (status: SendStatus) => {
    if (!status.passOpenDate) {
      return <Tag color="default">ไม่อยู่ในช่วงเวลา</Tag>;
    }

    if (!session) {
      return <Tag color={mapTagColor(status.company)}>{status.company}</Tag>;
    } else {
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <p className="text-left">สถานประกอบการ</p>
            <div>
              <Tag color={mapTagColor(status.company)}>{status.company}</Tag>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <p className="text-left">เจ้าหน้าที่ปฏิบัติงานเก็บรวบรวมข้อมูล</p>
            <div>
              <Tag color={mapTagColor(status.p1)}>{status.p1}</Tag>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <p className="text-left">เจ้าหน้าที่บรรณาธิกรและลงรหัส</p>
            <div>
              <Tag color={mapTagColor(status.p2)}>{status.p2}</Tag>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <p className="text-left">เจ้าหน้าที่บันทึกข้อมูล</p>
            <div>
              <Tag color={mapTagColor(status.p3)}>{status.p3}</Tag>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <p className="text-left">ผู้ตรวจ</p>
            <div>
              <Tag color={mapTagColor(status.p4)}>{status.p4}</Tag>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderActions = (action: QtrAction) => {
    return (
      <div className="flex justify-center">
        {action.canCreate ? (
          action.isSend ? (
            <Link href={`/search/${id}?qtr=${action.quarter}&mode=edit`}>
              <Button warning>แก้ไข</Button>
            </Link>
          ) : (
            <Button secondary onClick={() => renderCreate(action.quarter)}>
              สร้าง
            </Button>
          )
        ) : (
          ""
        )}
      </div>
    );
  };

  const renderCreate = (quarter: number) => {
    if (session) {
      router.push(`/search/${id}?qtr=${quarter}&mode=create`);
    } else {
      setQuarter(quarter);
      setModalOpen(true);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ไตรมาส",
      dataIndex: "quarter",
      key: "quarter",
      fixed: "left",
      align: "center",
      width: "11%",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "30%",
      render: (_, { status }) => renderTags(status),
    },
    {
      title: "แบบฟอร์ม",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, { action }) => renderActions(action),
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "dateCreated",
      key: "dateCreated",
      align: "center",
      width: "12%",
    },
    {
      title: "วันแก้ไขล่าสุด",
      dataIndex: "dateModified",
      key: "dateModified",
      align: "center",
      width: "12%",
    },
    {
      title: "ผู้แก้ไขล่าสุด",
      dataIndex: "editor",
      key: "editor",
      align: "center",
      width: "18%",
    },
  ];

  const data: DataType[] = [];
  if (response.hasControl && response.reportStatus) {
    const {
      year,
      canCreateQtr1,
      canCreateQtr2,
      canCreateQtr3,
      canCreateQtr4,
      isSendQtr1,
      isSendQtr2,
      isSendQtr3,
      isSendQtr4,
      report,
    } = response.reportStatus;
    const canCreateArr = [
      canCreateQtr1,
      canCreateQtr2,
      canCreateQtr3,
      canCreateQtr4,
    ];
    const isSendArr = [isSendQtr1, isSendQtr2, isSendQtr3, isSendQtr4];

    for (let i = 0; i < 4; i++) {
      const qtrTag: SendStatus = {
        passOpenDate: false,
        company: "ยังไม่ส่ง",
        p1: "ยังไม่ตรวจ",
        p2: "ยังไม่ตรวจ",
        p3: "ยังไม่ตรวจ",
        p4: "ยังไม่ตรวจ",
      };
      const isSend = isSendArr[i];
      const res = quarterMap(Number("25" + year) - 543);
      const startDate = moment(res[i].formSubmittedRange[0]);
      const now = moment();
      if (now >= startDate) {
        qtrTag.passOpenDate = true;
      }
      if (isSend) {
        qtrTag.company = "ส่งแล้ว";
      }
      if (report) {
        const reportQtr = report[i] || null;
        if (reportQtr) {
          if (reportQtr.P1) {
            qtrTag.p1 = "ตรวจแล้ว";
          }
          if (reportQtr.P2) {
            qtrTag.p2 = "ตรวจแล้ว";
          }
          if (reportQtr.P3) {
            qtrTag.p3 = "ตรวจแล้ว";
          }
          if (reportQtr.P4) {
            qtrTag.p4 = "ตรวจแล้ว";
          }
        }
      }
      data.push({
        key: i,
        quarter: i + 1,
        status: qtrTag,
        action: {
          quarter: i + 1,
          canCreate: canCreateArr[i],
          isSend: isSendArr[i],
        },
        dateCreated: report[i]
          ? moment(report[i].createdAt).format("YYYY-MM-DD HH:mm:ss")
          : "-",
        dateModified: report[i]
          ? moment(report[i].updatedAt).format("YYYY-MM-DD HH:mm:ss")
          : "-",
        editor: report[i] ? report[i].lastEditor : "-",
      });
    }
  }

  const onSearchId = handleSubmit(async (data) => {
    try {
      setLoading(true);
      let res;
      if (session) {
        res = await axios.post(
          "/api/report_status",
          { data, province: session.user.province, year },
          { headers: { authorization: session.user.accessToken } }
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

  const onAcceptConsent = () => {
    setModalOpen(false);
    router.push(`/search/${id}?qtr=${quarter}&mode=create`);
  };

  return (
    <Portal session={session}>
      <Title title="ค้นหาสถานประกอบการ" />
      <div className="card">
        <form onSubmit={onSearchId} className="flex flex-col gap-5">
          <label>
            กรุณากรอกเลขประจำสถานประกอบการของท่าน{" "}
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
                <h1>ตารางรายงานสถานะการส่งแบบฟอร์ม</h1>
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
      <Modal
        title={<p className="text-center text-xl">ยินยอมให้ข้อมูล</p>}
        open={modalOpen}
        closable={false}
        footer={
          <div className="flex flex-wrap justify-between items-center">
            <p>ท่านยินยอมที่จะให้ข้อมูลกับสำนักงานสถิติแห่งชาติหรือไม่</p>
            <div className="flex gap-5">
              <Button key="back" danger onClick={() => setModalOpen(false)}>
                ไม่ยินยอม
              </Button>
              <Button
                key="submit"
                primary
                type="primary"
                onClick={onAcceptConsent}
              >
                ยินยอม
              </Button>
            </div>
          </div>
        }
        width={1000}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-lg flex gap-3 items-center">
            <FaStar className="text-yellow-500" />
            การรักษาความลับข้อมูลของผู้ตอบแบบสอบถาม
          </h1>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;สำนักงานสถิติแห่งชาติ
            ขอยืนยันให้ท่านมั่นใจในการเก็บรักษาความลับของข้อมูลที่ท่านให้มา
            ซึ่งเป็นข้อมูลส่วนบุคคลหรือข้อมูลรายกิจการ
            โดยสำนักงานสถิติแห่งชาติจะนำมาประมวลเป็นค่าสถิติต่างๆ เช่น ค่าเฉลี่ย
            ร้อยละ เพื่อเผยแพร่ในภาพรวมเท่านั้น
            โดยจะไม่เปิดเผยข้อมูลรายกิจการที่จะทำให้ทราบได้ว่าเป็นสถานประกอบการใดโดยเด็ดขาด
            ซึ่งท่านผู้ให้ข้อมูลจะได้รับความคุ้มครองตามพระราชบัญญัติสถิติ พ.ศ.
            2550
          </div>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;<b>มาตรา 15</b> บรรดาข้อมูลเฉพาะบุคคล
            หรือเฉพาะรายที่ได้มาตามพระราชบัญญัตินี้
            ต้องถือเป็นความลับโดยเคร่งครัด <b>ห้าม</b>
            มิให้ผู้ซึ่งปฏิบัติหน้าที่ตามพระราชบัญญัตินี้หรือผู้มีหน้าที่เก็บรักษาเปิดเผยข้อมูลนั้นแก่บุคคลใด
            ซึ่งไม่มีหน้าที่ตามพระราชบัญญัตินี้ เว้นแต่
            <div>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1)
              เป็นการเปิดเผยเพื่อประโยชน์แก่การสอบสวนหรือการพิจารณาคดีที่ต้องหาว่ากระทำความผิดตามพระราชบัญญัตินี้
            </div>
            <div>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2)
              เป็นการเปิดเผยต่อหน่วยงาน เพื่อใช้ประโยชน์ในการจัดทำสถิติ
              วิเคราะห์หรือวิจัย
              ทั้งนี้เท่าที่ไม่ก่อให้เกิดความเสียหายแก่เจ้าของข้อมูล
              และต้องไม่ระบุหรือเปิดเผยถึงเจ้าของข้อมูล
            </div>
          </div>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;<b>มาตรา 16</b> ภายใต้บังคับมาตรา 14
            และมาตรา 15
            ผู้ซึ่งปฏิบัติหน้าที่ในหน่วยงานหรือสำนักงานสถิติแห่งชาติต้องไม่นำบรรดาข้อมูลเฉพาะบุคคลหรือเฉพาะรายที่เจ้าของข้อมูลได้ให้ไว้หรือกรอกแบบสอบถามไปใช้ในกิจการอื่นนอกเหนือจากการจัดทำสถิติวิเคราะห์หรือวิจัย
          </div>
          <h1 className="text-lg flex gap-3 items-center">
            <FaStar className="text-yellow-500" />
            การให้ข้อมูล/ตอบแบบสอบถาม
          </h1>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;<b>มาตรา 18</b> ผู้ใดไม่ให้ข้อมูล
            หรือไม่กรอกแบบสอบถามตามวิธีการที่กำหนดในประกาศมาตรา 10
            หรือไม่ส่งคืนแบบสอบถามที่ได้กรอกรายการแล้วแก่พนักงานเจ้าหน้าที่หรือหน่วยงานภายในระยะเวลาที่กำหนดในประกาศตามมาตรา
            10 (4)
            หรือไม่ให้ความสะดวกแก่พนักงานเจ้าหน้าที่ในการปฏิบัติหน้าที่ตามมาตรา
            12 ต้องระวางโทษปรับไม่เกินสามพันบาท
          </div>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;<b>มาตรา 19</b>{" "}
            ผู้ใดซึ่งมีหน้าที่ให้ข้อมูลตามมาตรา 11 แต่จงใจให้ข้อมูลเป็นเท็จ
            ต้องระวางโทษจำคุกไม่เกินสามเดือน หรือปรับไม่เกินห้าพันบาท
            หรือทั้งจำทั้งปรับ
          </div>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;<b>มาตรา 20</b> ผู้ใดฝ่าฝืนมาตรา 15
            หรือมาตรา 16 ต้องระวางโทษจำคุกไม่เกินหนึ่งปี
            หรือปรับไม่เกินสองหมื่นบาท หรือทั้งจำทั้งปรับ
          </div>
          <div className="border border-black rounded-md p-5">
            &nbsp;&nbsp;&nbsp;&nbsp;สำนักงานสถิติแห่งชาติ
            หวังเป็นอย่างยิ่งว่าจะได้รับความร่วมมือจากผู้ประกอบการทุกท่านในการให้ข้อมูลที่ถูกต้องเพื่อให้ประเทศมีข้อมูลสถิติที่เป็นจริง
            ในการกำหนดนโยบาย การวางแผน
            และการส่งเสริมการดำเนินงานทั้งภาครัฐและเอกชน
            ซึ่งจะส่งผลให้ธุรกิจรุ่งเรือง เศรษฐกิจชาติก้าวไกล
          </div>
        </div>
      </Modal>
    </Portal>
  );
};

export default SearchPage;
