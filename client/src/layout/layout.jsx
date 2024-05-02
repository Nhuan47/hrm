import React from "react";
import { Outlet } from "react-router-dom";

import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";

export const Layout = () => {

  return (
    <div className="flex justify-start  h-screen bg-light bg-gradient-to-r  ">
      {/* Sidebar */}
      <Sidebar />

      <div className="relative flex flex-col grow gap-0  overflow-auto">
        {/* Header */}
        <Header />
        {/* id-layout-main is used to scroll the container to top when click to edit employee salary */}
        <div
          className="flex grow flex-col overflow-auto relative"
          id="id-layout-main"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};
