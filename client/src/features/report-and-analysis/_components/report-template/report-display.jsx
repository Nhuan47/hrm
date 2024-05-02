import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { TbFileTypeCsv } from "react-icons/tb";

import { getDisplayValues } from "../../_services/report-service";
import { Wrapper } from "./wrapper";

const date = new Date();
const currYear = date.getFullYear();
const currMonth = date.getMonth() + 1;
const currDay = date.getDate();
const currentDate = `${currYear}${currMonth}${currDay}`;

export const ReportDisplay = () => {
  const ref = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  //   Get state form redux store
  const selectedFilters = useSelector((state) => state.report.selectedFilters);

  const currentId = useSelector((state) => state.report.currentId);

  const reportName = useSelector((state) => state.report.reportName);

  const [items, setItems] = useState({});

  useEffect(() => {
    if (selectedFilters && currentId) {
      const fetchEmployeeList = async () => {
        setIsLoading(true);

        const { data } = await getDisplayValues(currentId, selectedFilters);
        return data;
      };
      fetchEmployeeList()
        .then((data) => {
          setItems(data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedFilters, currentId]);

  // Function to handle button scroll click
  const handleScroll = (scrollAmount) => {
    if (ref && ref.current) {
      const newScrollLeft = ref.current.scrollLeft + scrollAmount;
      ref.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth", // Add smooth scrolling behavior
      });
    }
  };

  if (isLoading) return;
  return (
    <Wrapper>
      {/* Start Paginations */}
      <div className="flex justify-between items-center border-b pb-3 text-xs">
        <div className="flex justify-between items-center gap-3">
          <span
            className="p-2 hover:bg-secondary-200 rounded-full cursor-pointer"
            onClick={() => handleScroll(-550)}
          >
            <FiChevronLeft size={16} />
          </span>
          <span
            className="p-2 hover:bg-secondary-200 rounded-full cursor-pointer"
            onClick={() => handleScroll(550)}
          >
            <FiChevronRight size={16} />
          </span>
        </div>

        <div className="flex gap-5  justify-center items-center">
          <span>({items?.rows?.length}) Records Found</span>
          {items?.cols?.length ? (
            <CSVLink
              headers={items?.cols.map((col) => ({
                label: col.name,
                key: col.accessor,
              }))}
              data={items.rows}
              filename={`${reportName}_${currentDate}.csv`}
              className=" flex gap-1 justify-center items-center px-5 py-2 bg-blue-100/70 hover:bg-blue-100 rounded-full text-blue-500 font-bold cursor-pointer duration-300"
              target="_blank"
            >
              <TbFileTypeCsv size={18} />
              <span>CSV </span>
            </CSVLink>
          ) : null}
        </div>
      </div>
      {/* End Paginations */}

      {/* Start  table content */}
      <div ref={ref} className="overflow-x-scroll ">
        <table className="w-full">
          <thead className="w-full">
            <tr className="bg-reg-500 border-b w-full">
              {items?.cols && (
                <th className="py-5 text-left  px-2">
                  <span className="capitalize text-xs  text-secondary-600">
                    No.
                  </span>
                </th>
              )}

              {items?.cols &&
                items.cols.map((header) => (
                  <th
                    key={header.accessor}
                    className="py-5 text-left min-w-[8rem] px-2"
                  >
                    <span className="capitalize text-xs  text-secondary-600">
                      {header.name}
                    </span>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="text-xs">
            {items?.rows &&
              items?.rows.map((row, i) => {
                return (
                  <tr key={i} className="hover:bg-secondary-100 duration-300">
                    <td className="py-2.5 px-2">
                      <span className="">{i < 10 ? `0${i + 1}` : i + 1}</span>
                    </td>

                    {items.cols.map((col, j) => (
                      <td key={`${i}_${j}`} className="m-w-[5rem] py-2.5 px-2">
                        <span className="">{row[col.accessor]}</span>
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {/* End  table content */}
    </Wrapper>
  );
};
