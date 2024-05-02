import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useSize } from "@/shared/hooks/use-size";
import { useElementSize } from "@/shared/hooks/use-element-size";
import { PivotChart } from "@/shared/components/chart/pivot-chart";

export const SummaryPivotTable = () => {
  const selectedGroupByFields = useSelector(
    (state) => state.report?.selectedGroupByFields
  );

  const records = useSelector((state) => state.report?.chartInfo?.records);
  const headers = useSelector((state) => state.report?.chartInfo?.headers);

  const [axis, setAxis] = useState(() => {
    let attrIds = selectedGroupByFields
      ?.filter((field) => field.type === "axis")
      ?.map((item) => item.attributeId);

    let axisAccessors = headers
      ?.map((item) => (attrIds.includes(item.id) ? item.name : undefined))
      .filter((item) => item !== undefined);

    return axisAccessors;
  });

  const [legend, setLegend] = useState(() => {
    let attrIds = selectedGroupByFields
      ?.filter((field) => field.type === "legend")
      ?.map((item) => item.attributeId);

    let legendAccessors = headers
      ?.map((item) => (attrIds.includes(item.id) ? item.name : undefined))
      .filter((item) => item !== undefined);

    return legendAccessors;
  });

  const { width, height } = useSize();

  const [chartRef, { width: chartWidth, height: chartHeight }] =
    useElementSize();
  const [tableRef, { width: tableWidth, height: tableHeight }] =
    useElementSize();

  const [chartSize, setChartSize] = useState({ width: 0, height: 500 });
  const [tableSize, setTableSize] = useState({ width: 0, height: 500 });

  const [state, setState] = useState({
    rows: legend,
    cols: axis,
    data: records,
    rowOrder: "value_a_to_z",
    colOrder: "value_a_to_z",
    sorters: {},
    plotlyConfig: {},
    tableOptions: {},
  });

  useEffect(() => {
    const resizeHandler = () => {
      setChartSize({ width: chartWidth, height: chartHeight - 3 });
      setTableSize({ width: tableWidth, height: tableHeight });
    };

    // Add an event listener for window resize
    window.addEventListener("resize", resizeHandler);

    // Call the resize handler initially
    resizeHandler();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [chartWidth, chartHeight, width, height]);

  return (
    <div>
      <div className="w-full flex flex-wrap  xl:flex-nowrap  ">
        <div
          ref={chartRef}
          className="basis-full resize lg:basis-7/12 2xl:basis-2/3 flex items-start "
          id="chart-container"
        >
          <PivotChart
            rendererName={"Stacked Column Chart"}
            width={chartSize.width}
            height={chartSize.height}
            {...state}
          />
        </div>

        <div
          ref={tableRef}
          className="basis-full lg:basis-5/12 2xl:basis-1/3 flex items-start overflow-auto "
          id="table-container"
        >
          <PivotChart
            rendererName={"table"}
            width={tableSize.width}
            height={tableSize.height}
            {...state}
          />
        </div>
      </div>
    </div>
  );
};
