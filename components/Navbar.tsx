"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useClientSession from "../hooks/use-client-session";
import { FaSignOutAlt, FaAngleDown, FaUser, FaSignInAlt } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { Role } from "@/types/dto/role";
import { Dropdown, Space } from "antd";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";
import logo from "@/public/images/nso-logo.png";
import Button from "./Button";
import useWindowSize from "@/hooks/use-window-size";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const currentPath = usePathname();
  const session = useClientSession();
  const router = useRouter();
  const size = useWindowSize();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setShowMenu(false);
  }, [currentPath]);

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
    {
      title: "อัพโหลด Control",
      path: "/uploadControl",
      link: "/uploadControl",
      role: [Role.ADMIN],
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
  } else if (session?.user.role === Role.ADMIN) {
    navItems = navItems.filter((item) => item.role.includes(Role.ADMIN));
  }

  return (
    <>
      {!currentPath.startsWith("/sign") && (
        <div
          className={`p-5 ${
            currentPath !== "/" ? "nav-bottom" : ""
          } bg-white md:bg-opacity-40 absolute w-full z-40`}
        >
          <nav className="flex justify-between items-center text-gray-500 font-semibold lg:w-4/5 w-full mx-auto">
            <ul className="flex items-center md:gap-10 gap-8 w-3/5">
              <li>
                <Link href="/">
                  <Image
                    src={logo}
                    priority
                    className="w-auto"
                    alt="logo"
                    width={90}
                  />
                </Link>
              </li>
              {size.width &&
                size.width > 768 &&
                navItems.map((item) => (
                  <li
                    key={item.title}
                    className="hover:text-black text-center whitespace-nowrap text-ellipsis overflow-hidden"
                  >
                    <Link
                      href={item.link}
                      className={
                        item.path === currentPath ? "text-gray-900" : ""
                      }
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
            </ul>
            {size.width ? (
              size.width <= 768 ? (
                <BsList
                  className="text-3xl cursor-pointer hover:text-black"
                  onClick={() => setShowMenu((prevState) => !prevState)}
                />
              ) : (
                <>
                  {session ? (
                    <ul className="flex items-center justify-end">
                      <li className="hover:text-black text-center whitespace-nowrap text-ellipsis overflow-hidden">
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
                </>
              )
            ) : (
              ""
            )}
          </nav>
          <AnimatePresence>
            {size.width && size.width <= 768 && showMenu && (
              <motion.ul
                key="box"
                initial={{ y: "-50%", opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: "-50%", opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col"
              >
                {navItems.map((item) => (
                  <li
                    key={item.title}
                    className={`hover:text-black p-5 border-b cursor-pointer ${
                      item.path === currentPath ? "text-gray-900" : ""
                    }`}
                    onClick={() => router.push(item.link)}
                  >
                    {item.title}
                  </li>
                ))}
                {session ? (
                  <>
                    <li className="p-5 flex items-center gap-3">
                      <FaUser />
                      {session.user.fullname}
                    </li>
                    {manageItems.map((item) => (
                      <li
                        key={item.key}
                        className="hover:text-black p-5 cursor-pointer"
                      >
                        {item.label}
                      </li>
                    ))}
                  </>
                ) : (
                  <li
                    className="p-5 hover:text-black cursor-pointer flex items-center gap-3"
                    onClick={() => router.push("/api/auth/signin")}
                  >
                    <FaSignInAlt />
                    เข้าสู่ระบบ
                  </li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default Navbar;
