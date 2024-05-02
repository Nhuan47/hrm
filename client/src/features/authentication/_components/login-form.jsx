import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import { object, string } from "yup";
import { toast } from "react-toastify";

import { typeKeys } from "@/shared/permission-key";
import { Loading } from "@/shared/components/loading-overlay";
import { FormInput } from "@/shared/components/form/form-input";

import { FormSubmit } from "./form-submit";
import { signIn } from "../_slices/auth-slice";

const schemaValidator = object({
  email: string().required("Email is required"),
  password: string().required("Password is required"),
}).required();

export const LoginForm = () => {
  // Redux store
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  // State logic
  const [isLoading, setIsloading] = useState(false);

  // React rourter
  const navigate = useNavigate();

  // Variables
  const initialState = {
    email: "",
    password: "",
  };

  // Initialize the useForm hook with validation resolver
  const methods = useForm({
    defaultValues: initialState,
    resolver: yupResolver(schemaValidator),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = methods;

  // Component lifecycle methods (useEffect)
  useEffect(() => {
    if (userInfo) {
      let { roles, user_id: employeeId } = userInfo;

      // check current user has admin role
      let isAccessEmployeeList = roles.filter(
        (role) =>
          role.accessor === typeKeys.ADMIN ||
          role.accessor === typeKeys.SUPERVISOR
      );

      if (isAccessEmployeeList.length > 0) return navigate("/employee/list");
      return navigate(`/employee/${employeeId}/profile`);
    }
  }, [userInfo]);

  const onSubmit = async (formData) => {
    try {
      setIsloading(true);

      const {
        meta: { requestStatus },
        payload,
      } = await dispatch(signIn(formData));

      if (requestStatus !== "fulfilled") {
        toast.error("Incorrect the username or password.");
      }
      setIsloading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6 w-full"
      >
        <div>
          <FormInput
            name="email"
            label="Email"
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>

        <div>
          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <FormSubmit disabled={isLoading} />
      </form>
      <Loading isOpen={isLoading} />
    </FormProvider>
  );
};
