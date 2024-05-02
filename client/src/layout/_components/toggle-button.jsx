import React from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { Button } from "@/shared/components/ui/button";

export const ToggleButton = ({ isActive, onToggle }) => {
  return (
    <Button
      isPadding={false}
      className="absolute right-[-10px] top-[3.6rem] p-1 border-none duration-500 rounded-full cursor-pointer z-[32] hover:scale-125 hover:bg-secondary-100 text-secondary-500 "
      onClick={onToggle}
    >
      {isActive ? <MdChevronLeft size={16} /> : <MdChevronRight size={16} />}
    </Button>
  );
};
