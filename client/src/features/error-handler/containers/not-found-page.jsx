import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-y-5 items-center text-secondary-600">
        <h1 className="font-extrabold text-[3rem]">Opps</h1>
        <p className="font-extrabold text-3xl">404 - Page Not Found</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};
