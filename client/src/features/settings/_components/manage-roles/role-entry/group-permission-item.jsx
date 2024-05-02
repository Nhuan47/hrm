import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "@/shared/components/ui/accordion";

import { ItemPermission } from "./item-permission";
import { useFormContext } from "react-hook-form";

export const GroupPermissionItem = ({ group }) => {
  const chilRef = useRef();
  const { setValue } = useFormContext();

  const [isCheckedAll, setIsCheckedAll] = useState(false);

  const itemPermissions = useSelector(
    (state) => state.role.roleEditing?.permission
  );

  useEffect(() => {
    if (itemPermissions && Object.keys(itemPermissions).length > 0) {
      let isChecked = Object.keys(itemPermissions)?.every((key) => {
        let { group_id, item_id, ...items } = itemPermissions[key];
        return Object.keys(items)?.every((perItem) => items[perItem].value);
      });
      setIsCheckedAll(isChecked);
    } else {
      setIsCheckedAll(false);
    }
  }, [itemPermissions]);

  // convert Object to Array
  const groupsItems = Object.keys(group?.items)?.map((key) => ({
    ...group.items[key],
  }));

  //    = groupsItems?.every(item => item)

  // Function used to handle select/deselect child items in group
  const onCheckboxGroupChange = async (e) => {
    let checkboxs = chilRef.current.querySelectorAll("input[type=checkbox]");
    checkboxs.forEach((element) => {
      let name = element.getAttribute("name");
      setValue(name, e.target.checked);
    });
  };

  //   Function to handle select/deselect parent item by child items
  const handleCheckboxChange = (e) => {
    if (chilRef.current) {
      // Find all element input with checkbox type
      let checkboxs = chilRef.current.querySelectorAll("input[type=checkbox]");
      let isAllChecked = Object.values(checkboxs).every(
        (item) => item.checked === true
      );

      let parentCheckbox = document.querySelector(
        `input[type=checkbox]#group-${group.id}`
      );

      parentCheckbox.checked = isAllChecked;
    }
  };

  return (
    <Accordion>
      <AccordionItem
        title={group?.name}
        id={`group-${group?.id}`}
        className="hover:bg-primary-100"
        checked={isCheckedAll}
        onChange={onCheckboxGroupChange}
        ref={chilRef}
      >
        {groupsItems?.map((groupItem) => {
          return (
            <AccordionContent key={groupItem.id}>
              <div className="flex justify-between items-center text-sm text-secondary-500 ">
                <span className="basis-2/5 select-none">
                  {group?.name} - {groupItem?.name}
                </span>

                <ItemPermission
                  items={groupItem?.permissions}
                  onChange={handleCheckboxChange}
                  groupId={group.id}
                  itemId={groupItem.id}
                  groupAccessor={group.accessor}
                  itemAccessor={groupItem.accessor}
                />
              </div>
            </AccordionContent>
          );
        })}
      </AccordionItem>
    </Accordion>
  );
};
