import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Tree } from "react-organizational-chart";

import { useFetch } from "@/shared/hooks/use-fetch";

import { defaultPhoto } from "@/shared/assets/images";
import { usePermissions } from "@/shared/hooks/use-permission";
import { LoadingReload } from "@/shared/components/loading-reload";
import { featureKeys } from "@/shared/permission-key";

import { OrganizationNode } from "./org-node";

export const Organizational = () => {
  const { isReadable } = usePermissions(featureKeys.EMPLOYEE_ORG_CHART);

  if (isReadable) {
    const { id } = useParams();

    const subordinates = useSelector((state) => state.subordinate.subordinates);

    const supervisors = useSelector((state) => state.supervisor.supervisors);

    const { isFetching, data: items } = useFetch(
      `/employee/report-to/${id}/org-structure`,
      { dependencies: [id, subordinates, supervisors] }
    );

    const navigate = useNavigate();

    const renderOrganizationStructure = () => {
      if (!items || items.length === 0) {
        return <p>No data available</p>;
      }

      return (
        <Tree
          lineWidth={"1px"}
          lineColor={"orange"}
          lineBorderRadius={"10px"}
          lineHeight={"30px"}
          label={
            <div
              className={`organization-item ${
                items[0]?.id === parseInt(id) ? "bg-primary-100" : ""
              }`}
              onClick={() => navigate(`/employee/${items[0]?.id}/report-to`)}
            >
              <div className="flex flex-col gap-2 items-center">
                <div className="avatar-wrapper">
                  <img
                    src={
                      items[0] && items[0]?.avatar
                        ? `${import.meta.env.VITE_API_ENDPOINT}${
                            items[0]?.avatar
                          }`
                        : defaultPhoto
                    }
                    className="object-cover w-full h-full"
                  />
                </div>

                <p className="text-xs text-secondary-700">{items[0]?.name}</p>
              </div>
            </div>
          }
        >
          {items[0]?.childs?.map((item) => (
            <OrganizationNode key={item?.id} node={item} />
          ))}
        </Tree>
      );
    };

    return (
      <div className="bg-white w-full p-5 py-8 rounded-3xl ">
        <div className="border-b pb-5">
          <p className="font-bold text-sm text-secondary-500">
            Organizational Structures
          </p>
        </div>

        {!isFetching ? (
          <div className="mt-5 overflow-x-auto p-10">
            {items && renderOrganizationStructure()}
          </div>
        ) : (
          <LoadingReload />
        )}
      </div>
    );
  }
};
