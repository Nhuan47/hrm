import React from "react";
import {
  BiChevronRight,
  BiChevronsRight,
  BiChevronLeft,
  BiChevronsLeft,
} from "react-icons/bi";

const ROWS_PER_PAGE_OPTIONS = ["10", "20", "50", "All"];

const PaginationControlsStart = ({ offset, onPageChange, totalRows }) => {
  return (
    <div className="flex justify-center items-center">
      {offset > 0 && (
        <>
          <ControlButton
            icon={<BiChevronsLeft size={21} />}
            onClick={() => onPageChange(Math.ceil(-offset), totalRows)}
          />
          <ControlButton
            icon={<BiChevronLeft size={21} />}
            onClick={() => onPageChange(-1, totalRows)}
          />
        </>
      )}
    </div>
  );
};

const ControlButton = ({ icon, onClick }) => {
  return (
    <span
      className="cursor-pointer text-secondary-500 hover:bg-secondary-100 p-1 rounded-full duration-300"
      onClick={onClick}
    >
      {icon}
    </span>
  );
};

const RowsPerPageDropdown = ({ onRowPerPageChange, rowsPerPage }) => {
  return (
    <>
      <span className="text-xs text-neutral-600 select-none">
        Rows per page
      </span>
      <select
        className="outline-none border-none cursor-pointer bg-transparent "
        onChange={onRowPerPageChange}
        defaultValue={rowsPerPage || 10}
      >
        {ROWS_PER_PAGE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};

const PageInfo = ({ offset, rowsPerPage, totalRows }) => {
  return (
    <span className="space-x-1 select-none ">
      <span> {offset * rowsPerPage + 1} </span>
      <span> - </span>
      <span>
        {(offset + 1) * rowsPerPage >= totalRows
          ? totalRows
          : rowsPerPage === -1
          ? totalRows
          : (offset + 1) * rowsPerPage}
      </span>
      <span>of {totalRows}</span>
    </span>
  );
};

const PaginationControlsEnd = ({
  offset,
  onPageChange,
  totalRows,
  rowsPerPage,
}) => {
  return (
    <div className="flex justify-center items-center">
      {Math.ceil(totalRows / rowsPerPage) !== offset + 1 && (
        <>
          <ControlButton
            icon={<BiChevronRight size={21} />}
            onClick={() => onPageChange(1, totalRows)}
          />
          <ControlButton
            icon={<BiChevronsRight size={21} />}
            onClick={() =>
              onPageChange(
                Math.ceil(totalRows / rowsPerPage) - (offset + 1),
                totalRows
              )
            }
          />
        </>
      )}
    </div>
  );
};

const Pagination = ({
  offset,
  totalRows,
  rowsPerPage,
  onPageChange,
  onRowPerPageChange,
}) => {
  const handleRowPerPageChange = (e) => {
    let selectedRows = e.target.value;
    onRowPerPageChange(selectedRows === "All" ? totalRows : selectedRows);
  };

  return (
    <>
      {totalRows ? (
        <div className="flex justify-end items-center py-2 mt-2 !text-secondary-500 text-xs">
          <PaginationControlsStart
            offset={offset}
            onPageChange={onPageChange}
            totalRows={totalRows}
          />
          <RowsPerPageDropdown
            onRowPerPageChange={handleRowPerPageChange}
            rowsPerPage={rowsPerPage}
          />
          <PageInfo
            offset={offset}
            rowsPerPage={rowsPerPage}
            totalRows={totalRows}
          />
          <PaginationControlsEnd
            offset={offset}
            onPageChange={onPageChange}
            totalRows={totalRows}
            rowsPerPage={rowsPerPage}
          />
        </div>
      ) : null}
    </>
  );
};

export { Pagination };
