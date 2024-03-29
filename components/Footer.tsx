import React from "react";
import { FaStar } from "react-icons/fa6";
import logo from "@/public/images/nso-logo.png";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="border-t">
      <div className="w-3/4 mx-auto py-10 flex flex-col gap-10 max-w-[1200px]">
        <div className="w-full text-center font-bold text-2xl">
          "ร่วมสร้างอนาคตไทย ร่วมใจให้ข้อมูลกับสำนักงานสถิติแห่งชาติ"
        </div>
        <div className="md:flex justify-between">
          <div className="leading-8 md:w-1/2 md:text-left text-center">
            <div>
              <FaStar className="text-yellow-500 inline-block mr-2 mt-[-4px]" />
              <span>
                กรุงเทพมหานคร สอบถามได้ที่ กองบริหารจัดเก็บข้อมูลสถิติ โทร.0
                2143 1312 - 13, 0 2143 1315 และ 0 2143 1318
              </span>
            </div>
            <div>
              <FaStar className="text-yellow-500 inline-block mr-2 mt-[-4px]" />
              <span>
                ต่างจังหวัด สอบถามได้ที่สำนักงานสถิติจังหวัดทั่วประเทศ
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center md:mt-0 mt-10">
            <Image className="mb-5 w-auto" src={logo} alt="logo" width={120} />
            <div>กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม</div>
            <div>www.nso.go.th</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
