import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";

import { store } from "@/shared/redux/store";

import { router } from "./routes";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { IdleTimer } from "@/shared/components/idle-timer";
import { ConfirmContextProvider } from "@/lib/useConfirm";

ReactDOM.createRoot(document.getElementById("root")).render(
  //   // <React.StrictMode>
  //   <Provider store={store}>
  //     <BrowserRouter>
  //       {/* <RouterProvider router={router} /> */}
  //       {/* <App /> */}
  //     </BrowserRouter>
  //   </Provider>
  //   // </React.StrictMode>,

  <Provider store={store}>
    <ConfirmContextProvider>
      <RouterProvider router={router}>
        <IdleTimer />
      </RouterProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClicl={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />

      <ConfirmDialog />
    </ConfirmContextProvider>
  </Provider>
);
