import React, { useLayoutEffect, useState, memo } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { MdOutlineEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

import { useConfirm } from "@/lib/useConfirm";
import { decodeToken } from "@/shared/utils";
import { featureKeys, permissionKeys } from "@/shared/permission-key";

import { getSummaryReport } from "../../_services/report-service";
import {
  activeModal,
  loadChartData,
  removeChart,
} from "../../_slices/report-slice";

import { SummaryChart } from "./summary-chart";
import { SummaryTable } from "./summary-table";
import { SummaryPivotTable } from "./summary-pivot-table";
import { Wrapper } from "./wrapper";

export const ReportSummary = memo(() => {
  // Decode token & get user permissions
  const tokenData = decodeToken();
  const { permissions } = tokenData;

  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { ask } = useConfirm();

  // Define dispatch action
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.report.isLoading);

  const selectedFilters = useSelector((state) => state.report.selectedFilters);

  const selectedGroupByFields = useSelector(
    (state) => state.report.selectedGroupByFields
  );

  const isActiveChart = useSelector(
    (state) => state.report.chartInfo.isActiveChart
  );

  const chartType = useSelector((state) => state.report.chartInfo.chartType);

  // Fetch chart info of current report
  useLayoutEffect(() => {
    if (selectedGroupByFields?.length > 0) {
      setLoading(true);
      const fetchSummaryReport = async () => {
        const { data } = await getSummaryReport({
          id,
          selectedFilters,
          selectedGroupByFields,
        });

        //  Dispatch chart info into redux store
        const aaa = await dispatch(loadChartData(data));

        setLoading(false);
      };
      fetchSummaryReport();
    }
  }, [selectedFilters, selectedGroupByFields]);

  //   Handle edit chart click
  const onEditChart = async () => {
    await dispatch(activeModal(true));
  };

  const onDeleteChart = async () => {
    try {
      let isDelete = ask(
        "You are about to delete data permanently. Are you sure you want to continue?"
      );

      if (isDelete) {
        const {
          meta: { requestStatus },
        } = await dispatch(removeChart(id));

        if (requestStatus === "fulfilled") {
          toast.success("Chart deleted successfully");
        } else {
          toast.error("Chart delete failed");
        }
      }
    } catch (error) {
      console.error(`Error deleting chart: ${error}`);
    }
  };

  if (!isActiveChart || !chartType) return;

  if (loading || isLoading) return;

  return (
    <Wrapper>
      {permissions &&
        permissions[featureKeys.REPORTS] &&
        permissions[featureKeys.REPORTS][permissionKeys.UPDATE] && (
          <div className="flex justify-end items-center gap-2 pb-5">
            <span
              className="p-2  rounded-full cursor-pointer bg-secondary-200 hover:bg-secondary-300/80 duration-300"
              onClick={onDeleteChart}
            >
              <FaTrash size={16} />
            </span>

            {/* Start Button edit chart group by */}
            <span
              className="p-2  rounded-full cursor-pointer bg-secondary-200 hover:bg-secondary-300/80 duration-300"
              onClick={onEditChart}
            >
              <MdOutlineEdit size={21} />
            </span>
            {/* End Button edit chart group by */}
          </div>
        )}

      {chartType !== "pivot" ? (
        <div className="flex items-stretch">
          <div className="basis-2/3 pr-3">
            <SummaryChart />
          </div>
          <div className="basis-1/3 pl-3">
            <SummaryTable />
          </div>
        </div>
      ) : (
        <SummaryPivotTable />
      )}
    </Wrapper>
  );
});
