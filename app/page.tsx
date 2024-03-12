"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import idea from "@/public/images/idea.svg";
import target from "@/public/images/target.png";
import map from "@/public/images/map.png";
import benefits from "@/public/images/benefits.png";
import taskList from "@/public/images/task-list.png";
import shield from "@/public/images/shield.png";
import { FaStar } from "react-icons/fa6";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const HomePage = () => {
  const objectiveRef = useRef(null);
  const areaRef = useRef(null);
  const benefitRef = useRef(null);
  const taskRef = useRef(null);
  const securityRef = useRef(null);

  const executeScroll = (elementRef: any) =>
    elementRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  return (
    <>
      <div className="main-bg h-svh">
        <div className="mx-auto mt-40 px-[30px] max-w-[1800px]">
          <div className="flex xl:flex-row flex-col-reverse justify-between items-center gap-16 xl:gap-10 relative max-w-[1500px] mx-auto">
            <Image className="mb-10 lg:mb-0" src={idea} alt="idea" priority />
            <h1 className="font-black m-auto xl:text-[75px] md:text-[55px] sm:text-[40px] text-[30px] text-center xl:text-left text-black">
              โครงการสำรวจยอดขายรายไตรมาส
            </h1>
            <div className="absolute top-[9rem] md:top-[16rem] lg:top-[12rem] xl:top-[1.6rem] xl:left-[4rem]">
              <Button primary onClick={() => executeScroll(objectiveRef)}>
                <h1 className="lg:text-xl">วัตถุประสงค์</h1>
              </Button>
            </div>
            <div className="absolute top-[13rem] md:top-[21rem] lg:top-[17rem] xl:-top-[0.2rem] xl:left-[32rem]">
              <Button primary onClick={() => executeScroll(areaRef)}>
                <h1 className="lg:text-xl">พื้นที่เก็บข้อมูล</h1>
              </Button>
            </div>
            <div className="absolute top-[17rem] md:top-[26rem] lg:top-[22rem] xl:top-[5rem] xl:left-[31rem]">
              <Button primary onClick={() => executeScroll(benefitRef)}>
                <h1 className="lg:text-xl">ประโยชน์ที่ได้รับ</h1>
              </Button>
            </div>
            <div className="absolute top-[21rem] md:top-[31rem] lg:top-[27rem] xl:top-[10.8rem] xl:left-[4rem]">
              <Button primary onClick={() => executeScroll(taskRef)}>
                <h1 className="lg:text-xl">อำนาจหน้าที่</h1>
              </Button>
            </div>
            <div className="absolute top-[25rem] md:top-[36rem] lg:top-[32rem] xl:top-[26.3rem] xl:left-[1rem]">
              <Button primary onClick={() => executeScroll(securityRef)}>
                <h1 className="lg:text-xl">การรักษาความลับ</h1>
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </div>
      <div className="py-10 md:w-4/5 mx-auto max-w-[1500px]">
        <div className="flex flex-col">
          <Reveal>
            <div
              ref={objectiveRef}
              className="flex flex-wrap md:flex-nowrap gap-10 items-center justify-center m-5 md:border border-b md:rounded-xl border-gray-300 p-5 md:p-10"
            >
              <div className="md:w-1/2 flex flex-col gap-5">
                <h1 className="text-2xl text-center md:text-left">
                  วัตถุประสงค์ของการจัดทำโครงการสำรวจยอดขายรายไตรมาส
                </h1>
                <h3>
                  1.
                  เพื่อเก็บรวบรวมข้อมูลเกี่ยวกับมูลค่าขายหรือรายรับจากการจำหน่ายปลีกสินค้า
                  และการให้บริการประเภทต่างๆ
                  และมูลค่าสินค้าคงเหลือของสถานประกอบการ
                </h3>
                <h3>
                  2. เพื่อศึกษาแนวโน้มและการเปลี่ยนแปลงของยอดขายหรือรายรับ
                  และสินค้าคงเหลือของสถานประกอบการเป็นรายไตรมาส
                </h3>
              </div>
              <div className="md:mt-0 mt-5 md:w-1/2 flex items-center justify-center">
                <Image src={target} alt="target" width={250} />
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div
              ref={areaRef}
              className="flex flex-wrap-reverse md:flex-nowrap gap-10 items-center justify-center m-5 md:border border-b md:rounded-xl border-gray-300 p-5 md:p-10"
            >
              <div className="md:mb-0 mb-5 md:w-1/2 flex items-center justify-center">
                <Image src={map} alt="area" width={250} />
              </div>
              <div className="md:w-1/2 flex flex-col gap-5">
                <h1 className="text-2xl text-center md:text-left">
                  พื้นที่ในการเก็บรวบรวมข้อมูล
                </h1>
                <h3>ทุกท้องที่ทั่วประเทศ</h3>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div
              ref={benefitRef}
              className="flex flex-wrap md:flex-nowrap gap-10 items-center justify-center m-5 md:border border-b md:rounded-xl border-gray-300 p-5 md:p-10"
            >
              <div className="md:w-1/2 flex flex-col gap-5">
                <h1 className="text-2xl text-center md:text-left">
                  ประโยชน์ที่คาดว่าจะได้รับ
                </h1>
                <h3>
                  1.
                  ใช้เป็นเครื่องมือชี้วัดสำหรับการจัดทำผลิตภัณฑ์มวลรวมในประเทศรายไตรมาส
                  (QGDP) ทั้งด้านการผลิตและการใช้จ่าย
                  โดยเฉพาะการใช้จ่ายเพื่อการอุปโภคบริโภคของครัวเรือน
                  ที่สามารถชี้ทิศทางการเปลี่ยนแปลงเคลื่อนไหวขึ้นลงของภาวะเศรษฐกิจได้
                  และใช้ประกอบการพิจารณาร่วมกับข้อมูลจากหน่วยงานต่างๆที่เกี่ยวข้อง
                </h3>
                <h3>2. ใช้ติดตามและประเมินภาวะของธุรกิจค้าปลีกและบริการ</h3>
                <h3>3. ใช้จัดทำรายงานสถานการณ์ SME</h3>
              </div>
              <div className="md:mt-0 mt-5 md:w-1/2 flex items-center justify-center">
                <Image src={benefits} alt="benefits" width={250} />
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div
              ref={taskRef}
              className="flex flex-wrap-reverse md:flex-nowrap gap-10 items-center justify-center m-5 md:border border-b md:rounded-xl border-gray-300 p-5 md:p-10"
            >
              <div className="md:mb-0 mb-5 md:w-1/2 flex items-center justify-center">
                <Image src={taskList} alt="task lists" width={250} />
              </div>
              <div className="md:w-1/2 flex flex-col gap-5">
                <h1 className="text-2xl text-center md:text-left">
                  อำนาจหน้าที่ในการเก็บรวบรวมข้อมูล
                </h1>
                <h3>
                  &nbsp;&nbsp;&nbsp;&nbsp;สำนักงานสถิติแห่งชาติดำเนินการจัดทำสำมะโน/สำรวจ
                  โดยอาศัยอำนาจตามพระราชบัญญัติสถิติ พ.ศ. 2550
                  จึงใคร่ขอความร่วมมือจากท่านในการสละเวลาตอบข้อถามที่เป็นข้อมูลของการดำเนินกิจการ
                  และขอให้ความมั่นใจว่าข้อความหรือข้อมูลที่บันทึกในแบบสอบถามนี้
                  สำนักงานสถิติแห่งชาติจะเก็บไว้เป็นความลับอย่างเคร่งครัด
                  โดยจะไม่นำไปเปิดเผยเป็นรายกิจการ
                  แต่จะนำไปประมวลผลและนำเสนอในลักษณะภาพรวมเท่านั้น
                  และไม่เกี่ยวข้องกับการเรียกเก็บภาษีใดๆ
                </h3>
                <h3>
                  &nbsp;&nbsp;&nbsp;&nbsp;สำนักงานสถิติแห่งชาติ
                  หวังเป็นอย่างยิ่งว่าคงได้รับความร่วมมือจากท่านเป็นอย่างดี
                  และขอแสดงความขอบคุณมา ณ โอกาสนี้ด้วย
                </h3>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div
              ref={securityRef}
              className="m-5 flex flex-col gap-5 md:border rounded-xl border-gray-300 p-5 md:p-10"
            >
              <div className="text-center w-full text-2xl">
                การรักษาความลับของผู้ให้ข้อมูล/ตอบแบบสอบถาม
              </div>
              <div className="mx-auto">
                <Image src={shield} alt="security" width={250} />
              </div>
              <h1 className="text-lg flex gap-3 items-center">
                <FaStar className="text-yellow-500" />
                การรักษาความลับข้อมูลของผู้ตอบแบบสอบถาม
              </h1>
              <div>
                &nbsp;&nbsp;&nbsp;&nbsp;สำนักงานสถิติแห่งชาติ
                ขอยืนยันให้ท่านมั่นใจในการเก็บรักษาความลับของข้อมูลที่ท่านให้มา
                ซึ่งเป็นข้อมูลส่วนบุคคลหรือข้อมูลรายกิจการ
                โดยสำนักงานสถิติแห่งชาติจะนำมาประมวลเป็นค่าสถิติต่างๆ เช่น
                ค่าเฉลี่ย ร้อยละ เพื่อเผยแพร่ในภาพรวมเท่านั้น
                โดยจะไม่เปิดเผยข้อมูลรายกิจการที่จะทำให้ทราบได้ว่าเป็นสถานประกอบการใดโดยเด็ดขาด
                ซึ่งท่านผู้ให้ข้อมูลจะได้รับความคุ้มครองตามพระราชบัญญัติสถิติ
                พ.ศ. 2550
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
          </Reveal>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
