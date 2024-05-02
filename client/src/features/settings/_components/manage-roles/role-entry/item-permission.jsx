import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";

import { CheckboxItem } from "./checkbox-item";

export const ItemPermission = ({
  groupId,
  groupAccessor,
  itemId,
  itemAccessor,
  items,
  onChange,
}) => {
  const divRef = useRef();
  const { setValue, getValues } = useFormContext();

  const itemPermissions = useSelector(
    (state) => state.role.roleEditing?.permission
  );

  //   Check update/create/delete permissions has checked
  const isDisableReadCheckbox =
    (itemPermissions &&
      itemPermissions?.[`${groupAccessor}__${itemAccessor}`] &&
      Object.keys(itemPermissions?.[`${groupAccessor}__${itemAccessor}`])?.some(
        (key) =>
          key !== "read" &&
          itemPermissions?.[`${groupAccessor}__${itemAccessor}`][key]?.value
      )) ||
    false;

  const handleChange = async (e) => {
    // handle turn-on read permission when create/update/delete turn-on
    if (divRef.current) {
      let checkboxItems = divRef.current.querySelectorAll(
        "input[type=checkbox]"
      );

      let hasChecked = Object.values(checkboxItems).find(
        (item) => item.getAttribute("data-accessor") !== "read" && item.checked
      );

      let readItem = Object.values(checkboxItems).find(
        (item) => item.getAttribute("data-accessor") === "read"
      );

      if (hasChecked) {
        if (readItem) {
          readItem.checked = true;
          let name = readItem.getAttribute("name");
          await setValue(name, true);
          readItem.disabled = true;
        }
      } else {
        readItem.disabled = false;
      }
    }

    onChange();
  };

  return (
    <div className="basis-3/5 flex items-center" ref={divRef}>
      {items?.map((item) => (
        <div key={`${groupId}_${item.id}`} className="basis-1/4 ">
          <CheckboxItem
            name={`group_permission._${groupId}._${itemId}._${item.id}`}
            accessor={item.accessor}
            item={item}
            onCheckboxChange={handleChange}
            disabled={isDisableReadCheckbox && item.accessor === "read"}
          />
        </div>
      ))}
    </div>
  );
};
