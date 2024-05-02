import React from "react";

export const Logo = ({ src }) => {
  return (
    <div className="w-32 h-auto">
      <img className="w-full object-cover" src={src} alt="Logo" />
    </div>
  );
};
