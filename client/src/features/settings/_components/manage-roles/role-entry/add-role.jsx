import React from "react";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { object, string } from "yup";

import { Loading } from "@/shared/components/loading-overlay";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { useFetch } from "@/shared/hooks/use-fetch";

import { RoleName } from "./form-role-name";
import { FormAction } from "./form-action";
import { GroupPermissions } from "./group-permission";
import { useRole } from "../../../_hooks/manage-roles/use-role";
import { SelectRoleType } from "./form-role-type";

export const AddRole = () => {
  // Define a validation schema using Yup
  const schema = object({
    name: string().required("Name is required"),
    type: object().shape({
      label: string().required("Type is Required"),
      value: string().required("Type is Required"),
    }),
  }).required();

  const methods = useForm({ resolver: yupResolver(schema) });

  const { handleSubmit } = methods;

  const { onAddNew } = useRole(methods);

  const isLoading = useSelector((state) => state.role.isLoading);

  const { data: types, isFetching } = useFetch("/setting/manage-role/types");

  return (
    <>
      <FormProvider {...methods}>
        <form className="space-y-5" onSubmit={handleSubmit(onAddNew)}>
          <div className="w-[25rem]">
            <FormSelect
              name="type"
              label="Role Type"
              options={types?.map((type) => ({
                label: type.name,
                value: type.id,
              }))}
            />
          </div>

          <div className="w-[25rem]">
            <FormInput name="name" label="Role name" />
          </div>

          <GroupPermissions />
          <FormAction />
        </form>
      </FormProvider>

      <Loading isOpen={isLoading} />
    </>
  );
};
