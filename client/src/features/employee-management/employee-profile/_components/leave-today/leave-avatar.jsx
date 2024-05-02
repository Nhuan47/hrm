import React from "react";

import { defaultPhoto } from "@/shared/assets/images";

export const LeaveAvatar = () => {
  return (
    <div className="w-9 h-9 rounded-full overflow-hidden border p-1 ">
      <img
        src={defaultPhoto}
        alt="avatar"
        className="object-cover w-full h-full"
      />
    </div>
  );
};
