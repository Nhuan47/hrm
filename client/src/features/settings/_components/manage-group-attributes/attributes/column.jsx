import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Card } from "../card";
import { ButtonAddNew } from "../btn-add-new";
import {
  activeAttributeModal,
  attributesReceived,
  groupReceived,
} from "../../../_slices/attribute-slice";
import { useAttribute } from "../../../_hooks/manage-attributes/use-attribute";

export const Column = ({ group }) => {
  const [active, setActive] = useState(false);
  const { onEditing, onDelete } = useAttribute();
  const dispatch = useDispatch();
  const attributes = useSelector((state) => state.attribute.attributes);
  const items = attributes?.filter((attr) => attr.groupId === group.id);

  const handleDragStart = (e, attr) => {
    e.dataTransfer.setData("attrId", attr.id);
  };

  const handleDragEnd = async (e) => {
    const attrId = e.dataTransfer.getData("attrId");
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element?.dataset?.before || -1;

    if (before !== attrId) {
      let copy = [...attributes];

      let cardToTransfer = copy.find((c) => +c.id === +attrId);
      if (!cardToTransfer) return;

      if (
        cardToTransfer.canArchive === 0 &&
        group.accessor === "group_archive"
      ) {
        toast.warning("This attribute cannot be moved to the archive group.");
        return;
      }

      cardToTransfer = { ...cardToTransfer, groupId: group.id };

      // remove current attr in list attributes
      copy = copy.filter((c) => +c.id !== +attrId);

      const copyWithOutCurrentGroup = copy.filter(
        (c) => c.groupId !== group.id
      );

      let groupItems = copy.filter((item) => item.groupId === group.id);

      const moveToBack = before === -1;

      if (moveToBack) {
        // push current attr to list attributes
        groupItems.push(cardToTransfer);
      } else {
        const insertAtIndex = groupItems.findIndex((el) => +el.id === +before);
        if (insertAtIndex === undefined) return;

        // insert to
        groupItems.splice(insertAtIndex, 0, cardToTransfer);
      }

      groupItems = groupItems.map((a, i) => ({ ...a, order: i + 1 }));

      dispatch(attributesReceived([...copyWithOutCurrentGroup, ...groupItems]));
    }
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    if (el && el.element) {
      el.element.style.opacity = "1";
      el.element.classList.add("bg-primary-500");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();

    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-group="${group.id}"]`));
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const onAddNew = async () => {
    await dispatch(groupReceived({ label: group.name, value: group.id }));
    await dispatch(activeAttributeModal(true));
  };

  return (
    <div className=" basis-1/4 2xl:basis-1/5 rounded-md overflow-hidden p-2">
      <div className="border p-2 bg-primary-500 text-light flex justify-between items-center select-none">
        <span className="text-sm truncate flex-1">{group?.name}</span>
        <span className="text-xs">{items?.length} item(s)</span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors  ${
          active ? "bg-neutral-200/50" : ""
        }`}
      >
        {items?.map((item, index) => (
          <Card
            key={item.id}
            item={item}
            handleDragStart={handleDragStart}
            column={item.groupId}
            onEditing={item?.canEdit ? onEditing : null}
            onDelete={item?.canDelete ? onDelete : null}
          />
        ))}

        {items?.length === 0 && !group?.canCreate && (
          <div className="py-5 border" />
        )}

        {group?.canCreate === 1 && (
          <ButtonAddNew tooltip="Add new attribute" onClick={onAddNew} />
        )}
      </div>
    </div>
  );
};
