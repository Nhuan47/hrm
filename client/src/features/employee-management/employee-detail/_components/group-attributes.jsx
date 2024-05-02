import React, { useRef } from "react";
import { useParams } from "react-router-dom";

import { Loading } from "@/shared/components/loading-overlay";

import { useEmployeeInfo } from "../hooks/use-employee-info";
import { useGroupAttributes } from "../hooks/use-group-attributes";
import { GroupAttributeItem } from "./group-attribute-item";

export const GroupAttributes = () => {
  const cache = useRef(null);
  const { id } = useParams();

  // Custom hooks
  const { isFetching, employeeData } = useEmployeeInfo(id);

  const { isFetching: isFetchGrpAttr, groupAttributes } =
    useGroupAttributes(id);

  return (
    <div>
      <div className="space-y-10">
        {groupAttributes?.map((group, index) => (
          <GroupAttributeItem
            key={index}
            group={group}
            employeeData={employeeData}
            cache={cache}
          />
        ))}
      </div>

      <Loading isOpen={isFetching || isFetchGrpAttr} />
    </div>
  );
};
