import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/shared/utils";

import { Card } from "../card";

export const AttribuiteList = () => {
  const attributes = useSelector((state) => state.attribute.attributes);

  const groups = useSelector((state) => state.attribute.groups);

  const grpArchive = groups.filter(
    (group) => group.accessor === "group_archive"
  );

  let copy = [...attributes];
  // Remove attribute archive from attributes
  copy = copy.filter((a) => a.groupId !== grpArchive.id);
  const attrsOrder = copy?.sort((a, b) => a.name.localeCompare(b.name));

  const handleDragStart = (e, attr) => {
    e.dataTransfer.setData("attrId", attr.id);
  };

  return (
    <div className={cn("basis-1/2  overflow-y-scroll flex-1 mt-1")}>
      {attrsOrder?.map((attribute) => (
        <Card
          key={attribute.id}
          item={attribute}
          handleDragStart={handleDragStart}
          column="attributes"
        />
      ))}
    </div>
  );
};
