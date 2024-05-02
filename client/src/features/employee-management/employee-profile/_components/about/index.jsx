import React from "react";
import { useParams } from "react-router-dom";
import { LiaUserLockSolid } from "react-icons/lia";
import { MdOutlineWorkHistory } from "react-icons/md";
import { PiUserListFill } from "react-icons/pi";

import { useFetch } from "@/shared/hooks/use-fetch";
import { cn } from "@/shared/utils";
import { LoadingReload } from "@/shared/components/loading-reload";

import { Wrapper } from "../wrapper";
import { AboutAvatar } from "./about-avatar";
import { formatDate } from "../../../employee-list/_utils/employee-list-utils";

export const About = () => {
  const { id } = useParams();

  // Custom Hooks
  const { data: profile, isFetching } = useFetch(`/employee/profile/${id}`, {
    dependencies: [id],
  });

  if (isFetching) {
    return (
      <div className="w-full justify-center items-center">
        <LoadingReload />
      </div>
    );
  }

  return (
    <Wrapper icon={<PiUserListFill size={21} />} title="About">
      <div className="flex items-stretch justify-center">
        <div className="basis-2/5 justify-center items-center select-none ">
          <AboutAvatar url={profile?.avatar} employeeId={profile?.id} />

          <h1 className="text-center text-secondary-600 font-semibold capitalize text-sm">
            {profile?.fullName}
          </h1>
          <p className="text-center">{profile?.officeApplied}</p>
        </div>

        <div className="flex-1 p-5 space-y-6">
          {/* basis info */}
          <div className="flex space-x-3">
            <span className="text-xl text-secondary-600">
              <LiaUserLockSolid size={32} />
            </span>

            <div className="text-secondary-600 flex flex-col gap-y-2 font-nutito">
              <h3 className="capitalize font-bold text-secondary-800">
                basic info
              </h3>
              <p className=" capitalize">
                <strong>full name</strong>: <span>{profile?.fullName}</span>
              </p>
              <p className=" capitalize">
                <strong>employee ID</strong>: <span>{profile?.employeeId}</span>
              </p>
              <p className=" capitalize">
                <strong>email</strong>:{" "}
                <span className="normal-case text-blue-700 ">
                  {profile?.email}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-x-4">
            <span className="text-xl text-secondary-600">
              <MdOutlineWorkHistory size={32} />
            </span>

            <div className="text-secondary-600 flex flex-col gap-y-2 font-nutito">
              <h3 className="capitalize font-bold text-secondary-800">job</h3>
              {profile?.joinedDate && (
                <p className=" capitalize">
                  <strong>Joined Date</strong>:{" "}
                  <span>
                    {profile?.joinedDate && formatDate(profile?.joinedDate)}
                  </span>
                </p>
              )}

              <p className="capitalize flex gap-2">
                <strong>Position:</strong>
                <span>{profile?.position}</span>
              </p>

              <p className=" capitalize flex gap-2 items-center">
                <strong>Status:</strong>
                <span
                  className={cn(
                    "ml-2 rounded-3xl px-3 py-1 text-sm select-none",
                    profile?.status === 1
                      ? "bg-green-200 text-green-500"
                      : "bg-red-200 text-red-500"
                  )}
                >
                  {profile?.status === 1 ? "Active" : "InActive"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
