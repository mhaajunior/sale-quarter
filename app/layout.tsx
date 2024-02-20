import type { Metadata } from "next";
import "./globals.css";
import { ConfigProvider } from "antd";
import { Toaster } from "sonner";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import FilterProvider from "@/context";

export const metadata: Metadata = {
  title: "สำรวจยอดขายรายไตรมาส",
  description: "ครงการสำรวจยอดขายรายไตรมาส สำนักงานสถิติแห่งชาติ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen h-full mx-auto text-gray-500">
        <ConfigProvider
          theme={{
            token: {
              fontFamily: "Sarabun",
              colorText: "text-gray-500",
            },
          }}
        >
          <AuthProvider>
            <FilterProvider>
              <Toaster richColors={true} position="top-right" />
              <Navbar />
              {children}
            </FilterProvider>
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
