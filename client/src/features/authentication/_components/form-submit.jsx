import React from "react";
import { IoMdLogIn } from "react-icons/io";

import { Button } from "@/shared/components/ui/button";

export const FormSubmit = (disabled) => {
  return (
    <Button
      className="from-primary-600 bg-gradient-to-l bg-[#FFA500] hover:bg-gradient-to-r hover:bg-[#FFA500] duration-500 text-white py-2 px-6 relative"
      type="submit"
      //   disabled={disabled}
    >
      Login
      <span className="absolute right-2 top-2 ">
        <IoMdLogIn size={20} />
      </span>
    </Button>
  );
};
