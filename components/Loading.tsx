import "@/styles/Loading.css";
import { FaSpinner } from "react-icons/fa";
import { Spin } from "antd";

const Loading = ({ type }: { type: string }) => {
  return (
    <>
      {type === "full" && (
        <div className="loading-wrap">
          <div className="spinner ">
            <FaSpinner className="animate-spin" />
          </div>
        </div>
      )}
      {type === "partial" && <Spin className="w-full m-auto" />}
    </>
  );
};

export default Loading;
