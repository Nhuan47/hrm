import React, { useEffect, useState } from "react";

import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Plot from "react-plotly.js";
import "react-pivottable/pivottable.css";

export const PivotChart = ({ rendererName, width, height, ...props }) => {
  const [state, setState] = useState({
    ...props,
    plotlyOptions: { width, height },
    rendererName,
  });

  useEffect(() => {
    setState({ ...props, plotlyOptions: { width, height } });
  }, [width, height, props.rows, props.cols]);

  const data = props?.data;

  if (!data) return null;

  return (
    <>
      <div className="chart">
        <PivotTableUI
          renderers={Object.assign(
            {},
            TableRenderers,
            createPlotlyRenderers(Plot)
          )}
          rendererName={rendererName}
          onChange={(s) => {
            setState(s);
          }}
          {...state}
        />
      </div>
    </>
  );
};
