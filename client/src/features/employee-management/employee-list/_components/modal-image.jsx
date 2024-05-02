import React, { useState } from "react";
import { CiSettings } from "react-icons/ci";
import { Controller, useFormContext } from "react-hook-form";

import { defaultPhoto } from "@/shared/assets/images";

import * as api from "../_services/employee-service";

export const ModalImage = ({ control }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  const { setValue } = useFormContext();

  const handleImageChange = async (event) => {
    const { files } = event.target;
    if (files && files[0]) {
      const formData = new FormData();
      formData.append("file", files[0]);

      const res = await api.uploadImage(formData);
      if (res.status === 201) {
        setAvatarUrl(res.data.url);
        setValue("image_url", res.data.url);
      }
    }
  };

  return (
    <div className="p-5 select-none">
      <div className="border bg-secondary-200 p-2 rounded-full relative w-40 h-40">
        <img
          src={
            avatarUrl
              ? `${import.meta.env.VITE_API_ENDPOINT}${avatarUrl}`
              : defaultPhoto
          }
          alt="avatar"
          className="w-full h-full object-cover rounded-full shadow-md overflow-hidden select-none"
        />
        <div className="absolute bottom-4 right-2  p-1.5 border-none hover:bg-secondary-500 text-secondary-500 hover:text-light rounded-full duration-300 !cursor-pointer">
          <CiSettings size={21} className="!cursor-pointer" />
          <Controller
            name="avatar"
            control={control}
            defaultValue={""}
            render={({ field: { onChange, ...props } }) => (
              <input
                {...props}
                type="file"
                className="opacity-0 absolute top-0 bottom-0 w-full h-full !cursor-pointer"
                onChange={(e) => {
                  handleImageChange(e);
                  onChange(e);
                }}
              />
            )}
          />

          <Controller
            name="image_url"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input {...field} type="text" className="hidden" />
            )}
          />
        </div>
      </div>
    </div>
  );
};
