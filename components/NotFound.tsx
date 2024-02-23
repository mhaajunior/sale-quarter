import { LuFileQuestion } from "react-icons/lu";

const NotFound = () => {
  return (
    <div className="flex flex-col gap-5 font-bold justify-center items-center">
      <LuFileQuestion className="text-[200px]" />
      <span className="text-xl">ไม่พบหน้าที่คุณต้องการจะเยี่ยมชม</span>
    </div>
  );
};

export default NotFound;
