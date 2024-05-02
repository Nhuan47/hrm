import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { LineChart } from "@/shared/components/chart/line-chart";
import { usePermissions } from "@/shared/hooks/use-permission";
import { decodeToken } from "@/shared/utils";
import { featureKeys, permissionKeys, typeKeys } from "@/shared/permission-key";

import { Wrapper } from "../wrapper";
import { BG_COLOR_PIE_CHART, BG_COLOR_BAR_CHART } from "@/shared/constants";

export const SalaryChart = () => {
  const { isReadable } = usePermissions(featureKeys.EMPLOYEE_SALARY);

  if (isReadable) {
    const salaryHistories = useSelector((state) => state.salary.salaries);
    const fields = useSelector((state) => state.salary.fields);
    const labels = salaryHistories?.map((field) => field.salaryName);

    let rowData = [];
    for (let field of fields) {
      let valueOfField = [];
      for (let item of salaryHistories) {
        valueOfField.push(parseInt(item[field.accessor]));
      }

      rowData.push({
        label: field.name,
        data: valueOfField,
        hidden: field.accessor === "total_income" ? false : true,
        borderColor: BG_COLOR_PIE_CHART,
      });
    }

    return (
      <Wrapper title={"Salary Progression Chart"}>
        <div className="flex flex-col justify-start px-2 select-none py-4 h-[30rem]">
          <LineChart chartData={{ labels: labels, datasets: rowData }} />
        </div>
      </Wrapper>
    );
  }
};
