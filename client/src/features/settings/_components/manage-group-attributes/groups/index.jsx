import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaLayerGroup } from "react-icons/fa";

import { Card } from "../card";
import { Title } from "../title";
import { ButtonAddNew } from "../btn-add-new";
import {
  activeGroupModal,
  groupsReceived,
} from "../../../_slices/attribute-slice";
import { useGroup } from "../../../_hooks/manage-attributes/use-group";
import { GroupModal } from "./group-modal";

export const ManageGroups = () => {
  const [active, setActive] = useState(false);
  const { onEditing, onDelete } = useGroup();
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.attribute.groups);
  let groupOrders = [...groups];
  groupOrders = groupOrders?.sort((a, b) => a.order - b.order);

  const handleDragStart = (e, group) => {
    e.dataTransfer.setData("groupId", group.id);
  };

  const handleDragEnd = async (e) => {
    const groupId = e.dataTransfer.getData("groupId");
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element?.dataset?.before || -1;

    if (before !== groupId) {
      let copy = [...groups];
      let cardToTransfer = copy.find((c) => +c.id === +groupId);
      if (!cardToTransfer) return;

      const insertAtIndex = groups.findIndex((el) => +el.id === +before);

      copy = copy.filter((g) => +g.id !== +groupId);
      copy.splice(insertAtIndex, 0, cardToTransfer);
      const reOrder = copy.map((g, index) => ({ ...g, order: index + 1 }));
      dispatch(groupsReceived(reOrder));
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
    return Array.from(document.querySelectorAll(`[data-group="group"]`));
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
    await dispatch(activeGroupModal(true));
  };

  return (
    <div>
      <Title title="Group Management" icon={<FaLayerGroup />} />
      <div className=" border p-2 rounded-md shadow-sm w-1/2">
        <div
          className={`h-full w-full transition-colors  ${
            active ? "bg-neutral-200/50" : ""
          }`}
          onDrop={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {groupOrders?.map((group) => (
            <Card
              key={group.id}
              item={group}
              handleDragStart={handleDragStart}
              onEditing={group?.canEdit ? onEditing : null}
              onDelete={group?.canDelete ? onDelete : null}
              column="group"
            />
          ))}

          <ButtonAddNew tooltip="Add new group" onClick={onAddNew} />
        </div>
      </div>

      <GroupModal />
    </div>
  );
};
