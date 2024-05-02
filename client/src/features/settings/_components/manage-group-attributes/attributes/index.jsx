import React from "react";
import { useSelector } from "react-redux";
import { FaSitemap } from "react-icons/fa";

import { Title } from "../title";
import { Column } from "./column";
import { AttributeModal } from "./attribute-modal";

export const ManageAttributes = () => {
  const groups = useSelector((state) => state.attribute.groups);
  return (
    <div>
      <Title title="Attributes Management" icon={<FaSitemap />} />
      <div className="flex flex-wrap justify-start items-stretch gap-y-5 shadow-sm rounded-md border">
        {groups?.map((group) => (
          <Column key={group.id} group={group} />
        ))}
      </div>

      <AttributeModal />
    </div>
  );
};
