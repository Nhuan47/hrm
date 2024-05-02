import React from "react";

export const Wrapper = ({ children }) => {
  return (
    <div className="bg-light shadow-lg w-full p-5  rounded-2xl relative border-secondary-200/90 border">
      {children}
    </div>
  );
};
