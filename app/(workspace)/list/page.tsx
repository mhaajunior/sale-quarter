"use client";

import Badge from "@/components/Badge";
import Dropdown from "@/components/Dropdown";
import Loading from "@/components/Loading";
import MyTooltip from "@/components/MyTooltip";
import Title from "@/components/Title";
import { errorHandler } from "@/lib/errorHandler";
import { getThaiYear, quarterMap } from "@/lib/quarter";
import useClientSession from "@/hooks/use-client-session";
import { QuarterArr } from "@/types/dto/common";
import { ProvinceGroup } from "@/types/dto/report";
import { yearOptions } from "@/utils/dropdownOption";
import { Collapse, CollapseProps, Tag } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const ListPage = () => {
  const [quarter, setQuarter] = useState(1);
  const [year, setYear] = useState(
    getThaiYear(new Date().getFullYear()).yearSlice
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ProvinceGroup | null>(null);
  const router = useRouter();
  const session = useClientSession();

  useEffect(() => {
    if (session) {
      fetchProvinceStatus();
    }
  }, [session, quarter, year]);

  const genExtra = (id: number, notApprove: number, name: string) => (
    <div className="flex items-center gap-5">
      {notApprove === 0 ? (
        <Tag color="DarkGreen">ครบ</Tag>
      ) : (
        <Tag color="Crimson">ไม่ครบ</Tag>
      )}
      <MyTooltip title="ไปหน้าอนุมัติ">
        <FaExternalLinkAlt
          onClick={(e: any) => onApproveClick(e, id, name)}
          className="hover:text-black"
        />
      </MyTooltip>
    </div>
  );

  const onApproveClick = (e: any, id: number, name: string) => {
    e.stopPropagation();
    router.push(`/approve?id=${id}&yr=${year}&qtr=${quarter}&nm=${name}`);
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
              <p>จำนวนสถานประกอบการทั้งหมด: {item.totalCompany}</p>
              <p className="text-red-500">
                จำนวนสถานประกอบการที่ยังไม่อนุมัติ: {item.notApprove}
              </p>
            </div>
          ),
          extra: genExtra(item.id, item.notApprove, item.name),
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
        method: "GET",
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
    }
    setLoading(false);
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
