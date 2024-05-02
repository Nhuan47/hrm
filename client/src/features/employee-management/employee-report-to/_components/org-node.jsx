import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TreeNode } from "react-organizational-chart";

import { defaultPhoto } from "@/shared/assets/images";

export const OrganizationNode = ({ node, currentId }) => {
  const navigate = useNavigate();

  const { id } = useParams();

  if (node.childs?.length > 0) {
    return (
      <TreeNode
        label={
          <div
            className={`organization-item ${
              node.id === parseInt(id) ? "bg-primary-100" : ""
            }`}
            onDoubleClick={() => navigate(`/employee/${node.id}/report-to`)}
          >
            <div className="flex flex-col gap-2 items-center">
              <div className="avatar-wrapper">
                <img
                  src={
                    node?.image_url
                      ? `${import.meta.env.VITE_API_ENDPOINT}${node?.image_url}`
                      : defaultPhoto
                  }
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-xs text-secondary-700">{node.name}</p>
            </div>
          </div>
        }
      >
        {node.childs &&
          node.childs.length > 0 &&
          node.childs.map((child) => (
            <OrganizationNode
              key={child.id}
              node={child}
              currentId={currentId}
            />
          ))}
      </TreeNode>
    );
  } else {
    return (
      <TreeNode
        label={
          <div
            className={`organization-item ${
              node.id === parseInt(id) ? "bg-primary-100" : ""
            }`}
            onDoubleClick={() => navigate(`/employee/${node.id}/report-to`)}
          >
            <div className="flex flex-col gap-2 items-center">
              <div className="avatar-wrapper">
                <img
                  src={
                    node?.image_url
                      ? `${import.meta.env.VITE_API_ENDPOINT}${node?.image_url}`
                      : defaultPhoto
                  }
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-xs text-secondary-700">{node.name}</p>
            </div>
          </div>
        }
      />
    );
  }
};
