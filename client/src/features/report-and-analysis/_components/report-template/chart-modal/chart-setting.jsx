import React, { memo } from "react";

import { NormalChartConfig } from "./normal-chart-config";
import { PivotChartConfig } from "./pivot-chart-config";

export const ChartSetting = memo(({ isPivot, fields }) => {
  return (
    <div>
      <p className="border-b mt-5 text-sm font-semibold text-secondary-500 py-2">
        Chart Settings
      </p>

      {isPivot ? (
        // Render chart setting with pivot table
        <PivotChartConfig fields={fields} />
      ) : (
        // render chart setting with pie/bar
        <NormalChartConfig fields={fields} />
      )}
    </div>
  );
});
