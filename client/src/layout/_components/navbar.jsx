import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";

import { NavItem } from "./nav-item";

export const Navbar = ({ items }) => {
  const location = useLocation();
  const currentURL = `${location.pathname}${location.search}`;

  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="bg-light px-10 flex shadow-sm py-1.5  border-b items-center sticky top-0 z-20">
      <div className="flex items-center space-x-2">
        {/* Dashboard */}
        {/* <NavItem url="" icon={<AiOutlineHome size={16} />} onClick={() => {}} /> */}

        {/* Back history */}
        <NavItem icon={<IoMdArrowBack size={16} />} onClick={handleBack} />
      </div>
      <div className="flex items-center justify-start px-2 space-x-2 border-l ml-2">
        {items?.map((item) => (
          <NavItem
            key={item.name}
            label={item.name}
            icon={item?.icon}
            url={item.url}
            isActive={currentURL === item.url}
          />
        ))}
      </div>
    </div>
  );
};
