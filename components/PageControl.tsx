import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
  const offsetNumber = 3;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="w-full flex justify-end items-center">
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
