import { FaUserLock } from "react-icons/fa";

const Denied = ({ code = 99 }: { code?: number }) => {
  const renderedMessage = () => {
    let message = "";
    switch (code) {
      case 1:
        message = "หน้านี้ไม่สามารถเยี่ยมชมได้ในช่วงเวลานี้";
        break;
      case 2:
        message = "คุณต้องส่งข้อมูลในไตรมาสก่อนหน้านี้ก่อน";
        break;
      default:
        message = "คุณไม่มีสิทธิที่จะเยี่ยมชมหน้านี้";
        break;
    }
    return <span className="text-xl">{message}</span>;
  };

  return (
    <div className="flex flex-col gap-5 font-bold justify-center items-center">
      <FaUserLock className="text-[200px]" />
      {renderedMessage()}
    </div>
  );
};

export default Denied;
