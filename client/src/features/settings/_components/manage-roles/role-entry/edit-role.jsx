import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";

import { Loading } from "@/shared/components/loading-overlay";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { useFetch } from "@/shared/hooks/use-fetch";

import { RoleName } from "./form-role-name";
import { FormAction } from "./form-action";
import { GroupPermissions } from "./group-permission";
import { useFetchRoleEditing } from "../../../_hooks/manage-roles/use-fetch-role-editing";
import { useRole } from "../../../_hooks/manage-roles/use-role";
import { SelectRoleType } from "./form-role-type";

export const EditRole = () => {
  const { id } = useParams();
  useFetchRoleEditing({ id });
  const isLoading = useSelector((state) => state.role.isLoading);
  const nameEditing = useSelector((state) => state.role.roleEditing?.name);
  const typeEditing = useSelector((state) => state.role.roleEditing?.type);
  const permission = useSelector((state) => state.role.roleEditing?.permission);

  const methods = useForm();
  const { handleSubmit, reset } = methods;

  //  Custom hooks
  const { onUpdate } = useRole(methods);
  const { data: types, isFetching } = useFetch("/setting/manage-role/types");

  useEffect(() => {
    if (nameEditing) {
      Object.values(permission).forEach((item) => {
        let { group_id, item_id, ...permissionItem } = item;

        Object.values(permissionItem).forEach((perItem) => {
          let name = `group_permission._${group_id}._${item_id}._${perItem.id}`;
          methods.setValue(name, perItem.value);
        });
      });
    }

    methods.setValue("name", nameEditing);
    methods.setValue("type", {
      label: typeEditing?.name,
      value: typeEditing?.id,
    });
  }, [id, nameEditing, typeEditing]);

  return (
    <>
      <FormProvider {...methods}>
        <form className="space-y-5" onSubmit={handleSubmit(onUpdate)}>
          <div className="w-[25rem]">
            <FormSelect
              name="type"
              label="Role Type"
              options={types?.map((type) => ({
                label: type.name,
                value: type.id,
              }))}
              isDisabled
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
