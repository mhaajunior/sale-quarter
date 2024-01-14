"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useClientSession from "../hooks/use-client-session";
import { FaSignOutAlt, FaAngleDown } from "react-icons/fa";
import { Role } from "@prisma/client";
import { Dropdown, Space } from "antd";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";
import logo from "@/public/nso-logo.png";

const Navbar = () => {
  const currentPath = usePathname();
  const session = useClientSession();

  const doSignOut = async () => {
    Swal.fire({
      title: "คำเตือน",
      text: "คุณแน่ใจที่จะออกจากระบบหรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลงชื่อออก",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        signOut({ callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL });
      }
    });
  };

  const editPassword = () => {};

  let navItems = [
    {
      title: "ค้นหาสถานประกอบการ",
      link: "/search",
      role: Role.INTERVIEWER,
    },
  ];

  let manageItems = [
    {
      key: "1",
      label: (
        <div onClick={doSignOut} className="flex items-center gap-3">
          <FaSignOutAlt />
          ออกจากระบบ
        </div>
      ),
    },
  ];

  if (session?.user.role !== Role.INTERVIEWER) {
    navItems = navItems.filter((item) => item.role === Role.INTERVIEWER);
  }

  return (
    <>
      {session && (
        <div className="p-5 nav-bottom">
          <nav className="flex justify-between items-center text-gray-500 font-semibold w-3/4 mx-auto">
            <ul className="flex items-center gap-8">
              <li>
                <Link href="/">
                  <Image src={logo} alt="logo" width={100} height={30} />
                </Link>
              </li>
              {navItems.map((item) => (
                <li key={item.title} className="hover:text-black">
                  <Link
                    href={item.link}
                    className={item.link === currentPath ? "text-gray-900" : ""}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex items-center justify-end">
              <li className="hover:text-black">
                <Dropdown
                  menu={{
                    items: manageItems,
                  }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      {session.user.fullname}
                      <FaAngleDown />
                    </Space>
                  </a>
                </Dropdown>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
