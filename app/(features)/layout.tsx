import { Metadata } from "next";

export const metadata: Metadata = {
  title: "สำรวจยอดขายรายไตรมาส",
  description: "โครงการสำรวจยอดขายรายไตรมาส สำนักงานสถิติแห่งชาติ",
};

export default function WorkSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col max-w-[1300px] mx-auto text-gray-500">
      <div className="sm:px-16 md:px-20 px-6 py-5">
        <div className="pt-32">{children}</div>
      </div>
    </div>
  );
}
