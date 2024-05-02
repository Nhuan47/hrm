import React, { useEffect, useRef, useState } from "react";
import { useLocation, useRouteLoaderData } from "react-router-dom";
import { cn } from "@/shared/utils";

export const Breadcrumb = () => {
  const location = useLocation();

  const elements = location.pathname.trim("/").split("/");
  const prefixPath = elements[1];
  const name = elements[2];

  let text;
  const crumbs = [];
  switch (prefixPath) {
    case "employee":
      crumbs.push("Employee Management");

      if (elements.includes("profile")) {
        crumbs.push("Profile");
        let data = useRouteLoaderData("profile");
        if (data) {
          crumbs.push(data?.name);
        }
      }
      if (elements.includes("personal-details")) {
        crumbs.push("Personal Details");
        let data = useRouteLoaderData("details");
        if (data) {
          crumbs.push(data?.name);
        }
      }
      if (elements.includes("report-to")) {
        crumbs.push("Report To");
        let data = useRouteLoaderData("reportTo");
        if (data) {
          crumbs.push(data?.name);
        }
      }

      if (elements.includes("salary")) {
        crumbs.push("Salary");
        let data = useRouteLoaderData("salary");
        if (data) {
          crumbs.push(data?.name);
        }
      }

      break;

    case "report-and-analytics":
      crumbs.push("Report and Analysis");
      break;

    case "leave":
      crumbs.push("Leave");
      break;

    case "performance":
      crumbs.push("Performance");
      break;

    case "recruitment":
      crumbs.push("Recruitment");
      break;

    case "setting":
      crumbs.push("Setting");
      break;

    default:
      break;
  }

  const isLast = (index) => {
    return index === crumbs.length - 1;
  };
  return (
    <div className={cn("flex gap-1")}>
      {crumbs.map((crumb, index) => (
        <p
          key={index}
          className={cn("text-light text-lg capitalize  flex gap-1 ")}
        >
          <span className={cn(isLast(index) ? "" : "font-semibold")}>
            {crumb}
          </span>
          {!isLast(index) && <span> / </span>}
        </p>
      ))}
    </div>
  );
};
