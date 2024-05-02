import React from "react";

export const Title = ({ title, icon }) => {
  return (
    <div className=" py-2 flex gap-2 justify-start items-center text-secondary-600">
      {icon}
      <h2 className="text-sm  font-semibold ">{title}</h2>
    </div>
  );
};
