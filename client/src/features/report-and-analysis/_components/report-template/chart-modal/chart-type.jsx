import React from "react";
import { AiOutlineBarChart } from "react-icons/ai";
import { BiSolidPieChartAlt2 } from "react-icons/bi";
import { MdOutlinePivotTableChart } from "react-icons/md";

import {
  PIE_CHART_KEY,
  BAR_CHART_KEY,
  PIVOT_CHART_KEY,
} from "@/shared/constants";

const COMMON_CLASS =
  "w-16 h-16 flex justify-center items-center border block rounded-lg cursor-pointer duration-300";
const SELECTED_CLASS = "border-primary-500 text-primary-500 bg-primary-100/50";
const UNSELECTED_CLASS =
  "border-secondary-300 text-secondary-500 bg-secondary-100 hover:bg-secondary-200/80";

export const ChartType = ({ chartName, setChartName }) => {
  // function to handle chart changed
  const handleChange = (chartType) => {
    setChartName(chartType);
  };
  return (
    <>
      {/* Chart type */}
      <div className="w-full flex flex-col gap-3 ">
        {/* Title */}
        <p className="text-secondary-500 text-sm font-semibold">Chart type</p>

        {/* Select chart */}
        <div className="w-full flex gap-3 ">
          {/* Bar chart */}
          <div className=" text-center">
            <div
              className={`${COMMON_CLASS}} ${
                chartName === BAR_CHART_KEY ? SELECTED_CLASS : UNSELECTED_CLASS
              } `}
              onClick={() => handleChange(BAR_CHART_KEY)}
            >
              <AiOutlineBarChart size={32} />
            </div>
            <small className="text-xs"> Bar Chart</small>
          </div>

          {/* Pie chart */}
          <div className="w-16 h-16 text-center ">
            <span
              className={`${COMMON_CLASS}} ${
                chartName === PIE_CHART_KEY ? SELECTED_CLASS : UNSELECTED_CLASS
              } `}
              onClick={() => handleChange(PIE_CHART_KEY)}
            >
              <BiSolidPieChartAlt2 size={32} />
            </span>
            <small className="text-xs"> Pie Chart</small>
          </div>

          {/* Pivot chart */}
          <div className="w-16 h-16 text-center ">
            <span
              className={`${COMMON_CLASS}} ${
                chartName === PIVOT_CHART_KEY
                  ? SELECTED_CLASS
                  : UNSELECTED_CLASS
              } `}
              onClick={() => handleChange(PIVOT_CHART_KEY)}
            >
              <MdOutlinePivotTableChart size={32} />
            </span>
            <small className="text-xs"> Pivot Chart</small>
          </div>
        </div>
      </div>
    </>
  );
};
