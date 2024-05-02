import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getUserPermissions } from "@/shared/services/permission-service";
import { onLoadPermissions } from "../../features/authentication/_slices/auth-slice";
import { ACCESS_TOKEN_KEY } from "../constants";

export const IdlePermission = () => {
  const dispatch = useDispatch();

  const loadUserPermissions = async () => {
    let date = new Date();
    let token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      console.log("Loading user permissions: ", date);
      const { data, status } = await getUserPermissions();
      if (status === 200) {
        await dispatch(onLoadPermissions(data));
      }
    }
  };

  useEffect(() => {
    let timeOut = setInterval(async () => {
      await loadUserPermissions();
    }, 10000);

    return () => clearInterval(timeOut);
  }, []);

  return <div />;
};
