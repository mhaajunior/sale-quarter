import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { SelectOption } from "@/types/dto/common";

const PageControl = ({
  page,
  totalPages,
  onChangePage,
}: {
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}) => {
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;

  const pageNumbers = [];
  const pageOptions: SelectOption[] = [];
  const offsetNumber = 3;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }
  for (let i = 1; i <= totalPages; i++) {
    pageOptions.push({ label: i.toString(), value: i });
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="w-full flex flex-wrap-reverse justify-end items-center gap-5">
      <div className="flex gap-3 items-center">
        <p>ไปยังหน้า</p>
        <Dropdown
          name="approve"
          placeholder="หน้า"
          options={pageOptions}
          className="w-20"
          isControl={false}
          setterFn={(page: number) => onChangePage(page)}
          defaultValue={page}
          styles={{ padding: 0 }}
        />
      </div>
      <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-2 items-center text-sm">
        {page === 1 ? (
          <div className="opacity-60" aria-disabled="true">
            <FaChevronLeft />
          </div>
        ) : (
          <div
            className="cursor-pointer hover:text-blue-500"
            onClick={() => onChangePage(prevPage)}
          >
            <FaChevronLeft />
          </div>
        )}
        {pageNumbers.map((pageNumber, index) => (
          <div
            key={index}
            className={
              page === pageNumber
                ? "bg-blue-500 fw-bold px-2 py-[1px] rounded-md text-white"
                : "hover:text-blue-500 cursor-pointer"
            }
            onClick={() => onChangePage(pageNumber)}
          >
            {pageNumber}
          </div>
        ))}
        {page === totalPages ? (
          <div className="opacity-60" aria-disabled="true">
            <FaChevronRight />
          </div>
        ) : (
          <div
            className="cursor-pointer hover:text-blue-500"
            onClick={() => onChangePage(nextPage)}
          >
            <FaChevronRight />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageControl;
