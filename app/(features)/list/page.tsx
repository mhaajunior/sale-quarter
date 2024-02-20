"use client";

import Badge from "@/components/Badge";
import Dropdown from "@/components/Dropdown";
import Loading from "@/components/Loading";
import MyTooltip from "@/components/MyTooltip";
import Title from "@/components/Title";
import { errorHandler } from "@/lib/errorHandler";
import { quarterMap } from "@/lib/quarter";
import useClientSession from "@/hooks/use-client-session";
import { QuarterArr } from "@/types/dto/common";
import { ProvinceGroup } from "@/types/dto/report";
import { yearOptions } from "@/utils/dropdownOption";
import { Collapse, CollapseProps, Tag } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FilterContext } from "@/context";
import Link from "next/link";
import { Role } from "@/types/dto/role";
import Button from "@/components/Button";

const ListPage = () => {
  const { year, quarter, setYear, setQuarter } = useContext(FilterContext);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ProvinceGroup | null>(null);
  const router = useRouter();
  const session = useClientSession();

  useEffect(() => {
    if (session) {
      fetchProvinceStatus();
    }
  }, [session]);

  const genExtra = (id: number, notApprove: number) => (
    <div className="flex items-center gap-5">
      {notApprove === 0 ? (
        <Tag color="DarkGreen">ครบ</Tag>
      ) : (
        <Tag color="Crimson">ไม่ครบ</Tag>
      )}
      <MyTooltip title="ไปหน้าอนุมัติ">
        <FaExternalLinkAlt
          onClick={(e: any) => onApproveClick(e, id)}
          className="hover:text-black"
        />
      </MyTooltip>
    </div>
  );

  const onApproveClick = (e: any, id: number) => {
    e.stopPropagation();
    router.push(`/approve?pvid=${id}`);
  };

  const itemsNest1: CollapseProps["items"] = [];
  const itemsNest2: CollapseProps["items"] = [];
  const itemsNest3: CollapseProps["items"] = [];
  const itemsNest4: CollapseProps["items"] = [];
  const itemsNest5: CollapseProps["items"] = [];
  const nestArr = [itemsNest1, itemsNest2, itemsNest3, itemsNest4, itemsNest5];

  if (response) {
    for (const [key, value] of Object.entries(response)) {
      for (const item of value) {
        nestArr[Number(key) - 1].push({
          key: item.id,
          label: item.name,
          children: (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-5 md:gap-10">
                <div className="font-bold">จำนวนสถานประกอบการ</div>
                <Tag color="blue">ทั้งหมด: {item.totalCompany}</Tag>
                <Tag color="green">
                  ผู้ตรวจอนุมัติแล้ว: {item.totalCompany - item.notApprove}
                </Tag>
                <Tag color="red">ผู้ตรวจยังไม่อนุมัติ: {item.notApprove}</Tag>
              </div>
            </div>
          ),
          extra: genExtra(item.id, item.notApprove),
        });
      }
    }
  }

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "กรุงเทพมหานคร",
      children: <Collapse items={nestArr[0]} />,
    },
    {
      key: "2",
      label: "ปริมณฑลและภาคกลาง",
      children: <Collapse items={nestArr[1]} />,
    },
    {
      key: "3",
      label: "ภาคเหนือ",
      children: <Collapse items={nestArr[2]} />,
    },
    {
      key: "4",
      label: "ภาคตะวันออกเฉียงเหนือ",
      children: <Collapse items={nestArr[3]} />,
    },
    {
      key: "5",
      label: "ภาคใต้",
      children: <Collapse items={nestArr[4]} />,
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

  const fetchProvinceStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/province_status", {
        params: {
          quarter,
          year,
        },
        headers: { authorization: session?.user.accessToken },
      });

      if (res.status === 200) {
        setResponse(res.data);
      }
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (key: string | string[]) => {
    // console.log(key);
  };

  return (
    <>
      <div className="mb-10 flex flex-col gap-3">
        <Title title="ตรวจสอบรายจังหวัด"></Title>
      </div>
      <div className="card flex flex-col gap-5">
        <div className="flex items-center gap-3 w-full justify-end">
          <label>ปีที่ค้นหา</label>
          <Dropdown
            name="year"
            placeholder="ปี"
            options={yearOptions}
            className="w-36"
            isControl={false}
            setterFn={(year: number) => setYear(year)}
            defaultValue={year}
          />
        </div>
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
          <div className="w-full min-h-40">
            {loading ? (
              <>
                <br />
                <Loading type="partial" />
              </>
            ) : (
              <Collapse onChange={onChange} items={items} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListPage;
