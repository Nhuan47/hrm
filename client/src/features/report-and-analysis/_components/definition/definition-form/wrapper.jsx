import React from "react";

export const Wrapper = ({ title, children }) => {
  return (
    <div className=" bg-light rounded-2xl shadow-sm border-secondary-50 p-5">
      {/* title */}
      <h3 className="text-secondary-500  font-[600]">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  );
};
