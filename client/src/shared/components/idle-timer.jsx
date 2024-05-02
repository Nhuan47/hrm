import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";

const whileList = [];

const timeExpire = 1000 * 14400; // 14400 seconds ~ 4 hours
// const timeExpire = 1000 * 30; // 120 seconds ~ 2 minutes

export const IdleTimer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let timeout = null;

  const restartAutoReset = () => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
      navigate("/login");
    }, timeExpire);
  };

  const onMouseMove = () => {
    restartAutoReset();
  };

  useEffect(() => {
    let preventReset = false;

    for (const path of whileList) {
      if (path === location.pathname) {
        preventReset = true;
      }
    }

    if (preventReset) {
      return;
    }

    // Initiate timout
    restartAutoReset();

    // listen for mouse events
    window.addEventListener("mousemove", onMouseMove);

    // Cleanup
    return () => {
      if (timeout) {
        clearTimeout(timeout);
        window.removeEventListener("mousemove", onMouseMove);
      }
    };
  }, [location.pathname]);

  return <div />;
};
