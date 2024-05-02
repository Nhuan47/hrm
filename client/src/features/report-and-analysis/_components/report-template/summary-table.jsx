import React from "react";
import { useSelector } from "react-redux";

export const SummaryTable = () => {

  const  chartInfo  = useSelector((state) => state.report?.chartInfo);

  if (!chartInfo) return null;

  const { records, headers } = chartInfo;


  return (
    <>
      <table className="w-full text-xs text-center block">
        <thead className="w-full  block">
          <tr className="w-full flex justify-between items-center  bg-[#ebf0f8] border-t">
            {headers &&
              headers.map((header, i) => (
                <th
                  className={`w-full p-2 text-left`}
                  key={`${header.name}__${i}`}
                >
                  <span className={`text-xs `}>{header.name}</span>
                </th>
              ))}
            <th className={`w-full p-2`}>
              <span className="text-xs ">Records Count</span>
            </th>
          </tr>
        </thead>
        <tbody className=" overflow-y-scroll h-[20rem] block">
          {records &&
            records?.map((record, index) => (
              <tr
                key={index}
                className="border-t flex w-full justify-between items-center"
              >
                {headers &&
                  headers.map((header, h_index) => (
                    <td
                      className={`w-full text-left p-2`}
                      key={`${header.accessor}_${h_index}`}
                    >
                      {record[header.accessor]}
                    </td>
                  ))}

                {/* Counter */}
                <td className={`w-full text-center`}>
                  {record["record_count"]}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};
