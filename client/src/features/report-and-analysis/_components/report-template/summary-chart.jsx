import React from "react";
import { useSelector } from "react-redux";

import { BarChart } from "@/shared/components/chart/bar-chart";
import { PieChart } from "@/shared/components/chart/pie-chart";

import {
  BAR_CHART_KEY,
  BG_COLOR_BAR_CHART,
  BG_COLOR_PIE_CHART,
  PIE_CHART_KEY,
} from "@/shared/constants";

export const SummaryChart = () => {
  // get chart information from the redux store
  const headers = useSelector((state) => state.report.chartInfo.headers);
  const records = useSelector((state) => state.report.chartInfo.records);
  const chartType = useSelector((state) => state.report.chartInfo.chartType);

  if (!records) return null;

  // get list accessor to filter labels from records
  const accessors = headers?.map((item) => item.accessor);

  // get list labels from records by list accessor attributes
  const labels = records?.map((item) => accessors.map((key) => item[key]));

  // concat name of group by attributes to the title for chart
  const chartLabel = headers?.map((item) => item.name).join(" - ");

  // Extract record counter from records value
  const listReportCounters = records?.map((record) => record.record_count);

  if (chartType === BAR_CHART_KEY) {
    let chartData = {
      labels,
      datasets: [
        {
          label: chartLabel,
          data: listReportCounters,
          backgroundColor: BG_COLOR_BAR_CHART,
        },
      ],
    };

    return <BarChart chartData={chartData} />;
  } else if (chartType === PIE_CHART_KEY) {
    let chartData = {
      labels,
      datasets: [
        {
          label: chartLabel,
          data: listReportCounters,
          backgroundColor: BG_COLOR_PIE_CHART,
          borderColor: BG_COLOR_PIE_CHART,
          borderWidth: 1,
        },
      ],
    };
    return <PieChart chartData={chartData} />;
  }
};
