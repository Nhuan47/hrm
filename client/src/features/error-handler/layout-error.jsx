import React from "react";
import { Link, Outlet } from "react-router-dom";

export const LayoutError = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-y-5 items-center text-secondary-600">
        <h1 className="font-extrabold text-[3rem]">Opps</h1>
        <Outlet />
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};
