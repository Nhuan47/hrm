import React from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";

import { Button } from "@/shared/components/ui/button";

export const AttachmentAction = ({
  id,
  name,
  url,
  onDownload,
  onEditing,
  onDelete,
}) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        isPadding={false}
        className="border-none outline-none p-2 duration-300 hover:scale-125"
        onClick={() => onDownload({ url, name })}
      >
        <HiOutlineDownload size={18} />
      </Button>

      <Button
        isPadding={false}
        className="border-none outline-none p-2 duration-300 hover:scale-125"
        onClick={() => onEditing(id)}
      >
        <RiEdit2Fill size={16} />
      </Button>

      <Button
        isPadding={false}
        className="border-none outline-none p-2 duration-300 hover:scale-125"
        onClick={() => onDelete(id)}
      >
        <FaTrash size={12} />
      </Button>
    </div>
  );
};
