import React from "react";

import { usePermissions } from "@/shared/hooks/use-permission";

import { FormGroup } from "./form-group";
import { GroupAttributeHeader } from "./group-attribute-header";

export const GroupAttributeItem = ({ group, employeeData, cache }) => {
  let featureKey = `employee_details__${group.accessor}`;
  const { isReadable, isUpdateable } = usePermissions(featureKey);

  if (isReadable) {
    return (
      <div className="p-3 rounded-3xl bg-light w-full">
        <GroupAttributeHeader title={group.name} />
        <FormGroup
          fields={group.attributes}
          item={employeeData}
          canEdit={isUpdateable}
          cache={cache}
        />
      </div>
    );
  } else {
    return null;
  }
};
