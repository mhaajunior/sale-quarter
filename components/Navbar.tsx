"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useClientSession from "../hooks/use-client-session";
import { FaSignOutAlt, FaAngleDown } from "react-icons/fa";
import { Role } from "@/types/dto/role";
import { Dropdown, Space } from "antd";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";
import logo from "@/public/nso-logo.png";
import Button from "./Button";

const Navbar = () => {
  const currentPath = usePathname();
  const session = useClientSession();
  const router = useRouter();

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

  interface NavItem {
    title: string;
    path: string;
    link: string;
    role: Role[];
  }

  let navItems: NavItem[] = [
    {
      title: "ค้นหาสถานประกอบการ",
      path: "/search",
      link: "/search",
      role: [Role.INTERVIEWER],
    },
    {
      title: "อนุมัติสถานประกอบการ",
      path: "/approve",
      link: `/approve?pvid=${session?.user.province}`,
      role: [Role.SUPERVISOR],
    },
    {
      title: "ตรวจสอบรายจังหวัด",
      path: "/list",
      link: "/list",
      role: [Role.SUBJECT],
    },
    {
      title: "กำหนดสิทธิแก้ไขฟอร์ม",
      path: "/accessControl",
      link: "/accessControl",
      role: [Role.SUBJECT],
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

  if (!session || session?.user.role === Role.INTERVIEWER) {
    navItems = navItems.filter((item) => item.role.includes(Role.INTERVIEWER));
  } else if (session?.user.role === Role.SUPERVISOR) {
    navItems = navItems.filter((item) => item.role.includes(Role.SUPERVISOR));
  } else if (session?.user.role === Role.SUBJECT) {
    navItems = navItems.filter((item) => item.role.includes(Role.SUBJECT));
  }

  return (
    <>
      {!currentPath.startsWith("/sign") && (
        <div
          className={`p-5 ${
            currentPath !== "/" ? "nav-bottom" : ""
          } bg-white bg-opacity-40 absolute w-full z-40`}
        >
          <nav className="flex justify-between items-center text-gray-500 font-semibold md:w-4/5 w-full mx-auto">
            <ul className="flex items-center md:gap-10 gap-8">
              <li>
                <Link href="/">
                  <Image src={logo} alt="logo" width={100} height={30} />
                </Link>
              </li>
              {navItems.map((item) => (
                <li key={item.title} className="hover:text-black text-center">
                  <Link
                    href={item.link}
                    className={item.path === currentPath ? "text-gray-900" : ""}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            {session ? (
              <ul className="flex items-center justify-end">
                <li className="hover:text-black text-center">
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
            ) : (
              <Button
                primary
                className="!shadow-none"
                onClick={() => router.push("/api/auth/signin")}
              >
                เข้าสู่ระบบ
              </Button>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
