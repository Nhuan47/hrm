import React, { useState } from "react";
import { CiSettings } from "react-icons/ci";
import { toast } from "react-toastify";

import { isImage } from "@/shared/utils";
import { featureKeys } from "@/shared/permission-key";
import { defaultPhoto } from "@/shared/assets/images";
import { uploadImage } from "@/shared/services/service";
import { usePermissions } from "@/shared/hooks/use-permission";

import { updateAvatar } from "../../_services/about-service";

export const AboutAvatar = ({ employeeId, url }) => {
  const { isUpdateable } = usePermissions(featureKeys.EMPLOYEE_PROFILE);

  const [avatar, setAvatar] = useState(url);

  const onAvatarChange = async (event) => {
    const { files } = event.target;
    if (files && files[0]) {
      if (isImage(files[0])) {
        const formData = new FormData();
        formData.append("file", files[0]);

        const uploadRes = await uploadImage(formData);

        if (uploadRes.status === 201) {
          const imageData = {
            imageId: uploadRes?.data.id,
            userId: employeeId,
          };
          let updateRes = await updateAvatar(imageData);

          if (updateRes.status === 201) {
            toast.success(`Avatar updated successfully.`);
            setTimeout(() => {
              setAvatar(uploadRes?.data.url);
            }, 2000);
          } else {
            toast.error(`Avatar update failed.`);
          }
        }
      } else {
        toast.error(`Unsupported file format.`);
      }
    }
  };

  return (
    <div className="p-5 select-none  flex justify-center items-center">
      <div className="border bg-secondary-200 p-2 rounded-full relative w-40 h-40">
        <img
          src={
            avatar
              ? `${import.meta.env.VITE_API_ENDPOINT}${avatar}`
              : defaultPhoto
          }
          alt="avatar"
          className="w-full h-full object-cover rounded-full shadow-md overflow-hidden select-none"
        />
        {isUpdateable ? (
          <div className="absolute bottom-4 right-2  p-1.5 border-none hover:bg-secondary-500 text-secondary-500 hover:text-light rounded-full duration-300 !cursor-pointer">
            <CiSettings size={21} className="!cursor-pointer" />
            <input
              type="file"
              name="avatar"
              className="opacity-0 absolute  bottom-0 top-0  right-1 w-full h-full cursor-pointer"
              onChange={onAvatarChange}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
