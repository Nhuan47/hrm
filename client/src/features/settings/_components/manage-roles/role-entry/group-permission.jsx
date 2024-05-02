import React from "react";

import { GroupPermissionItem } from "./group-permission-item";
import { useFetchGroupItemPermissions } from "../../../_hooks/manage-roles/use-fetch-group-item-permission";

export const GroupPermissions = () => {
  const { groupItems } = useFetchGroupItemPermissions();
  return (
    <div>
      <h2 className="text-secondary-500 text-sm select-none">
        Group permissions
      </h2>

      <div className="space-y-1 mt-2">
        {groupItems &&
          Object.keys(groupItems)?.map((key) => (
            <GroupPermissionItem key={key} group={groupItems[key]} />
          ))}
      </div>
    </div>
  );
};
