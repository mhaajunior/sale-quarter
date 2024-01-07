import "@/styles/Loading.css";
import { FaSpinner } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
      {type === "partial" && (
        <AiOutlineLoading3Quarters className="animate-spin text-7xl m-auto txt-primary" />
      )}
    </>
  );
};

export default Loading;
