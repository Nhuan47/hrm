import React from "react";
import { Link } from "react-router-dom";

export const QuickItem = ({ item }) => {
  return (
    <div className="p-2 flex flex-col justify-center gap-y-2">
      <Link to={item.path}>
        <div className="bg-secondary-100 p-2 flex justify-center items-center rounded-full  w-[3.8rem] h-auto shadow-sm hover:bg-secondary-200/80 duration-300">
          <img src={item.image} alt={item.title} className="object-cover" />
        </div>
      </Link>
      <p className="text-sm capitalize text-secondary-500">{item.title}</p>
    </div>
  );
};
